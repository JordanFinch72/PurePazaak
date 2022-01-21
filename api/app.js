var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const express = require("express");
const ws = require("ws");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next)
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;

/* WebSocket Data */
let allStates = {}; // Collection of game states (key: joinCode, value: state)

/* WebSocket Server */
const webSocketServer = new ws.WebSocketServer({noServer: true, clientTracking: true});

/**
 * Allows WebSocketServer to broadcast messages to multiple clients, and not just the client that sent a message
 * @param message The message to send back to connected clients
 * @param joinCode The joinCode of the clients to receive the broadcast
 */
webSocketServer.broadcast = function(message, joinCode)
{
	webSocketServer.clients.forEach((client) => {
		if(Number(client.joinCode) === Number(joinCode)) // Required as data types get mismatched by WebSocket
			client.send(JSON.stringify(message));                // Send only to clients who share joinCodes
	});
}

webSocketServer.on("connection", function(socket)
{
	socket.on("message", function(message)
	{
		// Parse the message
		message = JSON.parse(message);
		let joinCode = message['joinCode'];
		let sendState = true;

		// Add joinCode to client data to prevent broadcasts from affecting all players
		webSocketServer.clients.forEach((client) => {
			if(client === socket)
				client.joinCode = joinCode;
		});

		if(message['type'] === 'connectionData')
		{
			let player = message['user']; // First one to join is the "player"
			if(allStates[joinCode] === undefined || allStates[joinCode] === null) // Game doesn't yet exist
			{
				// Player will have automatically been redirected to the game
				// Note: Might have to wait for server to finish updating the allStates first before redirecting?
				allStates[joinCode] = { // Default game state
					player: {
						username: player.username,
						deck: player.deck,
						hand: [],
						cardZone: [],
						roundScore: 0,
						roundCount: 0,
						hasStood: false
					},
					opponent: {
						username: "Waiting for opponent",
						deck: [],
						hand: [],
						cardZone: [],
						roundScore: 0,
						roundCount: 0,
						hasStood: false
					},
					initialPlayer: null, // The person who went first at beginning of round (for alternating first turns each round)
					currentPlayer: null,
					cardPlayed: null,    // Hand index of card that has just been played
					messages: [{message: "Join code: " + joinCode, sender: "player"}],
					joinCode: joinCode   // To mirror client-side state
				};
			}
			else // Second player has joined
			{
				let opponent = message['user']; // Second one to join is the "opponent"
				allStates[joinCode] = {
					...allStates[joinCode],
					opponent: {
						...allStates[joinCode].opponent,
						username: opponent.username,
						deck: opponent.deck
					}
				};

				// TODO: Add them to "opponent"; client can check for usernames to determine what should be shown
				let response = {type: 'startGame', message: 'All players connected!', state: allStates[joinCode]};
				webSocketServer.broadcast(response, joinCode);
				sendState = false; // No need to send later
			}
		}
		else if(message['type'] === 'chatMessage')
		{
			let chatMessage = message['chatMessage']; // e.g. {sender: "player", message: "Hello, there!"} or {sender: "opponent", message: "General Kenobi!"}
			allStates[joinCode].messages.push(chatMessage);
		}
		else if(message['type'] === 'stateChange')
		{
			// TODO: Server-side validation

			// Update the server's state
			message['state'].messages = allStates[joinCode].messages; // Preserve messages in case of clash between states
			allStates[joinCode] = message['state'];
		}

		if(sendState)
		{
			// All messages need to send the state back to the client
			let response = {type: 'state', message: allStates[joinCode]};
			webSocketServer.broadcast(response, joinCode);
		}
	});
});

// Upgrades the connection to a WebSocket
const server = app.listen(80);
server.on("upgrade", (request, socket, head) =>
{
	webSocketServer.handleUpgrade(request, socket, head, socket =>
	{
		webSocketServer.emit("connection", socket, request);
	});
});

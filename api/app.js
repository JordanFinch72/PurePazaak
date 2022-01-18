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
 * Allows WebSocketServer to broadcast messages to *all* clients, and not just the client that sent a message
 * @param message The message to send back to *all* connected clients
 */
webSocketServer.broadcast = function(message)
{
	webSocketServer.clients.forEach(client => client.send(message));
}

webSocketServer.on("connection", function(socket)
{
	socket.on("message", function(message)
	{
		// Parse the message
		message = JSON.parse(message);
		let joinCode = message['joinCode'];

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
					messages: [{message: joinCode, sender: "player"}]
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
				let response = {type: 'log', message: 'All players connected!', joinCode: joinCode};
				webSocketServer.broadcast(JSON.stringify(response));
			}
		}
		else if(message['type'] === 'chatMessage')
		{
			let chatMessage = message['chatMessage']; // e.g. {sender: "player", message: "Hello, there!"} or {sender: "opponent", message: "General Kenobi!"}
			allStates[joinCode].messages.push(chatMessage);
		}

		// All messages need to send the state back to the client
		let response = {type: 'state', message: allStates[joinCode], joinCode: joinCode};
		webSocketServer.broadcast(JSON.stringify(response));
	});
});

// Converts the connection to a WebSocket
const server = app.listen(80);
server.on("upgrade", (request, socket, head) =>
{
	webSocketServer.handleUpgrade(request, socket, head, socket =>
	{
		webSocketServer.emit("connection", socket, request);
	});
});

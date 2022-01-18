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

/* Default game state */
let allStates = {};
/* WebSocket Server */
const webSocketServer = new ws.WebSocketServer({noServer: true});
webSocketServer.on("connection", function(socket)
{
	socket.on("message", function(message)
	{
		// Parse the message
		message = JSON.parse(message);
		let joinCode = message['joinCode'];
		if(message['type'] === 'createGame')
		{
			// Player will have automatically been redirected to the game
			// Note: Might have to wait for server to finish updating the allStates first before redirecting?
			allStates[joinCode] = { // Default game state
				player: {
					username: null,
					deck: [],
					hand: [],
					cardZone: [],
					roundScore: 0,
					roundCount: 0,
					hasStood: false
				},
				opponent: {
					username: null,
					deck: [],
					hand: [],
					cardZone: [],
					roundScore: 0,
					roundCount: 0,
					hasStood: false
				},
				initialPlayer: null, // The person who went first at beginning of round (for alternating first turns each round)
				currentPlayer: null,
				cardPlayed: null,     // Hand index of card that has just been played
				messages: []
			};
		}
		else if(message['type'] === 'connectionData')
		{
			let playerNumber = message['playerNumber'];

			if(allStates[joinCode] === undefined || allStates[joinCode] === null)
			{
				// Game does not exist // TODO: Make sure joinCode key is created when game is created
			}
			else // Second player has joined
			{
				let response = {type: 'response', message: 'All players connected!'};
				socket.send(JSON.stringify(response));
			}
		}
		else if(message['type'] === 'chatMessage')
		{
			let chatMessage = message['chatMessage'];
			allStates[joinCode].messages.push(chatMessage); // e.g. {sender: "player", content: "Hello, there!"} or {sender: "opponent", content: "General Kenobi!"}
		}

		// All messages need to send the state back to the client
		socket.send(JSON.stringify(allStates[joinCode]));
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

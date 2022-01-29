import React from "react";
import {Label} from "./Label";
import {CardZone} from "./CardZone";
import {RoundCounter} from "./RoundCounter";
import {HandZone} from "./HandZone";
import {Button} from "../Button";
import {ChatBox} from "./ChatBox";
import axios from "axios";

export class Gameboard extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			// Default state for Singleplayer; default state for Multiplayer is returned by server
			player: {
				username: this.props.user.username,
				displayName: this.props.user.displayName,
				deck: this.props.user.deck,
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false
			},
			opponent: this.props.opponent || {
				username: "Opponent",
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
			messages: [],
			joinCode: this.props.joinCode || null // If null, then the player is playing a CPU
		};

		this.socket = new WebSocket("ws://localhost:80", "any-protocol");

		// TODO: While these are okay against the CPU, the server will need to manage the state of multiplayer games
		//        and send the state via messages in a WebSocket.
		this.onCardClick = this.onCardClick.bind(this);
		this.onSwitchClick = this.onSwitchClick.bind(this);
		this.onGameButtonClick = this.onGameButtonClick.bind(this);
		this.onSendMessageClick = this.onSendMessageClick.bind(this);
	}


	/* Handlers */

	/**
	 *
	 * @param card
	 * @param index: Index of card from parent's perspective (e.g. cardZone index if Card in CardZone is clicked)
	 * @param zone
	 */
	onCardClick(card, index, zone)
	{
		console.log("Click!");
		let currentPlayer = this.state.currentPlayer;
		console.log(currentPlayer);
		// Check if currently active player is the user who's clicking
		if(this.isTurn(this.props.user.username))
		{
			// Check if card has already been played
			if(this.state.cardPlayed !== null)
			{
				console.log("Card already played.");
				// Allow player to withdraw card (not in original game; played card will not be shown to opponent until they hit "END TURN" or "STAND")
				if(zone === "cardzone" && card.type !== "turn")
				{
					console.log("Clicked card in cardzone; not turn card.");
					// Send card from CardZone to hand
					let hand = this.state[currentPlayer].hand;
					let cardZone = this.state[currentPlayer].cardZone;
					let roundScore = this.state[currentPlayer].roundScore;
					cardZone.splice(index, 1); // Remove card from CardZone
					hand[this.state.cardPlayed] = card;

					// Re-compute round score
					if(card.type === "special")
					{
						// TODO: Special card handling (probably easier just to reset the score to what it was at beginning of round, or use a calculateScore() function and call that)
					}
					else
					{
						roundScore -= card.value;
					}

					this.setState((prevState) => ({
						[currentPlayer]: {
							...prevState[currentPlayer],
							hand: hand,
							cardZone: cardZone,
							roundScore: roundScore
						},
						cardPlayed: null
					}), this.updateServer);
				}
			}
			else if(zone === "handzone")
			{
				console.log("Clicked card in handzone.");
				this.playCard(index);
			}
		}
	}
	onSwitchClick(playerType, card, index, mode)
	{
		// Switch card from negative to positive or vice versa
		let value = this.state.value;
		if((mode === "negative" && value > 0) || (mode === "positive" && value < 0))
			card.value = -value;

		let hand = this.state[playerType].hand;
		hand[index] = card;

		this.setState((prevState) => ({
			[playerType]: {
				...prevState[playerType],
				hand: hand
			}
		}), this.updateServer);
	}

	/**
	 *
	 * @param mode
	 */
	onGameButtonClick(mode)
	{
		if(mode === "END TURN")
		{
			if(this.isTurn(this.props.user.username))
				this.endTurn();
		}
		else if(mode === "STAND")
		{
			if(this.isTurn(this.props.user.username))
				this.stand();
		}
		else if(mode === "FORFEIT GAME")
		{
			this.forfeitGame();
		}
	}

	/* Game function handlers */
	playCard(index)
	{
		console.log("Play!");
		// Send card from hand to CardZone
		let currentPlayer = this.state.currentPlayer;
		console.log(currentPlayer);
		let hand = this.state[currentPlayer].hand;
		let card = this.state[currentPlayer].hand[index];
		let cardZone = this.state[currentPlayer].cardZone;
		let roundScore = this.state[currentPlayer].roundScore;
		delete hand[index];
		cardZone.push(card);

		console.log(currentPlayer + " is playing a card (" + index + "): ");
		console.log(card);

		// Re-compute round score
		if(card.type === "special")
		{
			// TODO: Special card handling
		}
		else
		{
			roundScore += card.value;
		}

		this.setState((prevState) => ({
			[currentPlayer]: {
				...prevState[currentPlayer],
				hand: hand,
				cardZone: cardZone,
				roundScore: roundScore
			},
			cardPlayed: index
		}),function()
			{
				if(currentPlayer === "opponent" && this.state.joinCode === null)
					this.endTurn(); // TODO: Test this for multiplayer
				else
					this.updateServer();
			});
	}
	endRound(roundWinner)
	{
		if(roundWinner !== "tie")
		{
			// Increment winner's round win counter
			this.setState((prevState) => ({
				[roundWinner]: {
					...prevState[roundWinner],
					roundCount: prevState[roundWinner].roundCount + 1
				}
			}), function()
			{
				// Detect if the winner has now won The Game
				if(this.state[roundWinner].roundCount === 3)
				{
					alert(this.state[roundWinner].displayName + " wins The Game!");

					// Multiplayer
					// TODO: Test it works for both players properly
					// TODO: Stop buttons and such from working once the game is over
					if(this.state.joinCode !== null)
					{
						let isWinner = (this.isUser(roundWinner));

						// Update leaderboard
						axios.put("leaderboards/"+this.props.user.username+"/"+this.props.user.displayName+"/"+isWinner).then((response) => {
							if(response.data.type === "error")
							{
								console.error(response.data.message);
							}
							else if(response.data.type === "success")
							{
								console.log(response);
							}
						});

						// Update user stats


					}
				}
				else
				{
					alert(this.state[roundWinner].displayName + " wins the round!");
					console.log(this.state[roundWinner].displayName + " wins the round!");

					// Clean the board
					let currentPlayer = (this.state.currentPlayer === "player") ? "opponent" : "player";
					this.setState((prevState) => ({
						player: {
							...prevState.player,
							cardZone: [],
							roundScore: false,
							hasStood: false
						},
						opponent: {
							...prevState.opponent,
							cardZone: [],
							roundScore: false,
							hasStood: false
						},
						cardPlayed: null,
						currentPlayer: currentPlayer
					}), this.startTurn)
				}
			});
		}
		else
		{
			alert("It's a tie!");
		}

		/*// Clear card zones, alternate who gets first turn
		 let firstPlayer = (this.state.initialPlayer === "player") ? "opponent" : "player";
		 this.setState((prevState) => ({
		 player: {
		 ...prevState.player,
		 cardZone: [],
		 roundScore: 0,
		 hasStood: false
		 },
		 opponent: {
		 ...prevState.opponent,
		 cardZone: [],
		 roundScore: 0,
		 hasStood: false
		 },
		 initialPlayer: firstPlayer,
		 currentPlayer: firstPlayer
		 }), this.startTurn);*/
	}
	startTurn()
	{
		let currentPlayer = this.state.currentPlayer;
		console.log(currentPlayer + "'s turn starts!");

		// Check if player has stood (and therefore cannot take a turn until the end of round)
		if(this.state[currentPlayer].hasStood)
		{
			// Skip player's turn, pass to next player
			this.endTurn();
		}
		else
		{
			// Draw turn card from the game deck (evenly distributed deck of infinite cards, so no need for an array)
			let cardValue = this.rand(1, 10);
			console.log(currentPlayer + "'s turn card: " + cardValue);

			// Add card to current player's card zone
			let cardZone = this.state[currentPlayer].cardZone;
			cardZone.push({type: "turn", value: cardValue});

			let roundScore = this.state[currentPlayer].roundScore; // TODO: 20 = automatic stand
			this.setState((prevState) => ({
				[currentPlayer]: {
					...prevState[currentPlayer],
					cardZone: cardZone,
					roundScore: prevState[currentPlayer].roundScore + cardValue
				}
			}), function()
			{
				if(this.state.joinCode === null) // Singleplayer: process CPU's turn
				{
					if(currentPlayer === "opponent")
						this.processCPUTurn();
				}
				else // Multiplayer: update server, wait for human interaction
					this.updateServer();
			});
		}
	}
	endTurn()
	{
		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = (currentPlayer === "player") ? "opponent" : "player";

		if(this.detectWinner() || this.state[currentPlayer].roundScore >= 20)
		{
			console.log(currentPlayer + " ended their turn but automatically stood");
			// Override "END TURN" and stand instead
			this.stand();
		}
		else
		{
			console.log(currentPlayer + " ended their turn");
			// End turn, pass to opponent
			this.setState({
				currentPlayer: nextPlayer,    // Pass turn to opponent
				cardPlayed: null              // "Set" player's card zone
			}, this.startTurn);               // Start next player's turn
		}
	}
	detectWinner()
	{
		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = (currentPlayer === "player") ? "opponent" : "player";

		let currentPlayerScore = this.state[currentPlayer].roundScore;
		let currentPlayerStood = this.state[currentPlayer].hasStood;
		let nextPlayerScore = this.state[nextPlayer].roundScore;
		let nextPlayerStood = this.state[nextPlayer].hasStood;

		if(currentPlayerScore > nextPlayerScore && nextPlayerStood && currentPlayerScore <= 20) // current exceeds next, next has stood
		{
			return currentPlayer;
		}
		else if(nextPlayerScore > currentPlayerScore && currentPlayerStood && nextPlayerScore <= 20) // next exceeds current, current has stood
		{
			return nextPlayer;
		}
		else if(currentPlayerScore > 20 && currentPlayerStood) // current has gone bust and stood
		{
			return nextPlayer;
		}
		else if(nextPlayerScore > 20 && nextPlayerStood) // next has gone bust and stood
		{
			return currentPlayer;
		}
		else if(currentPlayerScore <= 20 && this.state[currentPlayer].cardZone.length === 9) // current fully populates cardzone without going bust
		{
			return currentPlayer;
		}
		else if(nextPlayerScore <= 20 && this.state[nextPlayer].cardZone.length === 9) // next fully populates cardzone without going bust
		{
			return nextPlayer;
		}
		else if(currentPlayerStood && nextPlayerStood) // Both players are standing
		{
			if(currentPlayerScore > nextPlayerScore && currentPlayerScore <= 20) // current exceeds next's score
				return currentPlayer;
			else if(nextPlayerScore > currentPlayerScore && nextPlayerScore <= 20) // next exceeds current's score
				return nextPlayer;
			else if(currentPlayerScore === nextPlayerScore && currentPlayerScore <= 20 && nextPlayerScore <= 20) // current and next have equal scores, nobody bust
				return "tie";
		}
	}
	processCPUTurn()
	{
		// Singleplayer
		if(this.state.joinCode === null)
		{
			console.log("Processing CPU turn...");
			// Determine best move (rudimentary; can expand decision-making logic later)
			let opponent = this.state.opponent;
			if(opponent.roundScore > this.state.player.roundScore && this.state.player.hasStood)
			{
				// Stand, because they have beaten the other player's standing score
				this.stand();
			}
			else if(opponent.roundScore >= 14 && opponent.roundScore < 20)
			{
				// Play a + card to get to 20
				let difference = 20 - opponent.roundScore;
				let cardIndex = this.hasCard("opponent", "positive", difference);
				if(cardIndex !== false)
					this.playCard(cardIndex);
				else
					this.endTurn();
			}
			else if(opponent.roundScore === 18)
			{
				// Play +2
				let cardIndex = this.hasCard("opponent", "positive", 2);
				if(cardIndex !== false)
					this.playCard(cardIndex);
				else
					this.stand();
			}
			else if(opponent.roundScore === 19)
			{
				// Play +1
				let cardIndex = this.hasCard("opponent", "positive", 2);
				if(cardIndex !== false)
					this.playCard(cardIndex);
				else
					this.stand();
			}
			else if(opponent.roundScore === 20)
			{
				// Stand, as 20 is the best score
				this.stand();
			}
			else if(opponent.roundScore > 20 && opponent.roundScore <= 26)
			{
				// Find a negative card that can bring them to 20 or less
				let difference = opponent.roundScore - 20;
				let cardIndex;

				for(let i = 0; i < (6 - difference); ++i) // e.g. score = 23, difference = 3, search for -3 to -6
				{
					cardIndex = this.hasCard("opponent", "negative", -(difference + i));
					if(cardIndex !== false) break;
				}
				if(cardIndex !== false)
					this.playCard(cardIndex);
				else
				{
					this.stand();
				}
			}
			else if(opponent.roundScore >= 27)
			{
				// Stand, as they cannot be saved (except by special cards, to be implemented later)
				this.stand();
			}
			else
			{
				this.endTurn(); // Do nothing; wait for next card to be drawn
			}
		}
	}
	hasCard(player, type, value)
	{
		console.log(this.state[player].hand);
		let result = false;
		for(let i = 0; i < 4; ++i)
		{
			if(this.state[player].hand[i] !== undefined && this.state[player].hand[i] !== null)
			{
				let card = this.state[player].hand[i];
				let hasCard = (card.type === type && card.value === value);
				console.log("LOOKING FOR " + type + " " + value);
				console.log("HAS CARD?: " + hasCard);
				console.log(card);
				console.log("INDEX: " + i);
				if(hasCard)
				{
					result = i;
					break;
				}
			}
		}
		return result;
	}
	stand()
	{
		// End turn, set variable to prevent player from getting another turn
		let currentPlayer = this.state.currentPlayer;
		let nextPlayer = (currentPlayer === "player") ? "opponent" : "player";

		console.log(currentPlayer + " has stood");

		this.setState((prevState) => ({
			[currentPlayer]: {
				...prevState[currentPlayer],
				hasStood: true
			},
			currentPlayer: nextPlayer,    // Pass turn to opponent
			cardPlayed: null             // "Set" player's card zone
		}), function()
		{

			// Detect round win/loss conditions
			let winner = this.detectWinner();
			if(winner)
				this.endRound(winner);
			else
				this.startTurn();         // Start next player's turn
		});
	}
	forfeitGame()
	{
		// TODO
	}
	initialiseGame()
	{
		console.log("Initialising game...");
		console.log(this.state);
		console.log(this.props.user);
		let playerDeck = this.state.player.deck, opponentDeck = this.state.opponent.deck;
		let playerHand = [], opponentHand = [];

		// Shuffle deck, draw hands
		for(let i = 0; i < 500; ++i)
		{
			let card1 = this.rand(0, 9);
			let card2 = this.rand(0, 9);
			[playerDeck[card1], playerDeck[card2]] = [playerDeck[card2], playerDeck[card1]]; // Swap

			card1 = this.rand(0, 9);
			card2 = this.rand(0, 9);
			[opponentDeck[card1], opponentDeck[card2]] = [opponentDeck[card2], opponentDeck[card1]];
		}
		for(let i = 0; i < 4; ++i)
		{
			playerHand.push(playerDeck.pop());
			opponentHand.push(opponentDeck.pop());
		}

		// Determine first player
		let toss = this.rand(0, 1);
		let firstPlayer = (toss === 0) ? "player" : "opponent";

		console.log(firstPlayer + " will go first!");

		this.setState((prevState) => ({
			player: {
				...prevState.player,
				hand: playerHand
			},
			opponent: {
				...prevState.opponent,
				hand: opponentHand
			},
			initialPlayer: firstPlayer,
			currentPlayer: firstPlayer
		}), this.startTurn);
	}
	onSendMessageClick(message)
	{
		// Singleplayer
		if(this.state.joinCode === null)
		{
			let messages = this.state.messages;
			message.sender = this.getPlayerType(this.props.user.username);
			messages.push(message); // Bit weird talking to a CPU but okay, whatever floats your bantha
			this.setState({messages: messages});
		}
		else
		{
			message.sender = this.getPlayerType(this.props.user.username);
			let socketMessage = {type: "chatMessage", chatMessage: message, joinCode: this.state.joinCode};
			this.socket.send(JSON.stringify(socketMessage));
		}
	}

	componentWillMount()
	{
		// Tell multiplayer game server the join code
		if(this.state.joinCode !== null)
		{
			console.log("Connecting...");
			this.socket.onopen = () =>
			{
				console.log("Opened! Sending join code to server...");
				let message = {type: "connectionData", joinCode: this.state.joinCode, user: this.props.user};
				this.socket.send(JSON.stringify(message));
			};
			this.socket.onmessage = (response) =>
			{
				response = JSON.parse(response.data);
				console.log(response);

				if(response.type === "state")
				{
					this.setState(response.message);
				}
				else if(response.type === "log")
				{
					console.log("SOCKET LOG:");
					console.log(response.message);
				}
				else if(response.type === "startGame")
				{
					this.setState(response.state, this.initialiseGame);
				}
			};
		}

	}
	componentDidMount()
	{
		if(this.state.joinCode === null)
		{
			this.initialiseGame();
		}
	}

	/**
	 * For multiplayer sessions, this function is useful for returning whether the specified user is the "player" or the "opponent" (left or right side)
	 * @param name
	 */
	getPlayerType(name)
	{
		return (name === this.state.player.username) ? "player" : "opponent";
	}
	/**
	 * Determines if the user is the type of player specified
	 * @param type Type of player ("player" or "opponent")
	 * @returns {boolean} True if match, false if not
	 */
	isUser(type)
	{
		return (this.getPlayerType(this.props.user.username) === type);
	}
	/**
	 * Determines whether it's the specified user's turn
	 * @param name Specified user's username
	 * @param className True if for className label, false if not
	 * @returns {boolean} True if their turn, false if not
	 */
	isTurn(name)
	{
		return (this.state.currentPlayer === this.getPlayerType(name));
	}
	updateServer()
	{
		if(this.state.joinCode !== null)
		{
			let socketMessage = {type: "stateChange", state: this.state, joinCode: this.state.joinCode};
			this.socket.send(JSON.stringify(socketMessage));
		}
	}
	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	render()
	{
		let playerTurn = (this.state.currentPlayer === "player") ? " current-turn" : "";
		let opponentTurn = (this.state.currentPlayer === "opponent") ? " current-turn" : "";

		return (
			<div className={"gameboard"}>
				<div className={"third-container player-area"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.player.displayName} name={"player-name"}/>
							<CardZone isUser={this.isUser("player")} cards={this.state.player.cardZone} onCardClick={this.onCardClick}/>
						</div>
						<div className={"box" + playerTurn}>
							<Label text={this.state.player.roundScore} name={"round-score"}/>
							<RoundCounter roundCount={this.state.player.roundCount}/>
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label text={this.state.player.displayName + "'s Hand"} name={"player-hand"}/>
						<HandZone cards={this.state.player.hand} isFaceDown={this.isUser("opponent")}
						          onCardClick={this.onCardClick} onSwitchClick={this.onSwitchClick}/>
					</div>
				</div>
				<div className={"third-container chat-button-area"}>
					<div className={"chat-box-container"}>
						<ChatBox currentUser={this.props.user}
						         messages={this.state.messages}
						         onSendMessageClick={this.onSendMessageClick}/>
					</div>
					<div className={"button-container"}>
						<Button text={"END TURN"} handler={() => this.onGameButtonClick("END TURN")}/>
						<Button text={"STAND"} handler={() => this.onGameButtonClick("STAND")}/>
						<Button text={"FORFEIT GAME"} handler={() => this.onGameButtonClick("FORFEIT GAME")}/>
					</div>
				</div>
				<div className={"third-container player-area"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.opponent.displayName} name={"player-name"}/>
							<CardZone isUser={this.isUser("opponent")} cards={this.state.opponent.cardZone} onCardClick={this.onCardClick}/>
						</div>
						<div className={"box" + opponentTurn}>
							<Label text={this.state.opponent.roundScore} name={"round-score"}/>
							<RoundCounter roundCount={this.state.opponent.roundCount}/>
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label text={this.state.opponent.displayName + "'s Hand"} name={"opponent-hand"}/>
						<HandZone cards={this.state.opponent.hand} isFaceDown={this.isUser("player")}
						          onCardClick={this.onCardClick} onSwitchClick={this.onSwitchClick}/>
					</div>
				</div>
			</div>
		);
	}
}
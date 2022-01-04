import React from "react";
import {Label} from "./Label";
import {CardZone} from "./CardZone";
import {RoundCounter} from "./RoundCounter";
import {HandZone} from "./HandZone";
import {Button} from "../Button";
import {ChatBox} from "./ChatBox";

export class Gameboard extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			player: {
				username: this.props.user.username,
				deck: this.props.user.deck,
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false
			},
			opponent: { // TODO: Dummy data
				username: "The Champ",
				deck: [
					{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
					{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
					{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
					{type: "negative", value: -6}
				],
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false,
				isCPU: true
			},
			initialPlayer: null, // The person who went first at beginning of round (for alternating first turns each round)
			currentPlayer: null,
			cardPlayed: null     // Hand index of card that has just been played
		}

		this.onCardClick = this.onCardClick.bind(this);
		this.onSwitchClick = this.onSwitchClick.bind(this);
		this.onGameButtonClick = this.onGameButtonClick.bind(this);
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
		if(this.state.currentPlayer === "player")
		{
			// Check if card has already been played
			if(this.state.cardPlayed !== null)
			{
				// Allow player to withdraw card (not in original game; played card will not be shown to opponent until they hit "END TURN" or "STAND")
				if(zone === "cardzone" && card.type !== "turn")
				{
					// Send card from CardZone to hand
					let hand = this.state.player.hand;
					let cardZone = this.state.player.cardZone;
					let roundScore = this.state.player.roundScore;
					cardZone.splice(index,1);
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
						player: {
							...prevState.player,
							hand: hand,
							cardZone: cardZone,
							roundScore: roundScore
						},
						cardPlayed: null
					}));
				}
			}
			else if(zone === "handzone")
			{
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
		}));

	}

	/**
	 *
	 * @param mode
	 */
	onGameButtonClick(mode)
	{
		if(mode === "END TURN")
		{
			this.endTurn();
		}
		else if(mode === "STAND")
		{
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
		// Send card from hand to CardZone
		let currentPlayer = this.state.currentPlayer;
		let hand = this.state[currentPlayer].hand;
		let card = this.state[currentPlayer].hand[index];
		let cardZone = this.state[currentPlayer].cardZone;
		let roundScore = this.state[currentPlayer].roundScore;
		delete hand[index];
		cardZone.push(card);

		console.log(currentPlayer + " is playing a card ("+index+"): ");
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
		}), function(){
			if(currentPlayer === "opponent" && this.state.opponent.isCPU)
				this.endTurn();
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
				// Detect if the winner has now won the game
				if(this.state[roundWinner].roundCount === 3)
				{
					// TODO: Player wins
					//  - Something will need to stop two human players from posting duplicate data to the back end on win/loss;
					//  perhaps a unique entry in the database shared by both players so the result is only ever updated, not inserted

					alert(roundWinner + " wins the game!");
				}
				else
				{
					alert(roundWinner + " wins the round!");
					console.log(roundWinner + " wins the round!");
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

		// Check if player has stood (and therefore cannot take a turn until the end of round)
		if(this.state[currentPlayer].hasStood)
		{
			let oppositePlayer = (currentPlayer === "player") ? "opponent" : "player";
			if(this.state[oppositePlayer].hasStood)
			{
				// TODO: Both players have stood, so calculate result of the round
			}
			else
			{
				// Skip player's turn, pass to next player
				this.endTurn();
			}
		}
		else
		{
			// Draw turn card from the game deck (evenly distributed deck of infinite cards, so no need for an array)
			let cardValue = this.rand(1, 10);

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
			}), function(){
				if(this.state[currentPlayer].isCPU)
				{
					this.processCPUTurn();
				}
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
		else if(nextPlayerScore > currentPlayerScore && currentPlayerStood  && nextPlayerScore <= 20) // next exceeds current, current has stood
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
		else if(nextPlayerScore <= 20 && this.state[nextPlayer].cardZone.length === 9) // current fully populates cardzone without going bust
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
			let cardIndex = this.hasCard("opponent", "positive", 2)
			if(cardIndex !== false)
				this.playCard(cardIndex);
			else
				this.stand();
		}
		else if(opponent.roundScore === 19)
		{
			// Play +1
			let cardIndex = this.hasCard("opponent", "positive", 2)
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

			for(let i = 0; i < (6-difference); ++i) // e.g. score = 23, difference = 3, search for -3 to -6
			{
				cardIndex = this.hasCard("opponent", "negative", -(difference+i));
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
	hasCard(player, type, value) // TODO: Consider moving as function of player/opponent states
	{
		console.log(this.state[player].hand);
		let result = false;
		for(let i = 0; i < 4; ++i)
		{
			if(this.state[player].hand[i] !== undefined && this.state[player].hand[i] !== null)
			{
				let card = this.state[player].hand[i];
				let hasCard = (card.type === type && card.value === value)
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
			cardPlayed: null,             // "Set" player's card zone
		}), function(){

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
		// Player loses the game; opponent wins the game
	}

	componentWillMount()
	{
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

	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}



	render()
	{
		return(
			<div className={"gameboard"}>
				<div className={"third-container player-area"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.player.username} name={"player-name"} />
							<CardZone cards={this.state.player.cardZone} onCardClick={this.onCardClick} />
						</div>
						<div className={"box"}>
							<Label text={this.state.player.roundScore} name={"round-score"} />
							<RoundCounter roundCount={this.state.player.roundCount} />
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label text={this.state.player.username + "'s Hand"} name={"player-hand"} />
						<HandZone cards={this.state.player.hand} onCardClick={this.onCardClick} onSwitchClick={this.onSwitchClick} />
					</div>
				</div>
				<div className={"third-container chat-button-area"}>
					<div className={"chat-box-container"}>
						<ChatBox users={[this.state.player.username, this.state.opponent.username]} />
					</div>
					<div className={"button-container"}>
						<Button text={"END TURN"} handler={() => this.onGameButtonClick("END TURN")} />
						<Button text={"STAND"} handler={() => this.onGameButtonClick("STAND")}  />
						<Button text={"FORFEIT GAME"} handler={() => this.onGameButtonClick("FORFEIT GAME")}  />
					</div>
				</div>
				<div className={"third-container player-area"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.opponent.username} name={"player-name"} />
							<CardZone cards={this.state.opponent.cardZone} />
						</div>
						<div className={"box"}>
							<Label text={this.state.opponent.roundScore} name={"round-score"} />
							<RoundCounter roundCount={this.state.opponent.roundCount} />
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label text={this.state.opponent.username + "'s Hand"} name={"player-hand"} />
						<HandZone cards={this.state.opponent.hand} />
					</div>
				</div>
			</div>
		)
	}
}
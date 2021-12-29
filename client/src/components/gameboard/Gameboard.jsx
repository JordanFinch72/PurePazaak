import React from "react";
import {Label} from "./Label";
import {CardZone} from "./CardZone";
import {RoundCounter} from "./RoundCounter";
import {HandZone} from "./HandZone";
import {Button} from "../Button";

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
				roundCount: 0
			},
			opponent: { // TODO: Dummy data
				username: "The Champ",
				deck: [
					{type: "positive", value: "1"},{type: "positive", value: "1"},{type: "positive", value: "2"},
					{type: "negative", value: "2"},{type: "positive", value: "3"},{type: "positive", value: "3"},
					{type: "negative", value: "4"},{type: "positive", value: "4"},{type: "positive", value: "5"},
					{type: "negative", value: "6"}
				],
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0
			},
			currentTurn: null
		}

		this.onSwitchClick = this.onSwitchClick.bind(this);
	}

	onSwitchClick(playerType, card, index, mode)
	{
		// Switch card from negative to positive or vice versa
		let value = this.state.value;
		if((mode === "negative" && value > 0)
			|| mode === "positive" && value < 0)
			card.value = -value;

		let hand;
		if(playerType === "player")
			hand = this.state.player.hand;
		else if(playerType === "opponent")
			hand = this.state.opponent.hand;

		hand[index] = card;

		if(playerType === "player")
		{
			this.setState((prevState) => ({
				player: {
					...prevState.player,
					hand: hand
				}
			}));
		}
		else if(playerType === "opponent")
		{
			this.setState((prevState) => ({
				opponent: {
					...prevState.opponent,
					hand: hand
				}
			}));
		}

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
			[opponentHand[card1], opponentHand[card2]] = [opponentHand[card2], opponentHand[card1]];
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
			currentTurn: firstPlayer
		}), this.startTurn);
	}

	startTurn()
	{
		// Draw turn card from the game deck (evenly distributed deck of infinite cards, so no need for an array)
		let cardValue = this.rand(1, 10);
		console.log("TURN CARD: " + cardValue);
		if(this.state.currentTurn === "player")
		{
			let cardZone = this.state.player.cardZone;
			cardZone.push({type: "turn", value: cardValue});
			this.setState((prevState) => ({
				player: {
					...prevState.player,
					cardZone: cardZone
				}
			}));
		}
		else if(this.state.currentTurn === "opponent")
		{
			let cardZone = this.state.opponent.cardZone;
			cardZone.push({type: "turn", value: cardValue});
			this.setState((prevState) => ({
				opponent: {
					...prevState.opponent,
					cardZone: cardZone
				}
			}));
		}

	}

	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}



	render()
	{
		console.log("GAMEBOARD");

		return(
			<div className={"gameboard"}>
				<div className={"third-container"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.player.username} />
							<Label text={this.state.player.roundScore }/>
						</div>
						<div className={"box"}>
							<CardZone cards={this.state.player.cardZone} onSwitchClick={this.onSwitchClick} />
							<RoundCounter value={this.state.player.roundCount} />
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label />
						<HandZone />
					</div>
				</div>
				<div className={"third-container"}>
					<Button text={"END TURN"} handler={this.rand} />
					<Button text={"STAND"} handler={this.rand} />
					<Button text={"FORFEIT GAME"} handler={this.rand} />
				</div>
				<div className={"third-container"}>
					<div className={"cardzone-container"}>
						<div className={"box-1"}>
							<Label text={this.state.opponent.username} />
							<Label text={this.state.opponent.roundScore }/>
						</div>
						<div className={"box-2"}>
							<CardZone cards={this.state.opponent.cardZone} onSwitchClick={this.onSwitchClick} />
							<RoundCounter value={this.state.opponent.roundCount} />
						</div>
					</div>
					<div className={"handzone-container"}>
						<Label />
						<HandZone />
					</div>
				</div>
			</div>
		)
	}
}
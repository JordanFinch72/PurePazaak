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
				playZone: [{type: "positive", value: "3"}],
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
				playZone: [],
				roundScore: 0,
				roundCount: 0
			},
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

		// Shuffle deck
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

		this.setState((prevState) => ({
			player: {
				...prevState.player,
				hand: playerHand
			},
			opponent: {
				...prevState.opponent,
				hand: opponentHand
			}
		}));
	}

	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}



	render()
	{
		return(
			<div className={"gameboard"}>
				<div className={"third-container"}>
					<div className={"cardzone-container"}>
						<div className={"box"}>
							<Label text={this.state.player.username} />
							<Label text={this.state.player.roundScore }/>
						</div>
						<div className={"box"}>
							<CardZone cards={this.state.player.playZone} onSwitchClick={this.onSwitchClick} />
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
							<Label text={this.state.player.username} />
							<Label text={this.state.player.roundScore }/>
						</div>
						<div className={"box-2"}>
							<CardZone cards={this.state.player.playZone} onSwitchClick={this.onSwitchClick} />
							<RoundCounter value={this.state.player.roundCount} />
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
import React from "react";
import {Label} from "./Label";

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
				playZone: [],
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
			playerHand.add(playerDeck.pop());
			opponentHand.add(opponentDeck.pop());
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
		}))
	}

	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	render()
	{
		return(
			<div className={"gameboard"}>
				<div className={"player-area-container"}>
					<div className={"playzone-container"}>
						<div className={"box-1"}>
							<Label text={this.state.player.username} />
							<Label text={this.state.roundScores[0] }/>
						</div>
						<div className={"box-2"}>
							<PlayZone />
							<RoundCounter />
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
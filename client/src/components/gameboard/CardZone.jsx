import React from "react";
import {Card} from "./Card";

export class CardZone extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onSwitchClick = this.props.onSwitchClick.bind(this);
	}

	render()
	{
		let cardComponents = [];
		console.log("CARDZONE");
		for(let i = 0; i < 9; ++i)
		{
			let card = this.props.cards[i];
			if(card)
				cardComponents.push(<Card type={card.type} value={card.value} onSwitchClick={this.onSwitchClick} />);
			else
				cardComponents.push(<Card type={"slot"} onSwitchClick={this.onSwitchClick} />);

			console.log(card);
		}


		return(
			<div className={"cardzone"}>
				{cardComponents}
			</div>
		)
	}
}
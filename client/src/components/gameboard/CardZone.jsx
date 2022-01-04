import React from "react";
import {Card} from "./Card";
import {CardSlot} from "./CardSlot";

export class CardZone extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onCardClick = (this.props.onCardClick) ? this.props.onCardClick.bind(this) : function(){};
	}

	render()
	{
		let cardComponents = [];
		for(let i = 0; i < 9; ++i)
		{
			let card = this.props.cards[i];
			if(card)
			{
				let justPlayed = (this.props.cards[i+1] === undefined && card.type !== "turn");
				cardComponents.push(<Card card={card} index={i} key={i} justPlayed={justPlayed} zone={"cardzone"} onCardClick={this.onCardClick} />);
			}
			else
				cardComponents.push(<CardSlot key={i} />);
		}


		return(
			<div className={"cardzone"}>
				{cardComponents}
			</div>
		)
	}
}
import React from "react";
import {Card} from "./Card";
import {CardSlot} from "./CardSlot";

export class HandZone extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onCardClick = (this.props.onCardClick) ? this.props.onCardClick.bind(this) : function(){};
		this.onSwitchClick = (this.props.onSwitchClick) ? this.props.onSwitchClick.bind(this) : function(){};
	}

	render()
	{
		let cardComponents = [];
		for(let i = 0; i < 4; ++i)
		{
			let card = this.props.cards[i];
			if(card)
				cardComponents.push(<Card card={card} index={i} zone={"handzone"} onCardClick={this.onCardClick} onSwitchClick={this.onSwitchClick} isFaceDown={this.props.isFaceDown} />);
			else
				cardComponents.push(<CardSlot />);
		}


		return(
			<div className={"handzone"}>
				{cardComponents}
			</div>
		)
	}
}
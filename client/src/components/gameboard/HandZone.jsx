import React from "react";
import {Card} from "./Card";
import {CardSlot} from "./CardSlot";

export class HandZone extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onSwitchClick = this.props.onSwitchClick.bind(this);
	}

	render()
	{
		let cardComponents = [];
		for(let i = 0; i < 4; ++i)
		{
			let card = this.props.cards[i];
			if(card)
				cardComponents.push(<Card type={card.type} value={card.value} onSwitchClick={this.onSwitchClick} />);
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
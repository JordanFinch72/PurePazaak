import React from "react";

export class Card extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onCardClick = (this.props.onCardClick) ? this.props.onCardClick.bind(this) : function(){};
		this.onSwitchClick = (this.props.onSwitchClick) ? this.props.onSwitchClick.bind(this) : function(){};
	}


	render()
	{
		let lowerBoxItems = [];
		let type = this.props.card.type;
		if(type === "switch")
		{
			let item = <div onClick={this.onSwitchClick}>-</div> + <div onClick={this.onSwitchClick}>+</div>;
			lowerBoxItems.push(item);
			type = (this.props.card.value > 0) ? "positive" : "negative";
		}

		let justPlayed = (this.props.justPlayed) ? " just-played" : "";
		return(
			<div className={"card" + justPlayed} onClick={(e) => {
				this.onCardClick({type: type, value: this.props.card.value}, this.props.index, this.props.zone);
			}}>
				<div className={"upper-box " + type}>
					<div className={"value-box"}>
						{this.props.card.value}
					</div>
				</div>
				<div className={"lower-box " + type}>
					{lowerBoxItems}
				</div>
			</div>
		)
	}
}
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
		let isFaceDown = (this.props.isFaceDown) ? " facedown" : "";
		return(
			<div className={"card" + justPlayed} onClick={(e) => {
				if(!this.props.isFaceDown)
					this.onCardClick({type: type, value: this.props.card.value}, this.props.index, this.props.zone);
			}}>
				<div className={"upper-box " + type + isFaceDown}>
					<div className={"value-box"}>
						{(this.props.isFaceDown) ? "" : this.props.card.value}
					</div>
				</div>
				<div className={"lower-box " + type + isFaceDown}>
					{(this.props.isFaceDown) ? "" : lowerBoxItems}
				</div>
			</div>
		)
	}
}
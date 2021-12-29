import React from "react";

export class Card extends React.Component
{
	constructor(props)
	{
		super(props);

		this.onSwitchClick = this.props.onSwitchClick.bind(this);
	}


	render()
	{
		let lowerBoxItems = [];
		let type = this.props.type;
		if(type === "switch")
		{
			let item = <div onClick={this.onSwitchClick}>-</div> + <div onClick={this.onSwitchClick}>+</div>;
			lowerBoxItems.push(item);
			type = (this.props.value > 0) ? "positive" : "negative";
		}

		return(
			<div className={"card"}>
				<div className={"upper-box " + type}>
					<div className={"value-box"}>
						{this.props.value}
					</div>
				</div>
				<div className={"lower-box " + type}>
					{lowerBoxItems}
				</div>
			</div>
		)
	}
}
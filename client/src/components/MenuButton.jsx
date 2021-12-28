import React from "react";

export class MenuButton extends React
{
	constructor(props)
	{
		super(props);

		this.handler = this.props.handler.bind(this);
	}

	render()
	{
		return(
			<div className={"menu-button"} onClick={this.handler}>{this.props.text}</div>
		)
	}
}
import React from "react";

export class MenuButton extends React
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return(
			<div className={"menu-button"}>{this.props.text}</div>
		)
	}
}
import React from "react";

export class Menu extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			menuButtons: this.props.menuButtons
		}
	}

	render()
	{

		return(
			<div className={"main-menu"}>
				{this.state.menuButtons}
			</div>
		)
	}
}
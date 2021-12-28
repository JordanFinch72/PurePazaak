import React from "react";
import {MenuButton} from "MenuButton";

export class Menu extends React
{
	constructor(props)
	{
		super(props);
	}

	render()
	{

		return(
			<div className={"main-menu"}>
				{this.props.menuButtons}
			</div>
		)
	}
}
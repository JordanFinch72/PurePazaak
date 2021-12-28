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
		// Conditional rendering
		let menuButtons = [];
		if(this.props.currentUser !== null)
		{
			menuButtons = [
				<MenuButton text={"Singleplayer"} handler={} />,
				<MenuButton text={"Multiplayer"} handler={} />,
				<MenuButton text={"Leaderboards"} handler={} />
			];
		}

		return(
			<div></div>
		)
	}
}
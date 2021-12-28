import React from "react";

export class Menu extends React.Component
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
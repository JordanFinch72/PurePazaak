import React from "react";

export class Message extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return(
			<div className={"message " + this.props.message.sender}>
				{this.props.message.content}
			</div>
		)
	}
}
import React from "react";

export class Message extends React.Component
{
	render()
	{
		return(
			<div className={"message " + this.props.message.sender}>
				{this.props.message.message}
			</div>
		)
	}
}
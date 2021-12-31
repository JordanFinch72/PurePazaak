import React from "react";

export class ChatButton extends React.Component
{
	constructor(props)
	{
		super(props);

		this.handler = this.props.handler.bind(this);
	}

	render()
	{
		return(
			<div className={"chat-button"} onClick={this.props.handler}>
				{this.props.text}
			</div>
		)
	}
}
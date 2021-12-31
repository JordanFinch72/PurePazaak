import React from "react";

export class Button extends React.Component
{
	constructor(props)
	{
		super(props);

		this.handler = this.props.handler.bind(this);
	}

	render()
	{
		return(
			<div className={"button"} onClick={this.props.handler}>
				{this.props.text}
			</div>
		)
	}
}
import React from "react";

export class MenuButton extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			handler: this.props.handler.bind(this),
			text: this.props.text
		}
	}

	componentWillUnmount()
	{
		this.setState({handler: null, text: null});
	}

	render()
	{
		return(
			<div className={"menu-button"} onClick={this.state.handler}>{this.state.text}</div>
		)
	}
}
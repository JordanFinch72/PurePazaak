import React from "react";
import {MenuButton} from "./MenuButton";

export class JoinGameForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			joinCode: ""
		}

		this.handler = this.props.handler.bind(this);
		this.backHandler = this.props.backHandler.bind(this);
		this.onFieldChange = this.onFieldChange.bind(this);
	}

	onFieldChange(event)
	{
		const target = event.target;
		const name = target.name;
		let value = target.value;

		this.setState({
			[name]: value
		});
	}

	render()
	{
		return(
			<div className={"join-game-form"}>
				<div className={"form-item-container"}>
					<div><p>ENTER JOIN CODE:</p></div>
					<input type={"text"} name={"joinCode"} placeholder={"Join code..."} value={this.state.joinCode} onChange={this.onFieldChange} />
				</div>
				<MenuButton text={"Join Game"} handler={(e) => {
					let data = {joinCode: this.state.joinCode};
					this.handler(e, data);
				}} />
				<MenuButton text={"Back"} handler={this.backHandler} />
			</div>
		)
	}
}
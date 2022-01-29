import React from "react";
import {MenuButton} from "./MenuButton";

export class LoginForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			username: "",
			password: ""
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
	onKeyPress(event)
	{
		event = event.nativeEvent;
		if(event.keyCode === 13) // Enter
		{
			this.handler(this.state);
		}
	}

	render()
	{
		// TODO: Client-side validation
		return(
			<div className={"login-form"}>
				<div className={"form-wrapper"}>
					<div className={"form-item-container"}>
						<div className={"item-label"}><p>ENTER USERNAME:</p></div>
						<input type={"text"} name={"username"} placeholder={"Username..."} value={this.state.username}
						       onChange={this.onFieldChange} onKeyPress={(e) => this.onKeyPress(e)} />
					</div>
					<div className={"form-item-container"}>
						<div className={"item-label"}><p>ENTER PASSWORD:</p></div>
						<input type={"password"} name={"password"} placeholder={"Password..."} value={this.state.password}
						       onChange={this.onFieldChange} onKeyPress={(e) => this.onKeyPress(e)} />
					</div>
				</div>
				<div className={"buttons-container"}>
					<MenuButton text={"Login"} handler={() => {
						this.handler(this.state);
					}} />
					<MenuButton text={"Back"} handler={this.backHandler} />
				</div>
			</div>
		)
	}
}
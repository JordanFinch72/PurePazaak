import React from "react";
import {MenuButton} from "./MenuButton";

export class RegisterForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			username: "",
			password: "",
			email: ""
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
		// TODO: Client-side validation
		return(
			<div className={"register-form"}>
				<div className={"form-item-container"}>
					<div><p>ENTER USERNAME:</p></div>
					<input type={"text"} placeholder={"e.g. TheChamp69"} name={"username"} value={this.state.username} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER PASSWORD:</p></div>
					<input type={"password"} placeholder={""} name={"password"} value={this.state.password} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER E-MAIL:</p></div>
					<input type={"text"} placeholder={"e.g. thechamp69@kotor.net"} name={"email"} value={this.state.email} onChange={this.onFieldChange} />
				</div>
				<MenuButton text={"Register"} handler={(e) => {
					let data = {username: this.state.username, password: this.state.password, email: this.state.email};
					this.handler(e, data);
				}}  />
				<MenuButton text={"Back"} handler={this.backHandler} />
			</div>
		)
	}
}
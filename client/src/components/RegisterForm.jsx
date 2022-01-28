import React from "react";
import {MenuButton} from "./MenuButton";

export class RegisterForm extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			username: "",
			displayName: "",
			password: "",
			passwordConfirm: "",
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
					<input type={"text"} placeholder={"e.g. TheChamp72"} name={"username"} value={this.state.username} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER DISPLAY NAME:</p></div>
					<input type={"text"} placeholder={"e.g. The Champ"} name={"displayName"} value={this.state.displayName} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER PASSWORD:</p></div>
					<input type={"password"} placeholder={""} name={"password"} value={this.state.password} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>CONFIRM PASSWORD:</p></div>
					<input type={"password"} placeholder={""} name={"passwordConfirm"} value={this.state.passwordConfirm} onChange={this.onFieldChange} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER E-MAIL:</p></div>
					<input type={"text"} placeholder={"e.g. thechamp69@kotor.net"} name={"email"} value={this.state.email} onChange={this.onFieldChange} />
				</div>
				<MenuButton text={"Register"} handler={() => {
					let data = this.state;
					this.handler(data);
				}}  />
				<MenuButton text={"Back"} handler={this.backHandler} />
			</div>
		)
	}
}
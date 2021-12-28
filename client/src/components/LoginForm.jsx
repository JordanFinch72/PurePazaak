import React from "react";
import {MenuButton} from "MenuButton";

export class LoginForm extends React
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		// TODO: Client-side validation
		return(
			<div className={"login-form"}>
				<div className={"form-item-container"}>
					<div><p>ENTER USERNAME:</p></div>
					<input type={"text"} placeholder={"Username..."} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER PASSWORD:</p></div>
					<input type={"password"} placeholder={"Password..."} />
				</div>
				<MenuButton text={"Login"} handler={this.props.handler} />
			</div>
		)
	}
}
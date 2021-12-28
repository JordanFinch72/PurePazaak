import React from "react";
import {MenuButton} from "MenuButton";

export class RegisterForm extends React
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		// TODO: Client-side validation
		return(
			<div className={"register-form"}>
				<div className={"form-item-container"}>
					<div><p>ENTER USERNAME:</p></div>
					<input type={"text"} placeholder={"e.g. TheChamp69"} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER PASSWORD:</p></div>
					<input type={"password"} placeholder={""} />
				</div>
				<div className={"form-item-container"}>
					<div><p>ENTER E-MAIL:</p></div>
					<input type={"text"} placeholder={"e.g. thechamp69@kotor.net"} />
				</div>
				<MenuButton text={"Register"} handler={this.props.handler} />
			</div>
		)
	}
}
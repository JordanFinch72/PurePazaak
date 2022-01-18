import React from "react";
import {Message} from "./Message";
import {ChatButton} from "./ChatButton";

export class ChatBox extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			messageBox: ""
		}

		this.onSendMessageClick = this.props.onSendMessageClick.bind(this);
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
		let messages = [];
		this.props.messages.map((message, index) => {
			messages.unshift(<Message currentUser={this.props.currentUser} message={message} key={index} />); // It's done like this for scroll anchoring reasons
		});

		return(
			<div className={"chat-box"}>
				<div className={"messages-container"}>
					{messages}
				</div>
				<div className={"controls-container"}>
					<input type={"text"} placeholder={"Type a message..."} name={"messageBox"} value={this.state.messageBox} onChange={this.onFieldChange} />
					<div className={"button-container"}>
						<ChatButton text={">"} handler={(e) => {
							if(this.state.messageBox.length > 0)
							{
								let message = {message: this.state.messageBox};
								this.onSendMessageClick(message);
								this.setState({messageBox: ""})
							}
						}} />
					</div>
				</div>
			</div>
		)
	}
}
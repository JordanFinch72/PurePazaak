import React from "react";
import {Message} from "./Message";
import {ChatButton} from "./ChatButton";

export class ChatBox extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			// TODO: Dummy data. Hopefully this component can manage its own state instead of relying on Gameboard.
			//   - WebSockets will be required!
			messages: [
				{sender: "player", content: "Hello, there!"},
				{sender: "opponent", content: "General Kenobi!"},
				{sender: "player", content: "I am a bold one!"}
			],
			messageBox: ""
		}

		this.onSendClick = this.onSendClick.bind(this);
		this.onFieldChange = this.onFieldChange.bind(this);
	}

	onSendClick(e, message)
	{
		console.log(message);
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
		this.state.messages.map((message, index) => {
			messages.push(<Message message={message} key={index} />);
		});

		return(
			<div className={"chat-box"}>
				<div className={"message-container"}>
					{messages}
				</div>
				<div className={"controls-container"}>
					<input type={"text"} placeholder={"Type a message..."} name={"messageBox"} value={this.state.messageBox} onChange={this.onFieldChange} />
					<div className={"button-container"}>
						<ChatButton text={">"} handler={(e) => this.onSendClick(e, this.state.messageBox)} />
					</div>
				</div>
			</div>
		)
	}
}
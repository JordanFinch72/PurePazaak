import React from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import {MenuButton} from "./components/MenuButton";
import {LoginForm} from "./components/LoginForm";
import {RegisterForm} from "./components/RegisterForm";
import {Gameboard} from "./components/gameboard/Gameboard";

const PouchDB = require("pouchdb");

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			currentView: null,
			currentUser: {
				username: "Nadroj H'cnif",
				deck: [ // Can be changed by user at the beginning of each match (and perhaps later in a separate "Choose Deck" view)
					{type: "positive", value: "1"},{type: "positive", value: "1"},{type: "positive", value: "2"},
					{type: "negative", value: "2"},{type: "positive", value: "3"},{type: "positive", value: "3"},
					{type: "negative", value: "4"},{type: "positive", value: "4"},{type: "positive", value: "5"},
					{type: "negative", value: "6"}
				]
			},
			apiResponse: "Hey"
		};

		this.initialise = this.initialise.bind(this);
		this.onLoginClick = this.onLoginClick.bind(this);
		this.onRegisterClick = this.onRegisterClick.bind(this);
		this.authenticateUser = this.authenticateUser.bind(this);
		this.registerUser = this.registerUser.bind(this);

	}

	componentWillMount()
	{
		this.initialise();

		fetch("users")
			.then(res => res.text())
			.then(res => this.setState({apiResponse: res}));
	}

	/* Handlers */
	initialise()
	{
		let menuButtons = [
			<MenuButton text={"Sign In"} handler={this.onLoginClick} />,
			<MenuButton text={"Register"} handler={this.onRegisterClick} />
		];
		this.setState({currentView: <Menu currentUser={null} menuButtons={menuButtons} />});
	}
	onLoginClick()
	{
		let loginForm = <LoginForm handler={this.authenticateUser} backHandler={this.initialise} />
		this.setState({currentView: loginForm});
	}
	onRegisterClick()
	{
		let registerForm = <RegisterForm handler={this.registerUser} backHandler={this.initialise} />
		this.setState({currentView: registerForm});
	}
	authenticateUser(e, data)
	{
		console.log(e);
		console.log(data);
	}
	registerUser(e, data)
	{
		console.log(e);
		console.log(data);
	}

	render()
	{
		return (
			<div className="App">
				<Gameboard user={this.state.currentUser} />
				{/*this.state.currentView*/}
			</div>
		);
	}
}

export default App;

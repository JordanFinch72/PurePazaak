import React from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import {MenuButton} from "./components/MenuButton";
import {LoginForm} from "./components/LoginForm";
import {RegisterForm} from "./components/RegisterForm";

const PouchDB = require("pouchdb");

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		let menuButtons = [
			<MenuButton text={"Sign In"} handler={this.onLoginClick} />,
			<MenuButton text={"Register"} handler={this.onRegisterClick} />
		];
		this.onLoginClick = this.onLoginClick.bind(this);
		this.onRegisterClick = this.onRegisterClick.bind(this);
		this.authenticateUser = this.authenticateUser.bind(this);
		this.registerUser = this.registerUser.bind(this);

		this.state = {
			currentView: <Menu currentUser={this.state.currentUser} menuButtons={menuButtons} />, // Holds the top-level view component to be rendered to the app
			currentUser: null,
			apiResponse: "Hey"
		};

	}

	componentWillMount()
	{
		fetch("users")
			.then(res => res.text())
			.then(res => this.setState({apiResponse: res}));
	}

	/* Handlers */
	onLoginClick(e, data)
	{
		console.log(e);
		console.log(data);

		let loginForm = <LoginForm handler={this.authenticateUser} />
		this.setState({currentView: loginForm});
	}
	onRegisterClick(e, data)
	{
		console.log(e);
		console.log(data);
		let registerForm = <RegisterForm handler={this.registerUser} />
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
		// Conditional rendering
		let currentView;
		/*if(currentView === "Menu")
		{
			let menuButtons = [];
			if(this.state.currentUser !== null)
			{
				menuButtons = [
					<MenuButton text={"Singleplayer"} handler={} />,
					<MenuButton text={"Multiplayer"} handler={} />,
					<MenuButton text={"Leaderboards"} handler={} />
				];
			}
			else
			{
				menuButtons = [
					<MenuButton text={"Sign In"} handler={this.onSignInClick} />,
					<MenuButton text={"Register"} handler={this.onRegisterClick} />
				];
			}

			currentView = <Menu currentUser={this.state.currentUser} menuButtons={menuButtons} />
		}*/



		return (
			<div className="App">
				{this.state.currentView}
			</div>
		);
	}
}

export default App;

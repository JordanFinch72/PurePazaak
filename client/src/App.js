import React from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import {MenuButton} from "./components/MenuButton";
import {LoginForm} from "./components/LoginForm";
import {RegisterForm} from "./components/RegisterForm";
import {Gameboard} from "./components/gameboard/Gameboard";
import {JoinGameForm} from "./components/JoinGameForm";
import axios from "axios";
import {Leaderboards} from "./components/Leaderboards";

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			currentView: null,
			currentUser: null
		};

		// List of CPU opponents for singleplayer/campaign
		this.CPUOpponents = [
			{
				username: "The Champ",
				displayName: "The Champ",
				deck: [
					{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
					{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
					{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
					{type: "negative", value: -6}
				],
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false,
				isCPU: true
			},
			{
				username: "Atton Rand",
				displayName: "Atton Rand",
				deck: [
					{type: "positive", value: 5},{type: "positive", value: 5},{type: "positive", value: 5},
					{type: "negative", value: -3},{type: "positive", value: 1},{type: "positive", value: 1},
					{type: "negative", value: -2},{type: "positive", value: 2},{type: "positive", value: 6},
					{type: "negative", value: -6}
				],
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false,
				isCPU: true
			},
			{
				username: "Pato Ado",
				displayName: "Pato Ado",
				deck: [
					{type: "positive", value: 6},{type: "positive", value: 6},{type: "positive", value: 5},
					{type: "negative", value: -5},{type: "positive", value: 1},{type: "positive", value: 1},
					{type: "negative", value: -1},{type: "positive", value: 2},{type: "positive", value: 6},
					{type: "negative", value: -1}
				],
				hand: [],
				cardZone: [],
				roundScore: 0,
				roundCount: 0,
				hasStood: false,
				isCPU: true
			}]

		this.initialise = this.initialise.bind(this);
		this.onLoginClick = this.onLoginClick.bind(this);
		this.onRegisterClick = this.onRegisterClick.bind(this);
		this.onDemoClick = this.onDemoClick.bind(this);
		this.onSingleplayerClick = this.onSingleplayerClick.bind(this);
		this.onMultiplayerClick = this.onMultiplayerClick.bind(this);
		this.onLeaderboardsClick = this.onLeaderboardsClick.bind(this);
		this.onCreateGameClick = this.onCreateGameClick.bind(this);
		this.onJoinGameClick = this.onJoinGameClick.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.authenticateUser = this.authenticateUser.bind(this);
		this.registerUser = this.registerUser.bind(this);

	}

	componentWillMount()
	{
		this.initialise();
	}

	/* Handlers */
	initialise()
	{
		let menuButtons = [];
		if(this.state.currentUser === null)
		{
			menuButtons = [
				<MenuButton text={"Sign In"} handler={this.onLoginClick} />,
				<MenuButton text={"Register"} handler={this.onRegisterClick} />,
				<MenuButton text={"Leaderboards"} handler={this.onLeaderboardsClick} />,
				<MenuButton text={"Demo Game"} handler={this.onDemoClick} />
			];
		}
		else
		{
			menuButtons = [
				<MenuButton text={"Singleplayer"} handler={this.onSingleplayerClick} />,
				<MenuButton text={"Multiplayer"} handler={this.onMultiplayerClick} />,
				<MenuButton text={"Leaderboards"} handler={this.onLeaderboardsClick} />
			];
		}
		this.setState({currentView: <Menu currentUser={this.state.currentUser} menuButtons={menuButtons} />})
	}
	onLoginClick()
	{
		let loginForm = <LoginForm handler={this.authenticateUser} backHandler={this.initialise} />;
		this.setState({currentView: loginForm});
	}
	onRegisterClick()
	{
		let registerForm = <RegisterForm handler={this.registerUser} backHandler={this.initialise} />;
		this.setState({currentView: registerForm});
	}
	onDemoClick()
	{
		// Set them up with a fake name and default opponent
		let user = {
			username: "Nadroj H'cnif",
			displayName: "Nadroj H'cnif",
			deck: [
				{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
				{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
				{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
				{type: "negative", value: -6}
			]
		}
		let opponent = {
			username: "The Champ",
			displayName: "The Champ",
			deck: [
				{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
				{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
				{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
				{type: "negative", value: -6}
			],
			hand: [],
			cardZone: [],
			roundScore: 0,
			roundCount: 0,
			hasStood: false
		};
		let gameBoard = <Gameboard user={user} joinCode={null} opponent={opponent} />;
		this.setState({currentView: gameBoard});
	}
	onSingleplayerClick(e, data)
	{
		// Choose from random opponent // TODO: Progression system later, or allow players to choose opponent
		let opponent = this.CPUOpponents[this.rand(0, this.CPUOpponents.length-1)];
		this.setState({currentView: <Gameboard user={this.state.currentUser} opponent={opponent} joinCode={null} />});
	}
	onMultiplayerClick(e, data)
	{
		let menuButtons = [
			<MenuButton text={"Create Game"} handler={this.onCreateGameClick} />,
			<MenuButton text={"Join Game"} handler={this.onJoinGameClick} />
		];
		// For React reasons, must destroy <Menu> in state.currentView before it can be replaced by a new one
		this.setState(() => {
			this.setState({currentView: null});
		}, function(){
			this.setState({currentView: <Menu currentUser={this.state.currentUser} menuButtons={menuButtons} />});
		});
	}
	onLeaderboardsClick(e, data)
	{
		this.setState({currentView: <Leaderboards backHandler={this.initialise} />})
	}
	onCreateGameClick(e, data)
	{
		// Generate joinCode for multiplayer game
		let joinCode = this.rand(0, 999999999);
		this.setState({currentView: <Gameboard user={this.state.currentUser} joinCode={joinCode} opponent={null} />});
	}
	onJoinGameClick(e, data)
	{
		let joinGameForm = <JoinGameForm handler={this.joinGame} backHandler={this.initialise} />;
		this.setState({currentView: joinGameForm});
	}
	joinGame(e, data)
	{
		// Create Gameboard with joinCode, which tells the Gameboard component that it's a multiplayer game
		this.setState({currentView: <Gameboard user={this.state.currentUser} joinCode={data.joinCode} opponent={null} />});
	}

	authenticateUser(data)
	{
		// Connect to database, authenticate, retrieve username/deck from database
		let username = data.username;
		let password = data.password;

		axios.get("users/"+username+"/"+password).then((response) => {
			if(response.data.type === "error")
			{
				console.error(response.data.message);
				alert(response.data.message);
			}
			else if(response.data.type === "success")
			{
				console.log(response.data);
				if(response.data.message === "User found.")
				{
					this.setState({currentUser: response.data.user}, this.initialise);
				}
			}
		});
	}
	registerUser(data)
	{
		// TODO: Client-side validation
		let errorCollector = "";
		let username = data.username;
		let displayName = data.displayName;
		let password = data.password;
		let passwordConfirm = data.passwordConfirm;
		let email = data.email;
		console.log(data);

		// Send request to server
		if(errorCollector.length <= 0)
		{
			axios.put("users/"+username+"/"+displayName+"/"+password+"/"+email).then((response) => {
				if(response.data.type === "error")
				{
					if(response.data.message === "Username taken.")
						alert("Username taken."); // TODO: Proper responses (toasts, perhaps)
					else
						console.error(response.data.message);
				}
				else if(response.data.type === "success")
				{
					if(response.data.message === "User created.")
					{
						alert("Profile created!");
						this.initialise(); // Reset view
					}
				}
			});
		}

		console.log(data);
	}
	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	render()
	{
		let header;
		let currentView = this.state.currentView.type.name;

		// Render header only if currentView is not the gameboard
		if(currentView !== "Gameboard")
		{
			let text = "Pure Pazaak";
			if(currentView === "LoginForm") text = "Sign In";
			else if(currentView === "RegisterForm") text = "Register";
			else if(currentView === "Leaderboards") text = "Leaderboards";

			header =
				<div className={"header-container"}>
					<div className={"header"}>
						<h1>{text}</h1>
					</div>
				</div>;
		}

		return (
			<div className="App">
				{header}
				{this.state.currentView}
			</div>
		);
	}
}

export default App;

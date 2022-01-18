import React from "react";
import "./App.css";
import {Menu} from "./components/Menu";
import {MenuButton} from "./components/MenuButton";
import {LoginForm} from "./components/LoginForm";
import {RegisterForm} from "./components/RegisterForm";
import {Gameboard} from "./components/gameboard/Gameboard";
import {JoinGameForm} from "./components/JoinGameForm";

const PouchDB = require("pouchdb");

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			currentView: null,
			currentUser: null,
			apiResponse: "Hey"
		};

		// List of CPU opponents for singleplayer/campaign
		this.CPUOpponents = [
			{
			username: "The Champ",
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

		fetch("users")
			.then(res => res.text())
			.then(res => this.setState({apiResponse: res}));
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
			deck: [
				{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
				{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
				{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
				{type: "negative", value: -6}
			]
		}
		let opponent = {
			username: "The Champ",
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
		};
		let gameBoard = <Gameboard user={user} joinCode={null} opponent={opponent} />;
		this.setState({currentView: gameBoard});
	}
	onSingleplayerClick(e, data)
	{
		// Choose from random opponent // TODO: Progression system later, or allow players to choose opponent
		let opponent = this.CPUOpponents[this.rand(0, this.CPUOpponents.length-1)];
		this.setState({currentView: <Gameboard user={this.state.currentUser} opponent={opponent} joinCode={null} />});

		console.log(e);
		console.log(data);
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
		})

		console.log(e);
		console.log(data);
	}
	onLeaderboardsClick(e, data)
	{
		console.log(e);
		console.log(data);
	}
	onCreateGameClick(e, data)
	{
		// Generate joinCode, allow user to copy
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

	authenticateUser(e, data)
	{
		// TODO: Connect to database, authenticate, retrieve username/deck from database
		data.user = { // TODO: Dummy data
			username: "Jordan Finch " + this.rand(0, 999),
			deck: [ // Can be changed by user at the beginning of each match (and perhaps later in a separate "Choose Deck" view); is all stored in and retrieved from database
				{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
				{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
				{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
				{type: "negative", value: -6}
			]
		};
		this.setState({currentUser: data.user}, this.initialise);
		console.log(e);
		console.log(data);
	}
	registerUser(e, data)
	{
		console.log(e);
		console.log(data);
	}
	rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	render()
	{
		return (
			<div className="App">
				{this.state.currentView}
			</div>
		);
	}
}

export default App;

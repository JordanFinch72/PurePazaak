import {getAllByText, render, screen} from "@testing-library/react";
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";
import App from './App';
import userEvent from "@testing-library/user-event";
import {Gameboard} from "./components/gameboard/Gameboard";

/* Test variables */
let rootContainer;

// Set up tests
beforeEach(() => {
	rootContainer = document.createElement("div");
	document.body.appendChild(rootContainer);
});

// Tear down tests
afterEach(() => {
	document.body.appendChild(rootContainer);
	rootContainer = null;
});

/* Main View Tests */
describe("Main View Tests", () => {
	it("Loads the correct menu buttons if no user is signed in.", () => {
		const app = render(<App />);

		// Find buttons
		let button1 = app.getByText("Quick Play");
		let button2 = app.getByText("Sign In");
		let button3 = app.getByText("Register");
		let button4 = app.getByText("Leaderboards");

		[button1, button2, button3, button4].forEach((element) => {
			expect(element).toBeInTheDocument();
		});
	});

	it("Loads the correct menu buttons if the user is signed in.", () => {
		const app = render(<App currentUser={{username: "j0rd"}} />);

		// Find buttons
		let button1 = app.getByText("Singleplayer");
		let button2 = app.getByText("Multiplayer");
		let button3 = app.getByText("Leaderboards");

		[button1, button2, button3].forEach((element) => {
			expect(element).toBeInTheDocument();
		});
	});

	it("Transitions between multiple views when buttons are clicked.", async () => {

		/* NOT SIGNED IN */
		// Click buttons, search for appropriate elements to confirm transition
		let app = render(<App />);
		let button1 = app.getByText("Quick Play");
		await userEvent.click(button1);
		let endTurn = app.getByText("END TURN");
		expect(endTurn).toBeInTheDocument();

		app = render(<App />);
		let button2 = app.getByText("Sign In");
		await userEvent.click(button2);
		let header = app.getAllByText("Sign In");
		expect(header[0].parentElement).toHaveClass("header");

		app = render(<App />);
		let button3 = app.getByText("Register");
		await userEvent.click(button3);
		header = app.getAllByText("Register");
		expect(header[0].parentElement).toHaveClass("header");

		app = render(<App />);
		let button4 = app.getByText("Leaderboards");
		await userEvent.click(button4);
		header = app.getByText("Leaderboards");
		expect(header.parentElement).toHaveClass("header");


		/* SIGNED IN */
		let user = {
			username: "user_j0rd",
			displayName: "Kan Winstari",
			deck: [
				{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
				{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
				{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
				{type: "negative", value: -6}
			]
		}

		// Click buttons, search for appropriate elements to confirm transition
		app = render(<App currentUser={user} />);
		button1 = app.getAllByText("Singleplayer");
		await userEvent.click(button1[0]);
		endTurn = app.getAllByText("END TURN");
		expect(endTurn[0]).toBeInTheDocument();

		app = render(<App currentUser={user} />);
		button2 = app.getByText("Multiplayer");
		await userEvent.click(button2);
		let createGame = app.getByText("Create Game");
		expect(createGame).toHaveClass("menu-button");

		app = render(<App currentUser={user} />);
		button3 = app.getAllByText("Leaderboards");
		await userEvent.click(button3[0]);
		header = app.getAllByText("Leaderboards");
		expect(header[0].parentElement).toHaveClass("header");
	});
});

/* Gameboard Tests */
describe("Gameboard Tests", () => {

	// Props
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

	// Tests
	it("Generates a turn card for the first player on start.", () => {
		let gameboard = render(<Gameboard user={user} joinCode={null} opponent={opponent} />);

		// Find all positive cards
		let possibleTurnCards = [];
		possibleTurnCards[0] = gameboard.queryAllByText("1");
		possibleTurnCards[1] = gameboard.queryAllByText("2");
		possibleTurnCards[2] = gameboard.queryAllByText("3");
		possibleTurnCards[3] = gameboard.queryAllByText("4");
		possibleTurnCards[4] = gameboard.queryAllByText("5");
		possibleTurnCards[5] = gameboard.queryAllByText("6");
		possibleTurnCards[6] = gameboard.queryAllByText("7");
		possibleTurnCards[7] = gameboard.queryAllByText("8");
		possibleTurnCards[8] = gameboard.queryAllByText("9");
		possibleTurnCards[9] = gameboard.queryAllByText("10");

		// Check for turn card
		let turnCardFound = false;
		for(let i = 0; i < possibleTurnCards.length; ++i)
		{
			if(possibleTurnCards[i].length > 0)
			{
				for(let j = 0; j < possibleTurnCards[i].length; ++j)
				{
					let element = possibleTurnCards[i][j];
					if(element.parentElement.className.indexOf("turn") !== -1)
					{
						turnCardFound = true;
						break;
					}
				}
			}
		}

		// Assert that there is a turn card
		expect(turnCardFound).toBeTruthy();
	});
});
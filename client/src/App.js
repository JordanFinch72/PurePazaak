import React from "react";
import "./App.css";
import {Menu} from "components/Menu";

const PouchDB = require("pouchdb");

class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			currentView: <Menu />, // Holds the top-level view to be rendered to the app
			apiResponse: "Hey"
		};

	}

	componentWillMount()
	{
		fetch("users")
			.then(res => res.text())
			.then(res => this.setState({apiResponse: res}));
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

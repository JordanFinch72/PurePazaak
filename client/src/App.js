import React from "react";
import logo from './logo.svg';
import './App.css';
const PouchDB = require("pouchdb");

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      apiResponse: "Hey"
    }

  }

  componentWillMount() {
    fetch("users")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  render()
  {
    return (
        <div className="App">
          <p>{this.state.apiResponse}</p>
        </div>
    );
  }
}

export default App;

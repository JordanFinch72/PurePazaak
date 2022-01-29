import React from "react";
import axios from "axios";
import {MenuButton} from "./MenuButton";

class Arrow extends React.Component
{
	constructor(props)
	{
		super(props);
		this.onArrowClick = this.props.onArrowClick.bind(this);
	}


	render()
	{
		return(
			<div className={"arrow " +this.props.orientation} onClick={(e) => {
				this.onArrowClick(this.props.orientation);
			}}>
				->
			</div>
		);
	}
}

class Standing extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		let username = this.props.username.slice(5, this.props.username.length);

		return(
			<div className={"standing"}>
				<div className={"name"}>{username + " ("+this.props.displayName+")"}</div>
				<div className={"wins"}>{this.props.periodWins}</div>
				<div className={"plays"}>{this.props.periodPlays}</div>
			</div>
		);
	}
}

export class Leaderboards extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state = {
			tabs: ["allTime", "daily", "weekly", "monthly"], // All tabs
			activeTab: 0,  // Tab currently being viewed
			leaderboards: {}  // All leaderboards
		}

		this.onArrowClick = this.onArrowClick.bind(this);
		this.backHandler = this.props.backHandler.bind(this);
	}

	onArrowClick(direction)
	{
		let activeTab = this.state.activeTab;
		if(direction === "left")
			activeTab = (activeTab === 0) ? this.state.tabs.length-1 : activeTab-1; // Go left in the tabs array
		else if(direction === "right")
			activeTab = (activeTab === this.state.tabs.length-1) ? 0 : activeTab+1;

		this.setState({activeTab: activeTab});
	}

	componentWillMount()
	{
		axios.get("leaderboards/").then((response) => {
			if(response.data.type === "error")
			{
				console.error(response.data.message);
				alert(response.data.message);
			}
			else if(response.data.type === "success")
			{
				console.log(response.data);
				if(response.data.message === "Leaderboards retrieved.")
				{
					this.setState({leaderboards: response.data.leaderboards});
				}
			}
		});
	}

	render()
	{
		// Render active leaderboard
		let activeTab = this.state.tabs[this.state.activeTab];
		const leaderboard = this.state.leaderboards[activeTab];
		activeTab = (activeTab === "allTime") ? "All Time" : activeTab; // Parse active leaderboard label

		console.log("RENDER");
		console.log(this.state.leaderboards);

		let leaderboardStandings = [];
		if(leaderboard !== undefined)
		{
			const standings = leaderboard.standings;
			for(const username in standings)
			{
				if(standings.hasOwnProperty(username))
				{
					const {displayName, periodWins, periodPlays} = standings[username];
					leaderboardStandings.push(<Standing username={username} displayName={displayName} periodWins={periodWins} periodPlays={periodPlays} key={username} />);
				}
			}
		}

		return(
			<div className={"leaderboards"}>
				<div className={"tabs-selector"}>
					<Arrow orientation={"left"} onArrowClick={this.onArrowClick} />
					<div className={"active-tab"}><h2>{activeTab}</h2></div>
					<Arrow orientation={"right"} onArrowClick={this.onArrowClick} />
				</div>
				<div className={"leaderboard"}>
					<div className={"headers"}>
						<div className={"name"}>Player Name</div>
						<div className={"wins"}>Wins</div>
						<div className={"plays"}>Plays</div>
					</div>
					{leaderboardStandings}
				</div>
				<div className={"buttons-container"}>
					<MenuButton text={"Back"} handler={this.backHandler} />
				</div>
			</div>
		);
	}
}
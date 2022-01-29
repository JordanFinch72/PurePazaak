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
		let username = this.props.username.slice(5, this.props.username.length); // Trim the "user_" from the username

		return(
			<div className={"standing"}>
				<div className={"rank"}>{`#${this.props.rank}`}</div>
				<div className={"name"}>{`${username} (${this.props.displayName})`}</div>
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
			tabs:
				[
					["allTime", "Wins"], ["allTime", "Win %"], ["daily", "Wins"], ["daily", "Win %"],
					["weekly", "Wins"], ["weekly", "Win %"], ["monthly", "Wins"], ["monthly", "Win %"]
				],            // All tabs
			activeTab: 0,     // Tab currently being viewed
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
		/* Render active leaderboard */
		let activeTab = this.state.tabs[this.state.activeTab][0];  // Leaderboard label
		const sortMode = this.state.tabs[this.state.activeTab][1]; // Leaderboard sorting order
		let leaderboard = this.state.leaderboards[activeTab];      // Leaderboard data
		activeTab = (activeTab === "allTime") ? "All Time" : activeTab; // Parse active leaderboard label
		const sortOrder = "desc"; // TODO: Consider allowing users to change sorting order

		let leaderboardStandings = [];
		if(leaderboard !== undefined)
		{
			// Sort leaderboard (without mutating original array)
			const standings = [...leaderboard.standings].sort(function(a, b)
			{
				if(sortMode === "Wins" && sortOrder === "desc") // Wins (highest->lowest)
					return b.periodWins - a.periodWins;
				else if(sortMode === "Wins" && sortOrder === "asc") // Wins (lowest->highest)
					return a.periodWins - b.periodWins;
				else if(sortMode === "Win %" && sortOrder === "desc")
					return (b.periodWins / b.periodPlays) - (a.periodWins / a.periodPlays);
				else if(sortMode === "Win %" && sortOrder === "asc")
					return (a.periodWins / a.periodPlays) - (b.periodWins / b.periodPlays);
				/*else if(sortMode === "Plays" && sortOrder === "desc")
					return b.periodPlays - a.periodPlays;
				else if(sortMode === "Plays" && sortOrder === "asc")
					return a.periodPlays - b.periodPlays;*/
			});

			// Generate components
			for(let i = 0; i < standings.length; ++i)
			{
				let standing = standings[i];
				const {username, displayName, periodWins, periodPlays} = standing;
				leaderboardStandings.push(<Standing rank={i} key={i} username={username} displayName={displayName} periodWins={periodWins} periodPlays={periodPlays} />);
			}
		}

		return(
			<div className={"leaderboards"}>
				<div className={"tabs-selector"}>
					<Arrow orientation={"left"} onArrowClick={this.onArrowClick} />
					<div className={"active-tab"}>
						<h2>{activeTab} <span style={{color: "#E2E2E2"}}>[{sortMode}]</span></h2>
					</div>
					<Arrow orientation={"right"} onArrowClick={this.onArrowClick} />
				</div>
				<div className={"leaderboard"}>
					<div className={"headers"}>
						<div className={"rank"}>Rank</div>
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
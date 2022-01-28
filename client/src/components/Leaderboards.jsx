import React from "react";
import axios from "axios";

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
		return(
			<div className={"standing"}>
				<div className={"display-name"}>{this.props.displayName}</div>
				<div className={"wins"}>{this.props.wins}</div>
				<div className={"plays"}>{this.props.plays}</div>
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
			leaderboards: []  // All leaderboards
		}

		this.onArrowClick = this.onArrowClick.bind(this);
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

	componentDidMount()
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
		const standings = this.state.leaderboards[activeTab];
		activeTab = (activeTab === "allTime") ? "All Time" : activeTab.toUpperCase(); // Parse active leaderboard label

		const leaderboardStandings = standings.map((user, index) => {
			return <Standing displayName={user.displayName} wins={user.periodWins} plays={user.periodPlays} key={index} />;
		});

		return(
			<div className={"leaderboards"}>
				<div>
					<h1>Leaderboards</h1>
				</div>
				<div className={"tabs-selector"}>
					<Arrow orientation={"left"} onArrowClick={this.onArrowClick} />
					<h2>{activeTab}</h2>
					<Arrow orientation={"right"} onArrowClick={this.onArrowClick} />
				</div>
				<div className={"leaderboard"}>
					<div className={"headers"}>
						<div className={"display-name"}>Player Name</div>
						<div className={"wins"}>Wins</div>
						<div className={"plays"}>Plays</div>
					</div>
					{leaderboardStandings}
				</div>
			</div>
		);
	}
}
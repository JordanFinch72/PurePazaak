import React from "react";

export class RoundCounter extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		let pips = [];
		let roundCount = this.props.roundCount;
		for(let i = 0; i < 3; ++i)
		{
			if(roundCount-- > 0)
				pips.push(<div className={"pip full"}></div>);
			else
				pips.push(<div className={"pip"}></div>);
		}


		return(
			<div className={"round-counter"}>
				{pips}
			</div>
		)
	}
}
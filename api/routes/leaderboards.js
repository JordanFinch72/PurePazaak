let express = require("express");
let router = express.Router();
const PouchDB = require("pouchdb");

// Database
let db = new PouchDB("http://localhost:5984/pure-pazaak", {
	headers: {
		Authorization: "Basic " + btoa("admin" + ":" + ".PAQWQ6o1Jo") // TODO: Obviously, this is horrendous
	}
});
const leaderboardKeys = ["allTime", "daily", "weekly", "monthly"];

//=================================================== LEADERBOARDS ===================================================//
// Mechanism:                                                                                                         //
//  1) Place user on leaderboard for the <period> after first game of that <period> (where <period> is every game,    //
//  every 24 hours, every month, all time, etc.)                                                                      //
//  2) After every game, update that user's stats on the leaderboard, re-compute leaderboard to determine rank        //
//       - Adding +1 to the user if it exists in the leaderboard, or adding them otherwise, of course                 //
//  3) After every <period> interval, wipe the <period> leaderboards                                                  //
//         - CRON job? Or perhaps perform the wiping operation when the first GET of that period is made (week and    //
//         month documents will need variable to check against, then)                                                 //
//====================================================================================================================//

/* Retrieve leaderboards' standings */
router.get("/", function(req, res, next)
{
	let leaderboards = {}

	// Retrieve all leaderboards
	db.allDocs({
		include_docs: true,
		startkey: "leaderboard_",
		endkey: "leaderboard_\ufff0"
	}).then(function(result)
	{
		let rows = result.rows;
		for(let i = 0; i < leaderboardKeys.length; ++i)
		{
			let key = leaderboardKeys[i];
			for(let j = 0; j < rows.length; ++j)
			{
				// Row contains leaderboard key
				if(rows[j].id === "leaderboard_"+key)
				{
					leaderboards[key] = {standings: rows[j].doc.standings};
				}
			}
		}
		res.send({type: "success", message: "Leaderboards retrieved.", leaderboards: leaderboards});
	}).catch(function(error)
	{
		res.send({type: "error", message: "Error : " + error.error});
	});
});

/* Update leaderboards' standings */
router.put("/:username/:displayName/:winner", function(req, res, next)
{
	let username = req.params.username;
	let displayName = req.params.displayName;
	let modifier = (req.params.winner === true || req.params.winner === "true") ? 1 : 0;
	let error = false;

	// TODO: Consider converting to bulkDocs (if it's possible to get and update in the same operation)
	for(let i = 0; i < leaderboardKeys.length; ++i)
	{
		let key = leaderboardKeys[i];

		// TODO: Logic for wiping leaderboards at specific dates/intervals
		//         - Set standings to [] instead of doc.standings to wipe before continuing with regular process

		// Update each leaderboard
		db.get("leaderboard_"+key).then(function(doc)
		{
			let standings = doc.standings;

			// Search for username in standings
			let usernameIndex = null;
			for(let j = 0; j < standings.length; ++j)
			{
				if(standings[j].username === username)
				{
					usernameIndex = j;
					break;
				}
			}

			// User already has standing in leaderboard
			if(usernameIndex !== null)
			{
				standings[usernameIndex].periodWins += modifier;
				standings[usernameIndex].periodPlays += 1;
			}
			else // User is yet to have standing in leaderboard
			{
				standings.push({
					username: username,
					displayName: displayName,
					periodWins: modifier,
					periodPlays: 1
				});
			}
			return db.put({
				_id: doc._id,
				_rev: doc._rev,
				standings: standings
			});
		}).then(function(response)
		{
			error = !response.ok;

			if(i === leaderboardKeys.length-1) // Final PUT
			{
				// Send success message, or generic server error message if one occurred
				if(!error)
					res.send({type: "success", message: "Leaderboards updated."});
				else
					res.send({type: "error", message: "Server error."});
			}
		}).catch(function(error)
		{
			res.send({type: "error", message: "Error: " + error.error});
			i = 99; // Cheeky way to break (prevents server header error from re-sending header through res after sending this error)
		});
	}


});

module.exports = router;
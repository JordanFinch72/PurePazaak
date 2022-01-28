let express = require("express");
let router = express.Router();
const PouchDB = require("pouchdb");

// Database
let db = new PouchDB("http://localhost:5984/pure-pazaak", {
	headers: {
		Authorization: "Basic " + btoa("admin" + ":" + ".PAQWQ6o1Jo") // TODO: Obviously, this is horrendous
	}
});

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
	let leaderboards = {allTime: {}, daily: {}, weekly: {}, monthly: {}}

	// Retrieve all leaderboards
	for(let key in leaderboards)
	{
		if(leaderboards.hasOwnProperty(key))
		{
			db.get("leaderboards_"+key).then((doc) => {
				leaderboards[key] = {standings: doc.standings};
			}).catch((error) => {
				res.send({type: "error", message: "Error : " + error.error})
			});
		}
	}
	res.send({type: "success", message: "Leaderboards retrieved.", leaderboards: leaderboards});
});

/* Update one leaderboard's standings */
router.put("/:leaderboard/:username/:win", function(req, res, next)
{
	let leaderboard = req.params.leaderboard;
	let username = req.params.username;
	let modifier = (req.params.win) ? 1 : 0;

	db.get("leaderboard_"+leaderboard).then(function(doc)
	{
		let standings = doc.standings;
		// User already has standing in leaderboard
		if(standings[username] !== undefined)
		{
			standings[username].periodWins += modifier;
			standings[username].periodPlays += 1;
		}
		else // User is yet to have standing in leaderboard
		{
			standings[username] = {
				periodWins: modifier,
				periodPlays: 1
			};
		}
		return db.put({
			_id: doc._id,
			_rev: doc._rev,
			standings: standings
		});
	}).then(function(response)
	{
		if(response.ok)
			res.send({type: "success", message: "Leaderboard updated.", response: response});
		else
			res.send({type: "error", message: "Server error."});

	}).catch(function(error)
	{
		res.send({type: "error", message: "Error: " + error.error});
	});

});

module.exports = router;
let express = require("express");
let router = express.Router();
const PouchDB = require("pouchdb");

// Database
let db = new PouchDB("http://localhost:5984/pure-pazaak", {
	headers: {
		Authorization: "Basic " + btoa("admin" + ":" + ".PAQWQ6o1Jo") // TODO: Obviously, this is horrendous
	}
});

// bcrypt (for encrypting/decrypting passwords)
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of rounds to salt (recommended by bcrypt author)

/* Retrieve user by username and (salt-hashed) password */
router.get("/:username/:password", function(req, res, next)
{
	let username = req.params.username;
	let password = req.params.password;

	db.get("user_" + username).then(function(doc)
	{
		// Compare password
		bcrypt.compare(password, doc.password, function(err, result)
		{
			// Passwords match
			if(result)
			{
				let user = {
					username: doc._id,
					displayName: doc.displayName,
					deck: doc.deck
				};
				res.send({type: "success", message: "User found.", user: user});
			}
			else
				res.send({type: "error", message: "Password incorrect."});
		});
	}).catch(function(error)
	{
		if(error.error === "not_found")
			res.send({type: "error", message: "Username not found in database."});
	});

});

/* Insert/update user */
router.put("/:username/:displayName/:password/:email", function(req, res, next)
{
	let username = req.params.username;
	let displayName = req.params.displayName;
	let password = req.params.password;
	let email = req.params.email;

	db.get("user_" + username).then(function()
	{
		res.send({type: "error", message: "Username taken."});
	}).catch(function(error)
	{
		// Username doesn't already exist; create user
		if(error.error === "not_found")
		{
			// Generate salt
			bcrypt.genSalt(saltRounds, function(err, salt)
			{
				// Salt and hash password
				bcrypt.hash(password, salt, function(err, hash)
				{
					let doc = {
						"_id": "user_" + username,
						"displayName": displayName,
						"password": hash,
						"email": email,
						"deck": [
							// Can be changed by user at the beginning of each match (and perhaps later in a separate "Choose Deck" view); is all stored in and retrieved from database
							{type: "positive", value: 1},{type: "positive", value: 1},{type: "positive", value: 2},
							{type: "negative", value: -2},{type: "positive", value: 3},{type: "positive", value: 3},
							{type: "negative", value: -4},{type: "positive", value: 4},{type: "positive", value: 5},
							{type: "negative", value: -6}
						],
						"wins": 0,
						"losses": 0,
						"longest_win_streak": 0,
						"longest_loss_streak": 0
					};
					db.put(doc).then(function()
					{
						res.send({type: "success", message: "User created."});
					}).catch(function(error)
					{
						res.send({type: "error", message: "Error: " + error.error});
					});
				});
			});
		}
	});

});

module.exports = router;

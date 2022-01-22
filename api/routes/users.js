let express = require('express');
let router = express.Router();
const PouchDB = require("pouchdb");

let db = new PouchDB("http://localhost:5984/pure-pazaak", {headers: {
    Authorization: 'Basic ' + btoa("admin" + ':' + ".PAQWQ6o1Jo") // TODO: Obviously, this is horrendous
  }});


db.info().then(function (info) {
  console.log(info);
}).catch(function(e){
  console.error(e);
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with aeee resource');
});

module.exports = router;

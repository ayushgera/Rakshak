var express = require('express');
var router = express.Router();
var googleDistance = require("google-distance");
var data = require('../model/data'); //TODO: replace with dbService

/* GET home page. */
/*router.get('/', function(req, res, next) {
  console.log("*******ENTRY POINT******");
  res.send("*******EUREKA******");
});*/

router.get('/alert', function(req, res, next){
  res.send("SEND ALERT");
});

router.get('/responders', function(req, res, next){
  res.send(data.responders);
});

router.get('/map', function(req, res, next){
  googleDistance.get({
		origins: ['San Francisco, CA','San Diego, CA'],
		destinations: ['San Diego, CA','Seattle, WA']
	},
	function(err, data) {
	if (err) return console.log(err);
		res.send(data);
	});
});

//add responder
router.post('/responders', function(req, res) { 
	//if (data.responders[req.body.id]) {
	//	res.send('Conflict', 409); 
	//} else {
		//TODO: check if it already exists in db, if not add responder to db
		data.responders.push(req.body.responder);
		//TODO: register responder to the type of servie he opts to, using responderRegisterService
		//registerResponder(req.body.serviceType, req.body.responder);
		res.redirect('/responders'); 
	//}
});

var entryRouter= function(app){
	app.use("/",router);
}

module.exports = entryRouter;

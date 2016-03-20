var express = require('express');
var router = express.Router();
var data = require('../model/data');

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

//add responder
router.post('/responders', function(req, res) { 
	//if (data.responders[req.body.id]) {
	//	res.send('Conflict', 409); 
	//} else {
		data.responders.push(req.body);
		res.redirect('/responders'); 
	//}
});

var entryRouter= function(app){
	app.use("/",router);
}

module.exports = entryRouter;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("*******ENTRY POINT******");
  res.send("*******EUREKA******");
});

router.get('/alert', function(req, res, next){
  res.send("SEND ALERT");
});

var entryRouter= function(app){
	app.use("/",router);
}

module.exports = entryRouter;

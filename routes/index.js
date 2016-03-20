var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("*******ENTRY POINT******");
  res.send("*******EUREKA******");
});

var entryRouter= function(app){
	app.use("/",router);
}

module.exports = entryRouter;

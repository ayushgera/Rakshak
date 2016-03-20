var responders= require("../model/data").responders;
module.exports= function(locationObj){
  return responders[0];
}
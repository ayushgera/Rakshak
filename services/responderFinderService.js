var allResponders= require("../model/data").responders;
module.exports= function(locationObj, responders){
  var found=[];
  if(responders.length>0){
    found.push(responders);
  }
  return found;
}
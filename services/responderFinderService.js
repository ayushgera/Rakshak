var allResponders= require("../model/data").responders;

var responderFinderService={};

responderFinderService.findNearbyResponders= function(incident, responders){
	return responders;
}

responderFinderService.findRespondersFromSockets= function(responderSockets){
	var foundResponders=[];
	for(var i=0;i<responderSockets.length;i++){
		for(var j=0;j<allResponders.length;j++){
			if(responderSockets[i].id===allResponders[j].id){
				foundResponders.push(allResponders[j]);
			}	
		}
	}
	return foundResponders;
}

module.exports= responderFinderService;
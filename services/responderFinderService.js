var dbService= require("../model/data");

var responderFinderService={};

responderFinderService.findNearbyResponders= function(incident, responders){
	return responders;
}

function distance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

	return 12742 * Math.asin(Math.sqrt(a));
}

responderFinderService.findRespondersFromSockets= function(responderSockets){
	var foundResponders=[];
	var allResponders= [];//dbService.getAllResponders();
	for(var i=0;i<responderSockets.length;i++){
		//TODO: filter responders on location/city to prevent long loop
		//for(var j=0;j<allResponders.length;j++){
			//if(responderSockets[i].id==allResponders[j].id){
				//TODO:remove this bad workaround
				//allResponders[j].id= responderSockets[i].id;
				var foundResponder={};
				foundResponder.location= responderSockets[i].location;
				foundResponder.userId= responderSockets[i].userId;
				foundResponder.id= responderSockets[i].id;
				foundResponders.push(foundResponder);
			//}	
		//}
	}
	return foundResponders;
}

module.exports= responderFinderService;
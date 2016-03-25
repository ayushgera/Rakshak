//mock data service

var APP={};
APP.data= {
	"responders":[
		{id: 1, location: {latitude:2.7189, longitude:77.28971}},
		{id: 2, location: {latitude:2.7289, longitude:77.29971}},
		{id: 3, location: {latitude:2.8189, longitude:77.28971}},
		{id: 4, location: {latitude:2.8289, longitude:77.29971}},
		{id: 5, location: {latitude:2.9189, longitude:77.27971}},
		{id: 6, location: {latitude:2.9289, longitude:77.23971}}
	],
	"alerters":[
		{id: 1, location: {latitude:2.7189, longitude:77.28971}},
		{id: 2, location: {latitude:2.7289, longitude:77.29971}},
		{id: 3, location: {latitude:2.8189, longitude:77.28971}},
		{id: 4, location: {latitude:2.8289, longitude:77.29971}},
		{id: 5, location: {latitude:2.9189, longitude:77.27971}},
		{id: 6, location: {latitude:2.9289, longitude:77.23971}}
	],
	"incidents":[
		{id:1, location: {latitude:2.7189, longitude:77.23971}, type:"accident",severity:"low"},
		{id:2, location: {latitude:2.7489, longitude:77.26971}, type:"fire",severity:"high"},
		{id:3, location: {latitude:2.7289, longitude:77.25971}, type:"robbery",severity:"low"},
		{id:4, location: {latitude:2.7589, longitude:77.22271}, type:"unknown",severity:"medium"},
		{id:5, location: {latitude:2.7689, longitude:77.21971}, type:"accident",severity:"low"},
		{id:6, location: {latitude:2.7129, longitude:77.24571}, type:"accident",severity:"medium"},
		{id:7, location: {latitude:2.7139, longitude:77.26571}, type:"fire",severity:"low"},
		{id:8, location: {latitude:2.7119, longitude:77.27971}, type:"accident",severity:"high"},
		{id:9, location: {latitude:2.7159, longitude:77.22271}, type:"accident",severity:"low"}
	],
	"victims":[
		{incident:4, name:"xyz",contact:"43252345254",registration_number:"321"},
		{incident:1, name:"fdfgg",contact:"9879868",registration_number:"789"},
		{incident:5, name:"dgfhfh",contact:"6546754",registration_number:"543"},
		{incident:8, name:"rty",contact:"786986987",registration_number:"987"},
		{incident:9, name:"ghjhg",contact:"4579876876",registration_number:"786"},
		{incident:3, name:"qersfgd",contact:"097578765",registration_number:"046"},
		{incident:2, name:"bndfn",contact:"09675764874",registration_number:"935"},
		{incident:6, name:"trng",contact:"0797687648",registration_number:"639"},
		{incident:7, name:"mndg",contact:"096576",registration_number:"775"}
	]
};

APP.dbService={};

APP.dbService.getAllData= function(){
	return APP.data;
}

APP.dbService.getAllResponders= function(){
	return APP.data.responders; 
}

APP.dbService.getAllAlerters= function(){
	return APP.data.alerters;
}

APP.dbService.getAllIncidents= function(){
	return APP.data.incidents;
}

APP.dbService.getAllVictims= function(){
	return APP.data.victims;
}

APP.dbService.addResponder= function(responder){
	return APP.data.responders.push(responder); 
}

APP.dbService.addAlerter= function(alerter){
	return APP.data.alerters.push(alerter);
}

APP.dbService.addIncident= function(incident){
	return APP.data.incidents.push(incident);
}

APP.dbService.addVictim= function(victim){
	return APP.data.victims.push(victim);
}

module.exports= APP.dbService;
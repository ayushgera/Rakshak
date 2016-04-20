// Creates the SASApp Module and Controller. Note that it depends on the 'SAS.services' module and service.
var SASApp = angular.module('SASApp', ['SAS.services', 'SAS.dataService', 'uiGmapgoogle-maps', 'ngRoute']);

//load google map
SASApp.config(['uiGmapGoogleMapApiProvider','$routeProvider', function(uiGmapGoogleMapApiProvider, $routeProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
        v: '3.20' //defaults to latest 3.X anyhow
    });


    /**
	 * router uses resolve, uses a service which gives marker groups
	 * view1: all inc and new inc, and loc
	 * view 2: loc, nearby resp, hosp
	 * view 3: track: loc and responder
     **/

	$routeProvider.
	when('/responder', {
		templateUrl: 'gmap.html',
		controller: 'SASSubController',
		resolve: {
			markerModel: ['dataModel', function(dataModel){
				return dataModel.getResponderTrackViewMarkers();
			}]
		}
		}).
	when('/allIncidents', {
		templateUrl: 'gmap.html',
		controller: 'SASSubController',
		resolve: {
			markerModel: ['dataModel', function(dataModel){
				return dataModel.getAllIncidentsViewMarkers();
			}]
		}
	}).
	otherwise({
		redirectTo: '/responder'
	});
}]);

SASApp.controller('SASSubController', function(markerModel){
	markerModel.then(function(markers){
		$scope.markerModel=markers;
	},function(error){
		alert("OOOPS!"+ error)
	});
});

SASApp.controller('SASController', function($scope, alerterSocket, dataModel, uiGmapGoogleMapApi){
	$scope.markerId= 0;
	$scope.trackResponderLocations= [];
	$scope.allIncidentMarkers= [];
	$scope.respondersDispatched= [];
	
	$scope.viewName="responder";

	alerterSocket.on("all-incidents",function(data){
		dataModel.setAllIncidents(data);
	});

	alerterSocket.on("new-incident",function(data){
		dataModel.setNewIncident(data);
	});

	alerterSocket.on("responded",function(data){
		dataModel.setResponded(data);
	});

	alerterSocket.on("found-responders",function(data){
		dataModel.setFoundResponders(data);
	});

	alerterSocket.on("responder-dispatch-status",function(data){
		dataModel.setTrackResponderLocation(data);
	});


	$scope.alertServer= function(){
		alerterSocket.emit('alert', {"incident": {"id":10, "location": {"latitude":3.9189, "longitude":100.23971}, "type":"accident","severity":"low"}}); 
		console.log("ALERT");
	};

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 13 };


	// uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	
	});

});

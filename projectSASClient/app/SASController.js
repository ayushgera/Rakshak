// Creates the SASApp Module and Controller. Note that it depends on the 'SAS.services' module and service.
var SASApp = angular.module('SASApp', ['SAS.services', 'uiGmapgoogle-maps', 'ngGeolocation']);

//load google map
SASApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
        v: '3.20' //defaults to latest 3.X anyhow
    });
});

SASApp.controller('SASController', function($scope, $geolocation, alerterSocket, uiGmapGoogleMapApi){
	$scope.markerId= 0;
	$scope.data= {};
	$scope.trackResponderLocations= [];
	$scope.allIncidentMarkers= [];
	$scope.respondersDispatched= [];
	$scope.viewName="responder";

	alerterSocket.on("all-incidents",function(data){
		$scope.data.allIncidents= data;
	});

	alerterSocket.on("new-incident",function(data){
		$scope.data.newIncident= JSON.stringify(data);
	});

	alerterSocket.on("responded",function(data){
		$scope.data.responded= JSON.stringify(data);
	});

	alerterSocket.on("found-responders",function(data){
		$scope.data.foundResponders= JSON.stringify(data);
	});

	alerterSocket.on("responder-dispatch-status",function(data){
		$scope.data.trackResponderLocation=data;
	});


	$scope.alertServer= function(){
		alerterSocket.emit('alert', {"incident": {"id":10, "location": {"latitude":3.9189, "longitude":100.23971}, "type":"accident","severity":"low"}}); 
		console.log("ALERT");
	};

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 13 };




	/*$scope.marker = {
	      id: 0,
	      coords: {
	        latitude: 40.1451,
	        longitude: -99.6680
	      },
	      options: { draggable: true },
	      events: {
	        dragend: function (marker, eventName, args) {
	          var lat = marker.getPosition().lat();
	          var lon = marker.getPosition().lng();

	          $scope.marker.options = {
	            draggable: true,
	            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
	            labelAnchor: "100 0",
	            labelClass: "marker-labels"
	          };
	        }
	      }
	    };*/

	//update markermodel whenever view changes    
	$scope.$watch(function(){
		return $scope.viewName;
	}, function(){
		if($scope.viewName==="incidents"){
			$scope.markerModel= $scope.allIncidentMarkers;
		}else if($scope.viewName==="responder"){
			$scope.markerModel= $scope.respondersDispatched;
		}
	});


	// uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	var allIncidentMarkers=[];
    	$scope.respondersDispatched=[{"id":9999,"title":"alerter"},{"id":1111,"title":"responder"}];
    	
    	//this is your location
    	$geolocation.getCurrentPosition({
            timeout: 60000
         }).then(function(position) {
            $scope.respondersDispatched[0].latitude= position.coords.latitude;
    		$scope.respondersDispatched[0].longitude= position.coords.longitude;
         });
    	
    	var lat=22.1111, longi=77.123;
    	
    	$scope.$watch(function(){
    		return $scope.data.allIncidents;
    	}, function(){
    		var allIncidents= $scope.data.allIncidents;
    		if(allIncidents){
    			for(var i=0;i< allIncidents.length;i++){
		    		allIncidentMarkers.push({
			        	"latitude": allIncidents[i].location.latitude,
			        	"longitude": allIncidents[i].location.longitude,
			        	"title": 'm' + i,
			      		"id" : i
			      	});
    			}
    		}
    		$scope.allIncidentMarkers= allIncidentMarkers;
    	});


    	$scope.$watch(function(){
    		return $scope.data.trackResponderLocation;
    	}, function(){
    		var responderTrack= $scope.data.trackResponderLocation;
    		if(responderTrack){
    			$scope.respondersDispatched[1].latitude=responderTrack.latitude;
    			$scope.respondersDispatched[1].longitude=responderTrack.longitude;
    		}
    	});
    	
    	/*$scope.$watch(function(){
    		return $scope.data.trackResponderLocation;
    	}, function(){
    		var responderTrack= $scope.data.trackResponderLocation;

    		var responder = {
		      	coords: {
		        	latitude: responderTrack.latitude,
		        	longitude: responderTrack.longitude
		      	},
		      	id: Date.now()
		  	};

		  	$scope.trackResponderLocations.push(responder);
    	});*/
    });

});

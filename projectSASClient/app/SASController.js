// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var SASApp = angular.module('SASApp', ['geolocation', 'SAS.services']);
SASApp.controller('SASController', function($scope, geolocation, alerterSocket, gservice){

	// Refresh the map with new data
	//gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
	
	$scope.data={};
	alerterSocket.on("all-incidents",function(data){
		$scope.data.allIncidents= JSON.stringify(data);
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
		$scope.data.trackResponderLocation=JSON.stringify(data);
	});

	$scope.alertServer= function(){
		alerterSocket.emit('alert', {"incident": {"id":10, "location": {"latitude":3.9189, "longitude":100.23971}, "type":"accident","severity":"low"}}); 
		console.log("ALERT");
	};

});

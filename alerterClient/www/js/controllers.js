angular.module('starter.controllers', ['SAS.services', 'uiGmapgoogle-maps', 'ngGeolocation'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.$broadcast('changeView', "incidents");

  $scope.changeView= function (viewName) {
     $scope.$broadcast('changeView', viewName);
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SASController', function($scope, $geolocation, alerterSocket, uiGmapGoogleMapApi, $ionicLoading){
  $scope.markerId= 0;
  $scope.data= {};
  $scope.trackResponderLocations= [];
  $scope.allIncidentMarkers= [];
  $scope.respondersDispatched= [];
  $scope.viewName="responder";
  $scope.markerModel= $scope.allIncidentMarkers;

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

  $scope.$on('changeView', function(event, viewName) { 
    if(viewName==="responder"){
      $scope.markerModel= $scope.respondersDispatched;
    }else if (viewName==="incidents") {
      $scope.markerModel= $scope.allIncidentMarkers;
    }
  });

  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 13 };

  //update markermodel whenever view changes    
  /*$scope.$watch(function(){
    return $scope.$parent.$parent.viewName;
  }, function(){
    if($scope.$parent.$parent.viewName==="incidents"){
      $scope.markerModel= $scope.allIncidentMarkers;
    }else if($scope.$parent.$parent.viewName==="responder"){
      $scope.markerModel= $scope.respondersDispatched;
    }
  });*/

  // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
      var allIncidentMarkers=[];
      $scope.respondersDispatched=[{"id":9999,"title":"alerter"},{"id":1111,"title":"responder"}];

      $ionicLoading.show({
        template: 'Loading...'
      });

      navigator.geolocation
      .getCurrentPosition(function (position) {
        $scope.respondersDispatched[0].latitude= position.coords.latitude;
        $scope.respondersDispatched[0].longitude= position.coords.longitude;
        $ionicLoading.hide();
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
      
    });

});

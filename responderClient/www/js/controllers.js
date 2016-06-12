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

.controller('SASController', function($scope, $geolocation, responderSocket, uiGmapGoogleMapApi, uiGmapIsReady, $ionicLoading, $ionicPopup){
  $scope.markerId= 0;
  $scope.data= {};
  $scope.trackResponderLocations= [];
  $scope.alerterPageMarkers= [{"id":"responder"},{"id":"alerter"}];
  $scope.allIncidentMarkers= [];
  $scope.respTrackPageMarkers= [];
  $scope.viewName= "respond";
  $scope.markerModel= $scope.alerterPageMarkers;
  $scope.alertCards=[];
  //saves alerters with location and socket id to track
  $scope.alerters=[];

  $scope.findAlerterLocation = function(alerterId){
    for(var i=0;i<$scope.alerters.length;i++){
      if($scope.alerters[i].alerterId===alerterId){
        return $scope.alerters[i].location;
      }
    }
  };

  //TODO: remove the following location mock algorithm
  $scope.getRandLocation= function(minLat, maxLat, minLong, maxLong) {   
    var lat= Math.random() * (maxLat - minLat) + minLat;
    var long= Math.random() * (maxLong - minLong) + minLong;
    return {"latitude":lat,"longitude":long};
  };

  /**MODAL START**/

   // An alert dialog
   $scope.openModal = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Help!',
       template: 'An incident occured close to you. Please respond if available.'
     });

     alertPopup.then(function(res) {
       console.log('Acknowledged');
     });
   };

  /**MODAL END**/

  responderSocket.on("all-incidents",function(data){
    $scope.data.allIncidents= data;
  });

  responderSocket.on("new-incident",function(data){
    $scope.data.newIncident= JSON.stringify(data);
        var cardInfo= {
      alerterId: data.incident.alerterId,
      title: "Alert",
      text: JSON.stringify(data.incident.location)
    };
    $scope.alertCards.push(cardInfo);
    $scope.alerters.push({alerterId:data.incident.alerterId,location:data.incident.location});
  });

  responderSocket.on("please-respond",function(data){
    $scope.openModal();
  });

  responderSocket.on("found-responders",function(data){
    $scope.data.foundResponders= JSON.stringify(data);
  });

  responderSocket.on("responded",function(data){
    $scope.data.foundResponders= JSON.stringify(data);
  });

  responderSocket.on("responder-dispatch-status",function(data){
    $scope.data.trackResponderLocation=data;
  });



  $scope.$on('changeView', function(event, viewName) { 
    if(viewName==="respond"){
      $scope.markerModel= $scope.alerterPageMarkers;
    }else if (viewName==="incidents") {
      $scope.markerModel= $scope.allIncidentMarkers;
    }
  });

  $scope.map = { 
    center: { latitude: 45, longitude: -73 }, 
    zoom: 10, 
    options: {disableDefaultUI: true} 
  };

  // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        
        $scope.directionsService = new maps.DirectionsService();
        $scope.directionsDisplay = new maps.DirectionsRenderer({suppressMarkers: true});

        $scope.respondToServer= function(alerterId) {
        console.log("alerter id: "+alerterId);
        responderSocket.emit('respond', 
          {
            "alerterId":alerterId, 
            "location":{
              "latitude":$scope.myLat,
              "longitude":$scope.myLong
            }
          });

        setInterval(function(){
              responderSocket.emit("responder-dispatch-status",
                {
                  "alerterId":alerterId, 
                  "location":{
                    "latitude":$scope.myLat,
                    "longitude":$scope.myLong
                  }
                });
          },5000);

        //Find alerter location and start tracking
        $scope.alerterLoc= $scope.findAlerterLocation(alerterId);
        if($scope.alerterLoc){
          $scope.alerterPageMarkers[1].latitude=$scope.alerterLoc.latitude;
          $scope.alerterPageMarkers[1].longitude=$scope.alerterLoc.longitude;
          $scope.alerterPageMarkers[1].icon= { url: "img/Help.png"};
          $scope.calculateAndDisplayRoute();
        }
      };

      var allIncidentMarkers=[];
      $scope.respTrackPageMarkers=[
        {"id":"alerter","title":"alerter","icon":"img/Help.png"},
        {"id":"responder","title":"responder","icon":"img/Ambulance.png"}
      ];

      $ionicLoading.show({
        template: 'Loading...'
      });

      navigator.geolocation
      .getCurrentPosition(function (position) {
        var icon = {
            url: "img/ambulanceIcon.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        $scope.myLat= position.coords.latitude;
        $scope.myLong= position.coords.longitude;

        //TODO: remove the following location mocker
        $scope.myLat= $scope.getRandLocation(12.7226855, 13.1725508, 77.38986019999993, 77.61422579999999).latitude;
        $scope.myLong= $scope.getRandLocation(12.7226855, 13.1725508, 77.38986019999993, 77.61422579999999).longitude;

        $scope.alerterPageMarkers.push({
          "id": "alerterMain",
          "latitude": $scope.myLat,
          "longitude": $scope.myLong,
          "icon":icon
        });
        $scope.respTrackPageMarkers[0].latitude= $scope.myLat;
        $scope.respTrackPageMarkers[0].longitude= $scope.myLong;

        //send location information to the server
        responderSocket.emit('responder-information', 
          {
            "location": {
              "latitude": $scope.myLat,
              "longitude": $scope.myLong
            }
          });

        $ionicLoading.hide();
      });

      $scope.$watch(function(){
        return $scope.data.trackResponderLocation;
      }, function(){
        var responderTrack= $scope.data.trackResponderLocation;
        if(responderTrack){
          $scope.respTrackPageMarkers[1].latitude=responderTrack.latitude;
          $scope.respTrackPageMarkers[1].longitude=responderTrack.longitude;
        }
      });

      $scope.$watch(function(){
        return $scope.data.foundResponders;
      }, function(){
        var foundResponders= $scope.data.foundResponders;
        if(foundResponders && foundResponders.length>0){
          for(var i=0;i<foundResponders.length;i++){
              $scope.respTrackPageMarkers[i].latitude= foundResponders[i].location.latitude;
              $scope.respTrackPageMarkers[i].longitude= foundResponders[i].location.longitude;
          }
        }
      });

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
                "id" : i,
                "icon": 'img/caraccident-2.png'
              });
          }
        }
        $scope.allIncidentMarkers= allIncidentMarkers;
      });
      
      return uiGmapIsReady.promise(1);
    }).then(function(instances){

      var instanceMap = instances[0].map;
      $scope.directionsDisplay.setMap(instanceMap);
      $scope.calculateAndDisplayRoute= function(){
        $scope.directionsService.route({
              origin: new google.maps.LatLng($scope.myLat, $scope.myLong),
              destination: new google.maps.LatLng($scope.alerterLoc.latitude, $scope.alerterLoc.longitude),
              travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                $scope.directionsDisplay.setDirections(response);
            }
        });   
      };
    });

});

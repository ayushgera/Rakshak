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

.controller('SASController', function($scope, $geolocation, alerterSocket, uiGmapGoogleMapApi, uiGmapIsReady, $ionicLoading){
  $scope.markerId= 0;
  $scope.data= {};
  $scope.trackResponderLocations= [];
  $scope.alerterPageMarkers= [];
  $scope.allIncidentMarkers= [];
  $scope.respTrackPageMarkers= [];
  $scope.responderCards= [];
  $scope.alertSent= false;
  $scope.viewName= "alert";
  $scope.markerModel= $scope.alerterPageMarkers;

  alerterSocket.on("all-incidents",function(data){
    $scope.data.allIncidents= data;
  });

  alerterSocket.on("new-incident",function(data){
    $scope.data.newIncident= JSON.stringify(data);
  });

  alerterSocket.on("responded",function(data){
    $scope.data.responded= data;
    $scope.data.trackResponderLocation= data.responder.location;
  });

  alerterSocket.on("found-responders",function(data){
    $ionicLoading.hide();
    $scope.data.foundResponders= data;
      for(var i=0;i<data.length;i++){
      var cardInfo= {
        responderId: data[i].id,
        title: "Responder",
        distance: "Getting distance...",
        text: "Getting location...",
        location: data[i].location
      };
      $scope.responderCards.push(cardInfo);
      $scope.addDistance($scope.responderCards);
    }
  });


  $scope.addDistance= function(responderCards){
    var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService;
    for(var i=0;i<$scope.responderCards.length;i++){
      (function(index){
          setTimeout(function(){
            service.getDistanceMatrix({
              origins: [{lat: $scope.responderCards[index].location.latitude, lng: $scope.responderCards[index].location.longitude}],
              destinations: [{lat:$scope.myLat,lng:$scope.myLong}],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
            }, function(response, status) {
              if (status !== google.maps.DistanceMatrixStatus.OK) {
                console.log("ERROR retrieving distance for responder: "+$scope.responderCards[i].responderId);
                return;
              }

              var originList = response.originAddresses;
              var destinationList = response.destinationAddresses;
              var distanceText="",address="";
              for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                  /*distanceText += originList[i] + ' to ' + destinationList[j] +
                      ': ' + results[j].distance.text + ' in ' +
                      results[j].duration.text;*/
                      distanceText= results[j].distance.text + 'away. Time to reach : ' +results[j].duration.text;
                      address= originList[i];
                }
              }
              $scope.$apply(function(){
                $scope.responderCards[index].text= distanceText;
                $scope.responderCards[index].distance= address;
              });
            })
          }, index*100)
      })(i);
      
    }
  };

  alerterSocket.on("responder-dispatch-status",function(data){
    $scope.data.trackResponderLocation=data;
  });


  $scope.alertServer= function(){
    $scope.alertSent=true;
      $ionicLoading.show({
        template: 'Alert sent. Waiting for responders...'
      });
    alerterSocket.emit('alert', {"incident": {"id":10, "location": {"latitude":$scope.myLat, "longitude":$scope.myLong}, "type":"accident","severity":"low"}}); 
    console.log("ALERT");
  };

  $scope.$on('changeView', function(event, viewName) { 
    $scope.changeView(viewName);
  });

  $scope.changeView= function(viewName){
    if(viewName==="alert"){
      $scope.markerModel= $scope.alerterPageMarkers;
    }else if(viewName==="responder"){
      $scope.markerModel= $scope.respTrackPageMarkers;
    }else if (viewName==="incidents") {
      $scope.markerModel= $scope.allIncidentMarkers;
    }
  };

  $scope.map = { 
    center: { latitude: 45, longitude: -73 }, 
    zoom: 13, 
    options: {disableDefaultUI: true},
    events: {
      click: function(map, eventName, originalEventArgs){
        $scope.apply(function(){
          var x=0;
        });
      }
    }
  };

  //update markermodel whenever view changes    
  /*$scope.$watch(function(){
    return $scope.$parent.$parent.viewName;
  }, function(){
    if($scope.$parent.$parent.viewName==="incidents"){
      $scope.markerModel= $scope.allIncidentMarkers;
    }else if($scope.$parent.$parent.viewName==="responder"){
      $scope.markerModel= $scope.respTrackPageMarkers;
    }
  });*/

  // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
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
        $scope.alerterPageMarkers.push({
          "id": "alerterMain",
          "latitude": position.coords.latitude,
          "longitude": position.coords.longitude,
          "icon":"img/Help.png"
        });
        $scope.myLat= position.coords.latitude;
        $scope.myLong= position.coords.longitude;
        $scope.respTrackPageMarkers[0].latitude= position.coords.latitude;
        $scope.respTrackPageMarkers[0].longitude= position.coords.longitude;
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
        /*var foundResponders= $scope.data.foundResponders;
        if(foundResponders && foundResponders.length>0){
          for(var i=0;i<foundResponders.length;i++){
              $scope.respTrackPageMarkers[i].latitude= foundResponders[i].location.latitude;
              $scope.respTrackPageMarkers[i].longitude= foundResponders[i].location.longitude;
          }
        }*/
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
    }).then();

});

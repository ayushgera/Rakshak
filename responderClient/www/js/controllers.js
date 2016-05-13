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

.controller('SASController', function($scope, $geolocation, responderSocket, uiGmapGoogleMapApi, $ionicLoading, $ionicPopup){
  $scope.markerId= 0;
  $scope.data= {};
  $scope.trackResponderLocations= [];
  $scope.alerterPageMarkers= [];
  $scope.allIncidentMarkers= [];
  $scope.respTrackPageMarkers= [];
  $scope.viewName= "respond";
  $scope.markerModel= $scope.alerterPageMarkers;
  $scope.alertCards=[];

  /**MODAL START**/

  /* $ionicModal.fromTemplateUrl('pleaseRespond.html', {
      scope: $scope,
      animation: 'slide-in-up'
   }).then(function(modal) {
      $scope.pleaseRespondModal = modal;
   });
  
   $scope.openModal = function() {
      $scope.pleaseRespondModal.show();
   };
  
   $scope.closeModal = function() {
      $scope.pleaseRespondModal.hide();
   };
  
   //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.pleaseRespondModal.remove();
   });*/

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

  $scope.respondToServer= function(alerterId) { // Note this is a function
    console.log("alerter id: "+alerterId);
    responderSocket.emit('respond', {"alerterId":alerterId, "location":{"latitude":22.234435,"longitude":77.43345}});

    setInterval(function(){
          responderSocket.emit("responder-dispatch-status",{"alerterId":alerterId, "location":{"latitude":9.9999,"longitude":99.9999}});
      },1000);
  };

  $scope.$on('changeView', function(event, viewName) { 
    if(viewName==="respond"){
      $scope.markerModel= $scope.alerterPageMarkers;
    }else if (viewName==="incidents") {
      $scope.markerModel= $scope.allIncidentMarkers;
    }
  });

  $scope.map = { 
    center: { latitude: 45, longitude: -73 }, 
    zoom: 13, 
    options: {disableDefaultUI: true} 
  };

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
      
    });

});

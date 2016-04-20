var dataServiceModule= angular.module('SAS.dataService',['SAS.locationService']);

// We define a factory the socket service is instantiated only once, and
// thus act as a singleton for the scope of the application
dataServiceModule.factory('dataModel', function (locationObj, $q) {
    function model(){
      this.allIncidents=[];
      this.newIncident={};
      this.responded=[];
      this.foundResponders=[];
      this.trackResponderLocation={};
      this.responderTrackViewMarkers=[];
      this.allIncidentsViewMarkers=[];
      this.currentLocation={};
    } 
    model.prototype.getAllIncidents= function(){
      return this.allIncidents;
    }
    model.prototype.setAllIncidents= function(allIncidents){
      this.allIncidents=allIncidents;
    }
    model.prototype.getNewIncident= function(){
      return this.newIncident;
    }
    model.prototype.setNewIncident= function(newIncident){
      this.newIncident=newIncident;
    }
    model.prototype.getResponded= function(){
      return this.responded;
    }
    model.prototype.setResponded= function(responded){
      this.responded=responded;
    }
    model.prototype.getFoundResponders= function(){
      return this.foundResponders;
    }
    model.prototype.setFoundResponders= function(foundResponders){
      this.foundResponders=foundResponders;
    }
    model.prototype.getTrackResponderLocation= function(){
      return this.getTrackResponderLocation;
    }
    model.prototype.setTrackResponderLocation= function(trackResponderLocation){
      this.trackResponderLocation=trackResponderLocation;
    }
    model.prototype.getCurrentLocation= function(){
      return this.currentLocation;
    }
    model.prototype.setCurrentLocation= function(currentLocation){
      this.currentLocation=currentLocation;
    }
    model.prototype.getAllIncidentsViewMarkers= function(){
      var defer= $q.defer();
      var allIncidentMarkers= [];
      var allIncidents= this.getAllIncidents() || [];
      for(var i=0;i< allIncidents.length;i++){
            allIncidentMarkers.push({
              "latitude": allIncidents[i].location.latitude,
              "longitude": allIncidents[i].location.longitude,
              "title": 'm' + i,
              "id" : i
            });
          }
      if(allIncidents.length>0){
        defer.resolve(allIncidentMarkers);
      }
      return defer.promise;
    }
    model.prototype.getResponderTrackViewMarkers= function(){
      var defer= $q.defer();
      var currentLocation={};
      currentLocation.id="1111";
      currentLocation.title="alerter";
      locationObj.then(function(position){
        currentLocation.latitude= position.coords.latitude;
        currentLocation.longitude= position.coords.longitude;
      });
      this.setCurrentLocation(currentLocation);
      var responderTrackermarker={};
      responderTrackermarker.id="9999";
      responderTrackermarker.title="responder";
      var responderTrack= this.getTrackResponderLocation();
        if(responderTrack){
          responderTrackermarker.latitude=responderTrack.latitude;
          responderTrackermarker.longitude=responderTrack.longitude;
      }
      var responderTrackMarkers=[];
      responderTrackMarkers.push(currentLocation, responderTrackermarker);
      if(responderTrackMarkers[1].latitude){
        defer.resolve(responderTrackMarkers);
      }
      return defer.promise;
    }
    return new model();
});


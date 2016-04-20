var dataServiceModule= angular.module('SAS.locationService',['ngGeolocation']);

// We define a factory the socket service is instantiated only once, and
// thus act as a singleton for the scope of the application
dataServiceModule.factory('locationObj', function ($geolocation) {
    return $geolocation.getCurrentPosition({
      timeout: 60000
    });
});


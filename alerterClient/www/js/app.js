// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SASApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'SASApp.controllers' is found in controllers.js
angular.module('SASApp', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es',
      v: '3.20' //defaults to latest 3.X anyhow
  })

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
   .state('app.mapview', {
      url: '/mapview',
      views: {
        'menuContent': {
          templateUrl: 'templates/mapview.html',
          controller: 'SASController'
        }
      }
    })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/mapview');
});

var services= angular.module('SAS.services',[]);

// We define a factory the socket service is instantiated only once, and
// thus act as a singleton for the scope of the application
services.factory('responderSocket', function ($rootScope) {
  var socket = io.connect('https://sleepy-caverns-38132.herokuapp.com/responder');//io.connect('http://127.0.0.1:3000/responder');//
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

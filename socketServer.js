var responderFinder= require("./services/responderFinderService");
var alerters=[];
var responders=[];
var incidents=[];

module.exports= function(io){
  io.of('alerter').on('connection', function (alerter) {

    alerter.emit("all-incidents",incidents);

    alerters.push(alerter);
    alerter.on('alert', function (data) {
      console.log("!!!!!ALERT!!!!!!!");
      // alert all alerters that an incident has been reported
      // client alerter will use it to see if an event is already reported here
      alerters.broadcast.emit('incident-location', data);
      responders.broadcast.emit('incident-location', data);
      //TODO:
      //generate alerter id
      //store location, severity in db, with alerter id 
      locations.push(data.location);
      //the above schema would also contain the responders who would respond to the event
      //broadcast this location and event type to all clients
      //call responderfinder service, which returns array of closest reponders
      var nearResponders=[];
      nearResponders.push(responderFinder(data, responders));

      nearResponders.emit("respond-to-incident");
      //broadcast this location and event type to all returned responders
    });
  });

  io.of('responder').on('connection', function (responder) {

    responder.emit("all-incidents",incidents);

    responders.push(responder);
    responder.on('respond', function (data) {
      console.log("!!!!!RESPOND!!!!!!!");
    });
  });
}
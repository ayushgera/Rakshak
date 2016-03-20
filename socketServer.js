var responderFinder= require("./services/responderFinderService");
module.exports= function(io){
  io.sockets.on('connection', function (socket) {
    socket.on('alert', function (data) {
      console.log("!!!!!ALERT!!!!!!!");
      socket.broadcast.emit('incident-location', data);
      //TODO:
      //generate alerter id
      //store location, severity in db, with alerter id 
      //the above schema would also contain the responders who would respond to the event
      //broadcast this location and event type to all clients
      //call responderfinder service, which returns array of closest reponders
      var responders=[];
      responders.push(responderfinder(data));
      //broadcast this location and event type to all returned responders
    });
  });
}
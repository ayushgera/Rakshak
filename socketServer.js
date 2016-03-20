module.exports= function(io){
  io.sockets.on('connection', function (socket) {
    socket.on('alert', function (data) {
      console.log("!!!!!ALERT!!!!!!!");
      io.sockets.emit('location', data);
      //generate alerter id
      //store location, severity in db, with alerter id 
      //the above schema would also contain the responders who responded to the event
    });
  });
}
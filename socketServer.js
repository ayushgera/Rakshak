var responderFinder= require("./services/responderFinderService");
var dbService= require(".model/data");
var alerters=[];
var responders=[];
var respondingResponders=[];
var incidents=[];

/**
 * Events identified:
 *    EVENTS                                ALERTER CLIENT                             RESPONDER CLIENT                  SERVER
 *
 * "all-incidents"                      on- show all incidents                      on- show all incidents            send- all incidents frm DB
 *
 * "alert"                              send- alert                                 do nothing                        on- save in db, save id/name 
 *                                                                                                                    of alerter, send- "new-incident" 
 *                                                                                                                    to all, call responderFinder,
 *                                                                                                                    send "found-responders" to the 
 *                                                                                                                    alerter, send "please-respond"
 *                                                                                                                    to connected found responders
 *
 * "new-incident"                       on- update marker on map                    on- update marker on map          send- new-incident
 *
 * "found-responders"                   on- (specific)update markers on map         on- update markers on map         send- found-responders
 *
 * "please-respond"                     do nothing                                  on- show alert box                send please-respond               
 *
 * "respond"                            do-nothing                                  send- respond                     on- save responder, give id/name
 *                                                                                                                    start tracker service
 * 
 * "responder-dispatch-status"          on- update marker                           on- update marker                 send- responder-dispatch-status
 *
 * "finish-respond"                     do-nothing                                  send- finish-respond              on- send you-are-served
 *
 * "you-are-saved"                      on- update marker                           do nothing/update marker          send you-are-served
 *
 * Service is responsible to do the following socket handling:
 * alerter opens device, connection established, server sends "all-incidents" (filter on location? show nearby events?)
 * alerter presses alert button, alerter client sends "alert" event with all necessary details like location, type of event, severity, emergency contact
 * on "alert" server saves "event" information in db, broadcasts "new-incident" to all responders active (store active responders somewhere?), 
 * calls responderFinderService to find eligible responders(necessary? yes! otherwise responder far away will receive alert, doesnt make sense)
 * server emits "found-responders" event to all (all or only the alerter who sends alert and found responders?)
 * server emits "please-respond" event to nearby responders
 * Resonder client is always open. (for the time being; later integrate with push notifications/ push-pull sms)
 * on "all-incidents", display all event details
 * on "please-respond", open a prompt box asking to respond
 * on clicking respond, send "respond" event to server, with all details
 * keep sending "responder-dispatch-status" every 5 seconds to the server
 * press button "finish responding" to send "finish-respond" event to server
 * server gets "respond" event, and sends the responder socket to responderLocatorService
 * responderLocatorService receives responder socket and the io object and the alerter id/name?
 * responder on "responder-dispatch-status" broadcast dispatched responder's location to all alerters and responders
 * responder on "finish-respond", update event in db/file, broadcast "all-incidents" to all; search alerter by id/name 
 * in alerters array and send "you-are-saved" event to the speicifc alerter
 */

module.exports= function(io){
  io.of('alerter').on('connection', function (alerter) {

    alerter.emit("all-incidents",dbService.incidents);
    
    alerter.on('alert', function (data) {

      //TODO: set alerter id/name, saved with alerters.push in global alerters array, can be accessed later

      io.sockets.emit("new-incident",data);

      alerters.push(alerter);

      console.log("!!!!!ALERT!!!!!!!");
      // alert all alerters that an incident has been reported
      // client alerter will use it to see if an event is already reported here
      //alerters.broadcast.emit('incident-location', data);
      //responders.broadcast.emit('incident-location', data);
      //TODO:
      //generate alerter id
      //store location, severity in db, with alerter id 
      locations.push(data.location);
      //the above schema would also contain the responders who would respond to the event
      //broadcast this location and event type to all clients
      //call responderfinder service, which returns array of closest reponders
      var nearResponders=[];
      nearResponders.push(responderFinder(data, responders));
      //TODO: make synchronous
      nearResponders.emit("please-respond",data);
      //TODO: responders - near Responders
      responders.emit("found-responders",data);
      alerter.emit("found-responders",data);
      //broadcast this location and event type to all returned responders
    });
  });

  io.of('responder').on('connection', function (responder) {

    responder.emit("all-incidents",dbService.incidents);

    responders.push(responder);
    responder.on('respond', function (data) {
      respondingResponders.push(responder);
      // responderTrackingService
      // extract alerter by name
      // setTimeOut(function(){responder.emit("responder-dispatch-status");},5000);
      // alerter.emit("responder-dispatch-status");
      console.log("!!!!!RESPOND!!!!!!!");
    });
  });
}
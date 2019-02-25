# README #

###Architecture Draft 1:###

####Modules Identified####
Following services can be created as modules and developed independently:

* **Router**: all Ui requests from all sorts of clients passed and redirected through router to different service modules
* **DbService**: does basic CRUD operations. Should be made schema independent. i.e. any client can request this service to create/read/update/delete any model (based on any schema) in the db. See the possibility.
* **BroadcastService**: Takes input array of "subscribers"(have a dedicated service to register subscribers, needed for responder registers), and broadcasts "messages" to all
* **LocationService**: Calls google api to find the current location
* ResponderFinderService: Takes input "location" and input registered responder objects and outputs the nearest responder objects
* **ResponderAlertService**: Takes input the "responder" (returned by previous service), and input type of "registration" and sends following to the responder client-> sms/push notification/call (need to discuss this)
* **ResponderTrackService**: Takes input an array of responder objects, and sets polling with some time interval, calls locationservice, outputs location array corresponding to the array. Use this to send to the alerter through router.
* **RegisterService**: takes input a client object(responder or alerter), and inputs type of service, and registers the client to the service like push notification. How to do this for sockets?


### Branches ###

* Master : would contain the release code (not up to date yet)
* Feature : updated code, all Pull Requests to be made here
* IonicClientMain : updated client code


### Contributors ###

* Ayush Gera

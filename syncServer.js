// Requires Modules:
var fileServer = require('./lib/fileServer'); 			//	Add-on module for a simple web server that serves static files
var http  = require('http').Server(fileServer.init);	//	Built-in module provides HTTP server and client functionality
var io = require('socket.io')(http);					//	Add-on module for enabling real-time bidirectional event-based communication 

fileServer.host = process.argv[2];
fileServer.socket = io; 

http.listen(fileServer.port, function () {

	console.log("SyncServer@" + fileServer.host + ":" + fileServer.port);

});
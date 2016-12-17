//	Required modules:
var fs	 = require('fs');	//	Built-in module provide filesystem-relate functionality
var path = require('path');	//	Built-in module provides filesystem path-related functionality
var qs	 = require('querystring');	//	Built-in module provides utilities for dealing with query strings
var mime = require('mime');	//	Add-on module provides ability to derive a MIME type based on a filesystem extension

exports.host = 'localhost'
exports.port = 3000;
exports.cache = {};
exports.socket    = null;
	
exports.init = function (req, res) {
			
		switch (req.method) {
	
			case 'GET':
				exports.HTTP.get(req, res);
			break;
			case 'POST':
				exports.HTTP.post(req, res)
			break;
			default:
				exports.statusCode(res, 501);
		
		}
		
	}
	
exports.HTTP = {
		
		requestBody:null,
		formData:null,
		response:null,
		
		get: function (req, res) {
			
			if (req.url == '/') {
	
				 //	Determine HTML file to be served by default:
				filePath = 'public/index.html';
			
			} else {
				
				//	Translate URL path to relative file path:
				filePath = 'public' + req.url
				
			}
			
			var absPath = './' + filePath;
			exports.file.accept(res, absPath);	//	Serve static file;
			
		},
		
		post: function (req, res) {
		
			var requestBody = '';
	
			req.on('data', function (data) {
			
				requestBody += data;
				
					if (requestBody.length > 1e7) {
					
						exports.statusCode(res, 413);
					
					}	
			});
			
			req.on('end', function (data) {
			
				exports.socket.emit('postEvent', qs.parse(requestBody));
				res.writeHeader(200, {
					"Content-Length" : requestBody.length,
					"Content-Type" : "text/plain",
				});
				res.write(requestBody);
				res.end();
				
			
			});
			
		}
	}
	
	exports.file = {
		
		//	Method that serves static files:
		accept: function (res, absPath) {
			
			//	Checks if file is cached:
			if (exports.cache[absPath]) {
			
				// Serve file from memory:
				exports.file.send(res, absPath, exports.cache[absPath]);	
			
			} else {
			
				//	Check if file exists:
				fs.exists(absPath, function (exists) {
				
					if (exists) {
					
						//	Read file from disk:
						fs.readFile(absPath, function(err, data) {
						
							if (err) {
							
								exports.statusCode(res, 404); // File not found response
							
							} else {
								
								exports.file.send(res, absPath, data);	// Returns file
								
							}
						
						
						}); 
					
					} else {
						
						exports.statusCode(res, 404); // File not found response
						
					}
				
				});
			
			}
			
		},
		
		send: function (res, filePath, fileContents) {
			
			res.writeHead(200, {'Content-Type' : mime.lookup(path.basename(filePath))});
			res.end(fileContents);
			
		}
	}
	
	//	Returns error message:
	exports.statusCode = function (res, code) {
		
		switch(code) {
		
			case 404: 
				
				res.writeHead('404', {'Content-Type':'text/plain'});
				res.write('Error 404: Not Found');
	
			break;
			case 501: 
			
				res.writeHead('501', {'Content-Type':'text/plain'});
				res.write('Error 501: Not Implemented');
	
			break;
			case 413:
			
				res.writeHead('413', {'Content-Type':'text/plain'});
				res.write('Error 413: Request Entity Too Large');
			
			break;
			default:
			
				res.writeHead('500', {'Content-Type':'text/plain'});
				res.write('Error 500: Internal Server Error');
			
		
		}
	
		res.end();
	
	}








//	Required modules:
var fs	 = require('fs');	//	Built-in module provide filesystem-relate functionality
var path = require('path');	//	Built-in module provides filesystem path-related functionality
var qs	 = require('querystring');	//	Built-in module provides utilities for dealing with query strings
var mime = require('mime');	//	Add-on module provides ability to derive a MIME type based on a filesystem extension

exports.fileServer = {
	url: 'localhost',
	port:3000,
	cache: {},
	
	init: function (req, res) {
		
		switch (req.method) {
	
			case 'GET':
				fileServer.HTTP.get(req, res);
			break;
			case 'POST':
				fileServer.HTTP.post(req, res)
			break;
			default:
				fileServer.statusCode(res, 501);
		
		}
		
	},
	
	HTTP: {
		
		get: function (req, res) {
			
			if (req.url == '/') {
	
				 //	Determine HTML file to be served by default:
				filePath = 'public/index.html';
			
			} else {
				
				//	Translate URL path to relative file path:
				filePath = 'public' + req.url
				
			}
			
			var absPath = './' + filePath;
			fileServer.file.accept(res, absPath);	//	Serve static file;
			
		},
		
		post: function (req, res) {
		}
	},
	
	file: {
		
		//	Method that serves static files:
		accept: function (res, absPath) {
			
			//	Checks if file is cached:
			if (fileServer.cache[absPath]) {
			
				// Serve file from memory:
				fileServer.file.send(res, absPath, fileServer.cache[absPath]);	
			
			} else {
			
				//	Check if file exists:
				fs.exists(absPath, function (exists) {
				
					if (exists) {
					
						//	Read file from disk:
						fs.readFile(absPath, function(err, data) {
						
							if (err) {
							
								fileServer.statusCode(res, 404); // File not found response
							
							} else {
								
								fileServer.file.send(res, absPath, data);	// Returns file
								
							}
						
						
						}); 
					
					} else {
						
						fileServer.statusCode(res, 404); // File not found response
						
					}
				
				});
			
			}
			
		},
		
		send: function (res, filePath, fileContents) {
			
			res.writeHead(200, {'Content-Type' : mime.lookup(path.basename(filePath))});
			res.end(fileContents);
			
		}
	},
	
	//	Returns error message:
	statusCode: function (res, code) {
		
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
	
	},

}






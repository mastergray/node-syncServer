/****
*
*	Ajax.js - Constructor object for encapsulating client side asynchronous JavaScript and XML
*
*	Note: response type 'json' only returns a string for IE7 and below due to not supporting JSON.parse()
*
****/
	
	//	CONSTRUCTOR:
	function Ajax(url) {
	
		// Stores XHR object for modern browsers (IE7+, Firefox, Chrome, Opera, Safari), otherwise stores XHR object for IE6 and IE5:
		window.XMLHttpRequest ? this.XHR = new XMLHttpRequest():this.XHR = new ActiveXObject("Microsoft.XMLHTTP");
		
		// URL in which the request is being made to:
		this.URL = url; 
		
	}

	//	Chainable HTTP GET method that accepts an associate array 'getValues' if provided:
	Ajax.prototype.get = function (getValues) {
	
		getValues ? this.XHR.open("GET",this.URL + '?' + this.query(getValues),true) : this.XHR.open("GET",this.URL);
		this.XHR.send();
		
		return this; 
	
	}

	//	Chainable HTTP POST method for that accepts an associate array 'getValues' and a string 'contentType':
	Ajax.prototype.post = function (postValues, contentType) {
				
		this.XHR.open("POST",this.URL,true);
		contentType ? this.XHR.setRequestHeader("Content-type", contentType) : this.XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		this.XHR.send(this.query(postValues));
	
		return this;
	
	}
	
	//	Chainable method for specifying a request that uses any HTTP method, any requests headers, and post values:
	Ajax.prototype.customRequest = function (httpMethod, requestHeader, postValues) {
		
		this.XHR.open(httpMethod,this.URL,true);
		
			// Sets request headers provided by the associate array 'requestHeader':
			for (header in requestHeader) { this.XHR.setRequestHeader(header,requestHeader[header]);}
			
			//	Sets post value string provided by the associate array 'postValues' if one is given:
			postValues ? this.XHR.send(this.query(postValues)) : this.XHR.send();
			
		return this;
	}

	//	Handles response from XHR object by type:
	Ajax.prototype.response = function (type) {
	
		var type = type || 'xml'; // defaults to XML;
		
			switch(type.toLowerCase()) {
				case 'txt':
				case 'text':
					return this.XHR.responseText;
				break;
				case 'json':
					try {
							return JSON.parse(this.XHR.responseText);
						
						} catch (e) {
						
							return this.XHR.responseText; // For browsers that do not support JSON.parse():
					}
				break;
				case 'xml':
				default:
					return this.XHR.responseXML;
			}
	
	}
	
	//	Formats query string from an associate array:
	Ajax.prototype.query = function (queryStringValues) {
	
		var queryStr = '';
	
			for (value in queryStringValues) {
			
				queryStr += encodeURIComponent(value) + '=' + encodeURIComponent(queryStringValues[value]) + '&'; // Ensures all URLs are properly encoded
			
			}
			
		return queryStr.substring(0, queryStr.length - 1); // removes last '&';
	
	}
	
	//	Chainable SETTER Method for a URL:
	Ajax.prototype.setURL = function (url, getValues) { 
		
		this.URL = url ? this.url = url + '?' + this.query(getValues): this.url = url; // For setting a query string used by a custom request 
		return this;
	
	}
	
	//	Chainable method that aborts current request if request is still active:
	Ajax.prototype.abort = function () {this.XHR.abort(); return this}

	//	GETTER Methods:
	Ajax.prototype.getReadyState         = function() { return this.XHR.readyState; }
	Ajax.prototype.getStatus             = function() { return this.XHR.status; }
	Ajax.prototype.getResponseHeader     = function() { return this.XHR.getResponseHeader()};
	Ajax.prototype.getAllResponseHeaders = function() { return this.XHR.getAllResponseHeaders()};
	
	//	Checks status or state of request (unnecessary syntatic sugar?):
	Ajax.prototype.isNotInit    = function() { return (this.getReadyState() == 0); }
	Ajax.prototype.isConnected  = function() { return (this.getReadyState() == 1); }
	Ajax.prototype.isReceived   = function() { return (this.getReadyState() == 2); }
	Ajax.prototype.isProcessing = function() { return (this.getReadyState() == 3); }
	Ajax.prototype.isFinished   = function() { return (this.getReadyState() == 4); }
	Ajax.prototype.isOK 	    = function() { return (this.getStatus() == 200); }
	Ajax.prototype.isNotFound   = function() { return (this.getStatus() == 404); }

	//	Event Handlers:
	Ajax.prototype.onchange 	 = function (callback) {this.XHR.onreadystatechange = function () {callback()};}
	Ajax.prototype.onready 		 = function (callback) {
		if (this.isFinished() && this.isOK()) {
			callback();
		}
	}
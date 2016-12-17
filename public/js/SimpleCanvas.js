/*
*
*	SimpleCanvas.js - Basic framework for using HTML5 canvas element with a 2D context:
*
***/

	//	CONSTRUCTOR
	function SimpleCanvas(elem, width, height) {
	
		this.elem 	 = elem								// canvas HTML element
		this.context = this.elem.getContext('2d');		// 2D context for stored canvas HTML element
		this.width   = width || 100;					// canvas width (100px by default)
		this.height  = height || 100;					// canvas height (100px by default)
	
	}
	
	SimpleCanvas.prototype.clear = function () {
	
		this.context.clearRect(0, 0, this.width, this.height);
	
	}
	
	SimpleCanvas.prototype.save = function () {
	
		this.context.save();
	
	}
	
	SimpleCanvas.prototype.restore = function () {
	
		this.context.restore();
	
	}
	
	SimpleCanvas.prototype.fill = function (color) {
		
		this.context.fillStyle = color;
		this.context.fill();
		
	}
	
	SimpleCanvas.prototype.drawLine = function (startX, startY, endX, endY, color) {
	
		this.context.beginPath();
		this.context.moveTo(startX,startY);
		this.context.lineTo(endX,endY);
		this.context.strokeStyle = color || '#000000';
		this.context.stroke();
	
	}
	
	SimpleCanvas.prototype.drawRect = function (x, y, width, height, border, fill) {
	
		this.context.rect(x, y, width, height);
		this.context.strokeStyle = border || '#000000';
		
			if (fill) {
			
				this.context.fillStyle = fill;
				this.context.fill();
			
			}
			
		this.context.stroke();
	
	}
	
	SimpleCanvas.prototype.drawCircle = function (x, y, radius, border, fill) {
	
		this.context.beginPath();
		this.context.arc(x,y,radius,0,2*Math.PI);
		this.context.strokeStyle = border || '#000000';
		
			if (fill) {
			
				this.context.fillStyle = fill;
				this.context.fill();
			
			}
		
		this.context.stroke();
	
	}
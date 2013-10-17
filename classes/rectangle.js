"use strict";

function Rectangle(stage, x, y, width, height){

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	var stage = stage;
	var that = this;
        var debugSprite;
	// draw rectangle
	if(DEBUGMODE){
		var debugPixTexture = PIXI.Texture.fromImage("PIXI/debugPix.png");
		debugSprite = new PIXI.TilingSprite(debugPixTexture, that.width, that.height);
		debugSprite.position.x = that.x;
		debugSprite.position.y = that.y;
		stage.addChild(debugSprite);
	}
	
	this.isIntersecting = function(other){
		// code retrieved from e.James
	    var xOverlap = valueInRange(that.x, other.x, other.x + other.width) || valueInRange(other.x, that.x, that.x + that.width);
	    var yOverlap = valueInRange(that.y, other.y, other.y + other.height) || valueInRange(other.y, that.y, that.y + that.height);
	    return xOverlap && yOverlap;
	}

	var valueInRange = function(value, min, max){ 
		// code retrieved from e.James
		return (value >= min) && (value <= max); 
	}

	this.moveX = function(xToMove){
		that.x += xToMove;
		if(DEBUGMODE) debugSprite.position.x += xToMove;
	}

	this.moveY = function(yToMove){
		that.y += yToMove;
		if(DEBUGMODE) debugSprite.position.y += yToMove;
	}

	this.moveToX = function(xToMove){
		that.x = xToMove;
		if(DEBUGMODE) debugSprite.position.x = xToMove;
	}

	this.moveToY = function(yToMove){
		that.y = yToMove;
		if(DEBUGMODE) debugSprite.position.y = yToMove;
	}

	this.addWidth = function(width){
		that.width += width;
		if(DEBUGMODE) debugSprite.width += width;

	}
    this.destroy = function(){
    	if(DEBUGMODE) stage.removeChild(debugSprite);
    }
}

// For node.js require
if(typeof window == 'undefined')
	global.Rectangle = Rectangle;
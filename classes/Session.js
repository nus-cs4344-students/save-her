"use strict"; 
 
function Session(playerID){
	
	var ownerID = playerID;
	
	this.getOwner = function(){
		return ownerID;
	}
	
	this.getSocket = function(){
		return socket;
	}
}


// For node.js require
global.Session = Session;
"use strict"; 
 
function Session(owner,id,m){
	
	var that = this;
	this.ownerID = owner;
	this.sessionID = id;
	this.numPlayers = 1;
	this.map = m;
	this.players = new Array();
	this.players[0] = owner;
	
	this.addPlayer = function(playerID){
		
		that.players[numPlayers] = playerID;
		that.numPlayers++;
		
	}
}


// For node.js require
global.Session = Session;
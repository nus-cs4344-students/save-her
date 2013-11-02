"use strict"; 
 
function Session(player,id,m){
	
	var that = this;
	this.sessionID = id;
	this.playerLabel = 0;
	this.numPlayers = 1;
	this.map = m;
	this.port;
	this.players = new Array();
	this.players[0] = player;
	this.started = false;
	
	this.addPlayer = function(playerID){
		
		that.players[that.playerLabel] = playerID;
		that.numPlayers++;
		that.playerLobal++;
		
	}
	
	this.removePlayer = function(playerID){
	
		delete that.players[playerID];
		that.numPlayers--;
		
		if (isEmpty()){
			return false;
		} 
		
		return true;
		
	}
		
	var isEmpty = function(){
		
		if (that.numPlayers==0){
			return true;
		}
		
		return false;
		
	}
}


// For node.js require
global.Session = Session;
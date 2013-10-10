"use strict"; 
 
function PlayerManager(){
	//private var
	var playerCount;
	var players;
	
	//constructor
	playerCount = 0;	
    players = new Array();
	
	this.addPlayer = function(name){
		var playerID = playerCount;
		players[playerID] = new Player(name,playerID);
		playerCount++;
		return playerID;
	}
	
	this.setChar = function(playerID,character){
		players[playerID].setChar(character);
	}
	
	this.getChar = function(playerID){
	
		return players[playerID].getChar();
	
	}
	
	this.getPlayerById = function(playerID){
	
		return players[playerID].getName();
	
	}	
	
}

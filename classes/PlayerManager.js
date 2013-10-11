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
	
	this.setMap = function(playerID,map){
		
		var session = sm.addSession(playerID);
		players[playerID].setMap(map,session);
		
	}
	
	this.getLastSession = function(playerID){
	
		return players[playerID].getLastSession();
	
	}
	
	this.getChar = function(playerID){
	
		return players[playerID].getChar();
	
	}
	
	this.getCharAvatar = function(playerID){
	
		return players[playerID].getCharAvatar();
	
	}
	
	this.getPlayerById = function(playerID){
	
		return players[playerID].getName();
	
	}	
	
	this.getAllPlayers = function(){
		
		return players;
	
	}
	
	this.getTotalPlayers = function(){
	
		return playerCount;
	
	}
}


// For node.js require
global.PlayerManager = PlayerManager;

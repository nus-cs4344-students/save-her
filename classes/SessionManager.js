 "use strict"; 
 
function SessionManager(){
	
	var sessionCount;
	var sessionLabel;
	var sessions;
	
	//constructor 
	sessionCount = 0;
	sessionLabel = 0;
    sessions = new Array();
	
	this.addSession = function(ownerID,map){		
		var sessionID = sessionLabel;
		sessions[sessionID] = new Session(ownerID,sessionID,map);
		sessionCount++;
		sessionLabel++;
		return sessionID;
	}
	
	var removeSession = function(sessionID){
		console.log("deleting session");
		delete sessions[sessionID];
		sessionCount--;
	}
	
	this.addPlayerToSession = function(sessionID,playerID){
	
		sessions[sessionID].addPlayer(playerID);
	
	}
	
	this.removePlayerFromSession = function(sessionID,playerID){
		console.log("removing player from session");
		if (!sessions[sessionID].removePlayer(playerID)){
			//if no players left
			removeSession(sessionID);
		}
	
	}
	
	this.getSession = function(sessionID){
		return sessions[sessionID];
	}
		
	this.getTotalSessions = function(){
		return sessionCount;
	}
	
	this.getAllSessions = function(){
		return sessions;
	}
}


// For node.js require
global.SessionManager = SessionManager;
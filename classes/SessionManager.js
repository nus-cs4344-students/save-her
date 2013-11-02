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
	
	this.setPort = function(sessionID,port){
	
		sessions[sessionID].port = port;
	
	}
	
	this.startSession = function(sessionID){
		
		sessions[sessionID].started = true;
	
	}
	
	this.removePlayerFromSession = function(sessionID,playerID){
		console.log("removing player from session");
		if (!sessions[sessionID].removePlayer(playerID)){
			//if no players left
			removeSession(sessionID);
			//return true if session is deleted
			return true;
		}
		//else return false (means no session deleted)
		return false;
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
	
	//pending session means the sessions that have not started
	//where all players in the session are in "waiting" state
	this.getAllPendingSessions = function(){	
		var temp = new Array();
		for (var i = 0; i<sessions.length; i++){
			if (sessions[i]!=undefined && !sessions[i].started){
				temp.push(sessions[i]);
			}
		}
		
		return temp;	
	}
}


// For node.js require
global.SessionManager = SessionManager;
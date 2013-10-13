 "use strict"; 
 
function SessionManager(){
	
	var sessionCount;
	var sessions;
	
	//constructor 
	sessionCount = 0;
    sessions = new Array();
	
	this.addSession = function(ownerID,map){		
		var sessionID = sessionCount;
		sessions[sessionID] = new Session(ownerID,sessionID,map);
		sessionCount++;
		return sessionID;
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
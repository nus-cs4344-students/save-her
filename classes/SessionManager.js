 "use strict"; 
 
function SessionManager(){
	
	var sessionCount;
	var sessions;
	
	//constructor 
	sessionCount = 0;
    sessions = new Array();
	
	this.addSession = function(ownerID){		
		var sessionID = sessionCount;
		sessions[sessionID] = new Session(ownerID);
		sessionCount++;
		return sessionID;
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
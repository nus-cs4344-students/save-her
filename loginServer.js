"use strict";

var lib_path = "./classes/";
require(lib_path + "PlayerManager.js");
require(lib_path + "Player.js");
require(lib_path + "SessionManager.js");
require(lib_path + "Session.js");
require(lib_path + "constantsServer.js");

var sessionChild = new Array();

function loginServer(){

	var serverSocket;
	var playerSockets;
	var players;
	
	var pm,sm;

	var express = require('express');
	var http = require('http');
	var sockjs = require('sockjs');
	
	http.globalAgent.maxSockets = 20; //maximum 20 clients at any time
	
	serverSocket = sockjs.createServer();		
	playerSockets = new Array();
	players = new Object;
	pm = new PlayerManager();
	sm = new SessionManager();
	
	var unicast = function (socket, msg) {
		socket.write(JSON.stringify(msg));
	}
			
	var setPlayer = function(playerID,socket){
		
				
		console.log("socket.id = "+socket.id);
		playerSockets[playerID] = socket;
		players[socket.id] = playerID;
				
		for (var i in players){		
			console.log("players["+i+"] = "+players[i]);
			console.log("playerID = " + playerID);
		}
	}
	
	var isExists = function(playerID){
		
		if (pm.getPlayerName(playerID)!=undefined){
			console.log("exists!");
			return true;
		} else{
			console.log("no exists!");
			return false;
		}
		
	}
	
	var isConnected = function(playerID){
		for (var i in players){	
			console.log("players["+i+"] = "+players[i]);
			console.log("playerID = " + playerID);
			if (playerID == players[i]){
				console.log("already connected");
				return true;
			}
		}
		console.log("did not find connection");
		return false;
	}
	
		
    this.start = function () {
		try {					
			serverSocket.on("connection", function(socket){			
			
				socket.on('close', function () {
					//when player disconnects, remove him from his current game session					
					if (isExists(players[socket.id])){
						var lastSession = pm.getLastSession(players[socket.id]);
						console.log("lastSession = " + lastSession);
						if (lastSession != undefined){
							//remove player from the previous session, and if 
							//nobody else is in that session, remove it.
							console.log("player #" + players[socket.id] + " has disconnected");
							if(sm.removePlayerFromSession(lastSession.sessionID,players[socket.id])){
								//if true, means session is deleted, 
								//then have to kill the child process of server for that game instance
								console.log("killing server...");
								sessionChild[lastSession.sessionID].kill('SIGTERM');
							}
							pm.setSession(players[socket.id],undefined);
						}						
						delete players[socket.id];
					}				
				});
				
				// on receiving something from client
				socket.on("data", function(e){
				
					var message = JSON.parse(e);
					switch (message.type) {
					
						case "new_player":
							console.log("new players");
							var playerID = pm.addPlayer(message.player);
							setPlayer(playerID,socket);
							var pInfo = {
								type:"new_player",
								playerID:playerID};
							unicast(playerSockets[playerID],pInfo);
							break;
						case "relog_player":
							if (isExists(message.playerID) && !isConnected(message.playerID)){
								console.log("existing player relogging");
								setPlayer(message.playerID,socket);
								var pInfo = {
									type:"relog_player",
									player:pm.getPlayer(message.playerID),
									playerName:pm.getPlayerName(message.playerID),
									character:pm.getChar(message.playerID),
									avatar:pm.getCharAvatar(message.playerID)};
								unicast(playerSockets[message.playerID],pInfo);
							} else{														
								unicast(socket,{type:"PlayerNotFound"});
							}
							
							break;
						case "set_char":
							pm.setChar(message.playerID,message.character);							
							break
						case "join_game":		
							console.log("now setting player's session - #" + message.sessionID);
							var s = sm.getSession(message.sessionID);
							pm.setSession(message.playerID,s);	
							sm.addPlayerToSession(message.sessionID,message.playerID);
							console.log("checking player's("+message.playerID+") session: " + pm.getLastSession(message.playerID).sessionID);
							unicast(playerSockets[message.playerID],{type:"join_game",map:s.map,port:s.port});
							break;
						case "new_game":
							var gameport;
							console.log("received new_game, setting up now...");
							var lastSession = pm.getLastSession(message.playerID);
							console.log("last game session: "+ lastSession);
							if ( lastSession != undefined){
								//remove player from the previous session, and if 
								//nobody else is in that session, remove it.
								console.log("attempting to remove player from session");
								if(sm.removePlayerFromSession(lastSession.sessionID,message.playerID)){
									//if true, means session is deleted, 
									//then have to kill the child process of server for that game instance
									console.log("killing server");
									sessionChild[lastSession.sessionID].kill(SIGHUB);
								}
								pm.setSession(message.playerID,undefined);
							}
							var newSessionID = sm.addSession(message.ownerID,message.map);
							console.log("new game session ID: "+ newSessionID);
							var tmp = sm.getSession(newSessionID);
							console.log("session: " + tmp);
							console.log("sessionInfo: sessionID=" + tmp.sessionID + ", numPlayer = " + tmp.numPlayers + ", map = " + tmp.map);
							// need to create a child server for the player to connect to
							try{
								sessionChild[newSessionID] = require('child_process').fork('server.js');
								console.log("new child created");
								//wait to receive port number from the game server
								sessionChild[newSessionID].on("message", function(m){
									gameport = m.port;
									sm.setPort(newSessionID,gameport);
									console.log("now setting player's session");
									pm.setSession(message.playerID,sm.getSession(newSessionID));
									console.log("checking player's session: " + pm.getLastSession(message.playerID).sessionID);
									console.log("sending port = " + gameport);
									unicast(playerSockets[message.playerID],{type:"new_game",sessionID:newSessionID,port:gameport});
								});
							} catch (f) {
								console.log("Child-creating Error: " + f);
							}							
							break;
						case "get_all_sessions":
							unicast(playerSockets[message.playerID],{type:"get_all_sessions",allSessions:sm.getAllSessions()});
							break;
					}
				});	
			});
		}catch (e) {
            console.log("Error: " + e);
        }
	}
	
	var application = express();
	var httpServer = http.createServer(application);

	serverSocket.installHandlers(httpServer, {prefix:'/SaveHer'});
	httpServer.listen(4000, '0.0.0.0');
	application.use(express.static(__dirname));
}


// This will auto run after this script is loaded
var loginServer = new loginServer();
loginServer.start();

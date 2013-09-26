"use strict";

var lib_path = "./classes/";
require(lib_path + "character.js");
require(lib_path + "characterFactory.js");
require(lib_path + "constantsServer.js");
require(lib_path + "rectangle.js");
require(lib_path + "utility.js");

// server position of all players
var players = [];
var sockets = {};

function Server(){

	var express = require('express');
	var http = require('http');
	var sockjs = require('sockjs');

	var characterFac = new CharacterFactory();
	var serverSocket = sockjs.createServer();
	
	// for printing
	var counter = 0;

	serverSocket.on("connection", function(socket){

		sockets[socket.id] = socket;
		players[socket.id] = characterFac.createCharacter(null, CHARACTERTYPE.PUMPKIN, false);

		// on receiving something from client
		socket.on("data", function(e){
			console.log(e);

			var broadcast = false;
            var message = JSON.parse(e);
            switch (message.type) {
	            case "posForce":
	            	var player = players[socket.id];
	                players[socket.id].interpolateTo(message.x, message.y);
	                broadcast = true;
	            	break;
	            case "pos":
	            	var player = players[socket.id];
	            	var diffX = Math.abs(player.getPosX() - message.x);
	            	var diffY = Math.abs(player.getPosY() - message.y);
	            	if(diffX > 200 || diffY > 200){
	                	players[socket.id].interpolateTo(message.x, message.y);
	                	broadcast = true;
	            	}
	                break;
	            case "jump":
	            	players[socket.id].jump();
	            	broadcast = true;
	            	break;
	            case "speedX":
	            	players[socket.id].setSpeedX(message.x);
	            	broadcast = true;
            }

			var id;

			// broadcast to all other players
			if(broadcast){
				//console.log("broadcast" + counter++);
				for(id in sockets){
					if(sockets[id] != socket){
						sockets[id].write(e);
					}
				}
			}
		});

	});

	var application = express();
	var httpServer = http.createServer(application);

	serverSocket.installHandlers(httpServer, {prefix:'/game'});
	httpServer.listen(4000, '0.0.0.0');
	application.use(express.static(__dirname));
}

global.mapRects = [];

function Main(){

	var stage = null;	// server side, no concept of stage
	var that = this;

	// complete loading of assets
	this.start = function()
	{
		// start updating
		setInterval(update, FRAMEDURATION);

		for(var i=0; i<map.length; i++){

			var prev = 0;
			var prevRect;

			for(var j=0; j<map[i].length; j++){
				if(map[i][j] == 1){
					if(prev == 1)
						prevRect.addWidth(TILEWIDTH);		// 'merge' tiles next to each other
					else{
						prevRect = new Rectangle(stage, j*TILEWIDTH, i*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
						mapRects.push(prevRect);
					}
				}
				prev = map[i][j];
			}

		}
	}

	// game loop
	function update() {
		for(var id in sockets){
			//console.log(players[id].getPosX());
			players[id].update();
		}
	}

}

var application = new Main();
var server = new Server();
application.start();
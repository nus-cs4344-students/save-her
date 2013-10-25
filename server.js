"use strict";

var lib_path = "./classes/";
require(lib_path + "character.js");
require(lib_path + "bullet.js");
require(lib_path + "bulletManager.js");
require(lib_path + "SkillManager.js");
require(lib_path + "characterFactory.js");
require(lib_path + "constantsServer.js");
require(lib_path + "particleManager.js");
require(lib_path + "rectangle.js");
require(lib_path + "utility.js");

// server position of all players
var players = [];
var characters = [];
var bulletManagers = [];
var skillManagers = [];
var sockets = [];

// for managing ports
var usedPorts = [];

/*
 * private method: unicast(socket, msg)
 *
 * unicast takes in a socket and a JSON structure 
 * and send the message through the given socket.
 *
 * retrieved from PongServer.js
 */
var unicast = function(socket, msg) {
    socket.write(JSON.stringify(msg));
}

// unicast to the socket owner with playerID attached
var unicastWithPlayerID = function(socket, msg) {
    msg['playerID'] = socket.id;
    unicast(socket, msg);
}

// broadcast to others with playerID attached
var broadcastRestWithPlayerID = function(socket, msg) {
    msg['playerID'] = socket.id;
    var messageToSend = JSON.stringify(msg);

    var id;
    for (id in sockets)
        if (sockets[id] != socket)
            sockets[id].write(messageToSend);
}
var broadcast = function(msg) {
    var messageToSend = JSON.stringify(msg);
    for (var id in sockets)
        sockets[id].write(messageToSend);
}
function Server(port) {

    var express = require('express');
    var http = require('http');
    var sockjs = require('sockjs');

	http.globalAgent.maxSockets = 8; //maximum 8 players in a game
    var characterFac = new CharacterFactory();
    var serverSocket = sockjs.createServer();

    // for printing
    var counter = 0;

    serverSocket.on("connection", function(socket) {
        try {
            // send current players to the new player
           for (var id in sockets)
				unicast(socket, {type: "newPlayer", playerID: id, characterType: characters[id]})

            sockets[socket.id] = socket;

            // on receiving something from client
            socket.on("data", function(e) {

                setTimeout(function(){
                    console.log(e);

                    var broadcast = false;
                    var message = JSON.parse(e);
                    switch (message.type) {

                        case "newPlayer":
                            console.log("new game player");
                            characters[socket.id] = message.characterType;
                            players[socket.id] = characterFac.createCharacter(null, message.characterType, false);
                            bulletManagers[socket.id] = new BulletManager(null, players[socket.id], false, true);
                            skillManagers[socket.id] = new SkillManager(null, players[socket.id], bulletManagers[socket.id],false, true);

                        case "jump":
                            players[socket.id].jump();
                            broadcast = true;
                            break;

                        // landed from a fall
                        case "land":
                            players[socket.id].startInterpolateX(message.PosX);
                            players[socket.id].startInterpolateY(message.PosY);
                            broadcast = true;
                            break;

                        // fall when hovering over nothing
                        case "fall":
                            players[socket.id].setPosition(message.PosX, message.PosY);
                            players[socket.id].fall();
                            broadcast = true;
                            break;

                        case "speedX":
                            if(!players[socket.id].isObsolete(message.Seq)){
                                players[socket.id].setSpeedX(message.SpeedX);
                                players[socket.id].startInterpolateX(message.PosX);
                                broadcast = true;
                            }
                            break;

                        case "shoot":
                            bulletManagers[socket.id].setDir(message.dir);
                            bulletManagers[socket.id].shoot();
                            broadcast = true;
                            break;

                        case "skill":
                            //use the accurate position
                            if (players[socket.id].characterType == CHARACTERTYPE.PUMPKIN)
                                skillManagers[socket.id].serverMine(message.x, message.y);
                            else
                                skillManagers[socket.id].skill();
                            broadcast = true;
                            break;
                    }

                    var id;

                    // broadcast to all other players
                    if (broadcast){
                        setTimeout(function(){
                            broadcastRestWithPlayerID(socket, message);
                        }, getDelay());
                    }

                }, getDelay());
            });
        } catch (e) {
            console.log("Error: " + e);
        }
    });

    var application = express();
    var httpServer = http.createServer(application);

    serverSocket.installHandlers(httpServer, {prefix: '/game'});
    httpServer.listen(port, '0.0.0.0');
    application.use(express.static(__dirname));
}

global.mapRects = null;

function Main() {

    var stage = null;	// server side, no concept of stage
    var that = this;

    this.start = function()
    {
        // start updating
        setInterval(update, FRAMEDURATION);

        // create map
        mapRects = createArray(map.length, map[0].length);
        var rect;
        for (var i = 0; i < map.length; i++) {

            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j] == 1 || map[i][j] == 2) {
                    rect = new Rectangle(stage, j * TILEWIDTH, i * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                    mapRects.push(rect);
                }
            }

        }
    }

    // game loop
    function update() {
        for (var id in sockets)
        {
			if (players[id]!=undefined){
				players[id].update();
				var msgs = bulletManagers[id].update(players, null, id);
				for (var i = 0; i < msgs.length; i++)
				{
					broadcast(msgs[i]);
				}
				var msgs = skillManagers[id].update(players, null, id);

				for (var i = 0; i < msgs.length; i++)
				{
					broadcast(msgs[i]);
				}
            }
        }

    }

}

//---for managing communication between server.js (child) and loginServer.js (parent)
process.on('SIGTERM', function () {
	console.log("exiting");
	process.exit(0);
});

var isGoodPort = function(port){
	for (var i = 0; i<usedPorts.length; i++){
		if (usedPorts[i] == port){
			return false;
		}
	}
	usedPorts.push(port);
	return true;
}

var application = new Main();
console.log("old GAMEPORT = " + GAMEPORT);
var p = GAMEPORT+Math.floor((Math.random()*100)+1);
while (!isGoodPort(p)){
	p = GAMEPORT+Math.floor((Math.random()*100)+1);
}
process.send({port:p});
var server = new Server(p);
console.log("connecting to port = " + p);
application.start();
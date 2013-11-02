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
var playerProfile = [];
var bulletManagers = [];
var skillManagers = [];
var sockets = [];
var interestList = [];

var gameStarted = false;    // if gameStarted, then won't accept any new players

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
var broadcastAll = function(msg) {
    var messageToSend = JSON.stringify(msg);
    for (var id in sockets)
        sockets[id].write(messageToSend);
}
var broadcastWithInterest = function(socket, msg) {
    msg['playerID'] = socket.id;
    var messageToSend = JSON.stringify(msg);

    var id;
    //console.log("bw "+socket);
    for (id in interestList[socket.id])
    {
        console.log(id + " " + interestList[socket.id][id]);
        if (interestList[socket.id][id] == true)
            sockets[id].write(messageToSend);
    }
}
var updateInterest = function() {
    for (var i in players)
    {
        for (var j in players)
            if (i != j)
            {
                var x1 = players[i].getPosX();
                var y1 = players[i].getPosY();
                var x2 = players[j].getPosX();
                var y2 = players[j].getPosY();
                if (Math.abs(x1 - x2) < 1600 && Math.abs(y1 - y2) < 1200)
                {
                    interestList[i][j] = true;
                    interestList[j][i] = true;
                    //console.log("updateInterest "+i);
                }
                else
                {
                    interestList[i][j] = false;
                    interestList[j][i] = false;
                }
            }
    }
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
           for (var id in sockets){
				unicast(socket, {type: "newPlayer", playerID: id, player: playerProfile[id]});
			}

            sockets[socket.id] = socket;

            // on receiving something from client
            socket.on("data", function(e) {

                setTimeout(function(){
                    console.log(e);

                    var broadcast = false;
                    var message = JSON.parse(e);

                    if(players[socket.id] == undefined &&
                        message.type!="newPlayer")
                        return;

                    switch (message.type) {

                        case "newPlayer":
                            if(!gameStarted){
                                playerProfile[socket.id] = message.player;
                                players[socket.id] = characterFac.createCharacter(null, message.player.character, false);
                                bulletManagers[socket.id] = new BulletManager(null, players[socket.id], false, true);
                                skillManagers[socket.id] = new SkillManager(null, players[socket.id], bulletManagers[socket.id],false, true);
                                var t = [];
                                interestList[socket.id] = t;
                                broadcast = true;
                            }
                            break;

                        case "hostStartGame":
                            gameStarted = true;
							process.send("started");
                            for (var id in sockets){
                                bulletManagers[id].startOperation();
                                skillManagers[id].startOperation();
                            }
                            broadcast = true;
                            break;

                        // jump
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
                            if (!players[socket.id].isObsolete(message.Seq)) {
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
                    updateInterest();
                    // broadcast to all other players
                    if (broadcast) {
                        setTimeout(function() {
                            if (message.type == "newPlayer")
                                broadcastRestWithPlayerID(socket, message);
                            else if (message.type == "hostStartGame")
                                broadcastAll(message);
                            else
                                broadcastWithInterest(socket, message);
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
    }

    // game loop
    function update() {

        for (var id in sockets)
        {
            if (players[id] != undefined) {
                players[id].update();
                var msgs = bulletManagers[id].update(players, null, id);
                for (var i = 0; i < msgs.length; i++)
                {
                    broadcastAll(msgs[i]);
                }
                var msgs = skillManagers[id].update(players, null, id);

                for (var i = 0; i < msgs.length; i++)
                {
                    broadcastAll(msgs[i]);
                }
            }
        }

    }

}

function generateMapCollisionBounds(mapType){
    switch(mapType){
        case 0:
            map = map0;
            break;
        case 1:
            map = map1;
            break;
        case 2:
            map = map2;
            break;
    }

    // create map
    mapRects = createArray(map.length, map[0].length);
    var rect;
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1 || map[i][j] == 2) {
                rect = new Rectangle(null, j * TILEWIDTH, i * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                mapRects[i][j] = rect;
            }
        }
    }

}

//---for managing communication between server.js (child) and loginServer.js (parent)
process.on('SIGTERM', function () {
	console.log("exiting");
	process.exit(0);
});

process.on('message', function (m) {
    generateMapCollisionBounds(parseInt(m));
});


var application = new Main();
console.log("starting on port = " + process.argv[2]);
var server = new Server(process.argv[2]);
application.start();
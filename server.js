"use strict";

var lib_path = "./classes/";
require(lib_path + "character.js");
require(lib_path + "bullet.js");
require(lib_path + "bulletManager.js");
require(lib_path + "characterFactory.js");
require(lib_path + "constantsServer.js");
require(lib_path + "particleManager.js");
require(lib_path + "rectangle.js");
require(lib_path + "utility.js");

// server position of all players
var players = [];
var bulletManagers = [];
var sockets = {};

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
function Server() {

    var express = require('express');
    var http = require('http');
    var sockjs = require('sockjs');

    var characterFac = new CharacterFactory();
    var serverSocket = sockjs.createServer();

    // for printing
    var counter = 0;

    serverSocket.on("connection", function(socket) {

        // send current players to the new player
        for (var id in sockets)
            unicast(socket, {type: "newPlayer", playerID: id, characterType: CHARACTERTYPE.PUMPKIN})

        sockets[socket.id] = socket;
        players[socket.id] = characterFac.createCharacter(null, CHARACTERTYPE.PUMPKIN, false);
        bulletManagers[socket.id] = new BulletManager(null, players[socket.id], false, true);
        // broadcast current players with the new player
        broadcastRestWithPlayerID(socket, {type: "newPlayer", characterType: CHARACTERTYPE.PUMPKIN})

        // on receiving something from client
        socket.on("data", function(e) {
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
                    if (diffX > 200 || diffY > 200) {
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
                    break;
                case "shoot":
                    bulletManagers[socket.id].setDir(message.dir);
                    bulletManagers[socket.id].shoot();
                    broadcast = true;
                    break;
            }

            var id;

            // broadcast to all other players
            if (broadcast)
                broadcastRestWithPlayerID(socket, message);
        });

    });

    var application = express();
    var httpServer = http.createServer(application);

    serverSocket.installHandlers(httpServer, {prefix: '/game'});
    httpServer.listen(4000, '0.0.0.0');
    application.use(express.static(__dirname));
}

global.mapRects = [];

function Main() {

    var stage = null;	// server side, no concept of stage
    var that = this;

    this.start = function()
    {
        // start updating
        setInterval(update, FRAMEDURATION);

        // create map
        for (var i = 0; i < map.length; i++) {

            var prev = 0;
            var prevRect;

            for (var j = 0; j < map[i].length; j++) {
                if (map[i][j] == 1) {
                    if (prev == 1)
                        prevRect.addWidth(TILEWIDTH);		// 'merge' tiles next to each other
                    else {
                        prevRect = new Rectangle(stage, j * TILEWIDTH, i * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        mapRects.push(prevRect);
                    }
                }
                prev = map[i][j];
            }

        }
    }

    // game loop
    function update() {
        for (var id in sockets)
        {
            players[id].update();
            var msgs = bulletManagers[id].update(players, null, id);
            for (var i = 0; i < msgs.length; i++)
            {
                broadcast(msgs[i]);
            }
            ;
        }

        //computeDamage();
    }
    function computeDamage() {
        for (var i in bulletManagers)
            for (var j in players) {
                if (i != j) {

                }
            }
    }
}

var application = new Main();
var server = new Server();
application.start();
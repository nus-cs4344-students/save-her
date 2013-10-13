"use strict";

// no official syntax for enum in javascript :/
// this is a 'trick'
function Enum() {
    for (var i in arguments) {
        this[arguments[i]] = i;
    }
}

var socket;	// global
var socketReady = false;
// retrieved from PongClient
var sendToServer = function(msg) {
    if (socketReady)
        socket.send(JSON.stringify(msg));
}

// use with CHARACTERTYPE.PUMPKIN and so on
var CHARACTERTYPE = new Enum("PUMPKIN", "MUSHROOM", "HUMAN", "DEVIL");

// switch to debug mode to display collision rectangles
var DEBUGMODE = false;

var TILEWIDTH = 64;
var TILEHEIGHT = 64;
var FRAMEDURATION = 17;		// 33: approx 30fps, 17: approx 60fps
var CHARACTERMOVEMENTSPEED = 6;
var CHARACTERJUMPSPEED = 12;
var CHARACTERMAXFALLSPEED = 12;
var CHARACTERJUMPGRAVITATIONALPULL = 3;	// higher = less pull

var ISSERVER = false;

var map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
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

// retrieved from 
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function getRelevantRectangles(posX, posY){
    var x = Math.floor(posX/64);
    var y = Math.floor(posY/64);

    var relevantRects = [];
    for(var i=y-1; i<=y+1; i++){
        if(mapRects[i] == undefined)
            continue;
        for(var j=x-1; j<=x+1; j++){
            if(mapRects[i][j] != undefined)
                relevantRects.push(mapRects[i][j]);
        }
    }

    return relevantRects;
}

// accelerometer controls
var tiltRight = false;
var tiltLeft = false;

// use with CHARACTERTYPE.PUMPKIN and so on
var CHARACTERTYPE = new Enum("PUMPKIN", "MUSHROOM", "HUMAN", "DEVIL");
var SKILLTYPE = new Enum("POWERFIRE","AOE","STUN","LANDMINE");

// switch to debug mode to display collision rectangles
var DEBUGMODE = false;

var TILEWIDTH = 64;
var TILEHEIGHT = 64;
var FRAMEDURATION = 17;		// 33: approx 30fps, 17: approx 60fps
var CHARACTERMOVEMENTSPEED = 6;
var CHARACTERJUMPSPEED = 12;
var CHARACTERMAXFALLSPEED = 12;
var CHARACTERJUMPGRAVITATIONALPULL = 3;	// higher = less pull
var NUMFRAMESTOINTERPOLATE = 3;
var INTERPOLATETHRESHOLD = 20;          // amount of gap until the client decides to interpolate

var ISSERVER = false;

// 1 is top of a tile
// 2 is lower part of a tile
var map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]];
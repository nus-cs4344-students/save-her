"use strict";

// no official syntax for enum in javascript :/
// this is a 'trick'
function Enum() {
    for (var i in arguments) {
        this[arguments[i]] = i;
    }
}

global.nextPort = function(){
	global.GAMEPORT= 5001;
}

// retrieved from 
// http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
global.createArray = function(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

global.getRelevantRectangles = function(posX, posY){
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

// simulated latency between client and server (implemented on client side)
// note that even if delay = 0, due to processing speed (i think), latency is non-zero
global.delay = 0;
global.percentageJitter = 20;

// retrieved from Player in Pong
global.getDelay = function() {
    var to = delay + percentageJitter*delay/100;
    var from = delay - percentageJitter*delay/100;
    if (delay != 0) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    } else {
        return 0;
    }
}

// use with CHARACTERTYPE.PUMPKIN and so on
global.CHARACTERTYPE = new Enum("PUMPKIN", "MUSHROOM", "HUMAN", "DEVIL");
global.SKILLTYPE = new Enum("POWERFIRE","AOE","STUN","LANDMINE");

// switch to debug mode to display collision rectangles
global.DEBUGMODE = false;

global.TILEWIDTH = 64;
global.TILEHEIGHT = 64;
global.FRAMEDURATION = 17;		// 33: approx 30fps, 17: approx 60fps
global.CHARACTERMOVEMENTSPEED = 6;
global.CHARACTERJUMPSPEED = 12;
global.CHARACTERMAXFALLSPEED = 12;
global.CHARACTERJUMPGRAVITATIONALPULL = 3;	// higher = less pull
global.NUMFRAMESTOINTERPOLATE = 3;
global.INTERPOLATETHRESHOLD = 20;          // amount of gap until interpolated

global.ISSERVER = true;

global.GAMEPORT = 4001;

// 1 is top of a tile
// 2 is lower part of a tile
global.map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]];
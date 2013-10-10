"use strict";

// no official syntax for enum in javascript :/
// this is a 'trick'
function Enum() {
    for (var i in arguments) {
        this[arguments[i]] = i;
    }
}

// use with CHARACTERTYPE.PUMPKIN and so on
global.CHARACTERTYPE = new Enum("PUMPKIN", "MUSHROOM", "HUMAN", "DEVIL");

// switch to debug mode to display collision rectangles
global.DEBUGMODE = false;

global.TILEWIDTH = 64;
global.TILEHEIGHT = 64;
global.FRAMEDURATION = 17;		// 33: approx 30fps, 17: approx 60fps
global.CHARACTERMOVEMENTSPEED = 6;
global.CHARACTERJUMPSPEED = 12;
global.CHARACTERMAXFALLSPEED = 12;
global.CHARACTERJUMPGRAVITATIONALPULL = 3;	// higher = less pull

global.ISSERVER = true;

global.map = [[0,0,0,0,0,0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0,0,1,0,0,0],
		   [0,0,1,1,0,0,0,0,0,1,0,0,0],
		   [0,0,0,0,0,0,0,0,0,0,0,0,0],
		   [0,0,0,0,0,0,0,0,0,0,0,0,0],
		   [1,0,0,0,0,1,1,0,0,0,0,0,0],
		   [1,1,1,1,1,1,1,1,1,1,1,1,1]];
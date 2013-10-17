"use strict";

function CharacterFactory(){

	if(!ISSERVER){

		// PUMPKIN -----------------------------------------------------------------------------------

		// initialise pumpkin stop textures
		var pumpkinStopTextures = [];
		for (var i=0; i < 5; i++)
		 	pumpkinStopTextures.push(PIXI.Texture.fromFrame("pumpkinmanstop000" + i + ".png"));

		// initialise pumpkin walking textures
		var pumpkinWalkTextures = [];
		for (var i=0; i < 9; i++)
		 	pumpkinWalkTextures.push(PIXI.Texture.fromFrame("pumpkinmanwalk000" + (i) + ".png"));

		// initialise pumpkin jumping textures
		var pumpkinJumpTextures = [];
		pumpkinJumpTextures.push(PIXI.Texture.fromFrame("pumpkinmanwalk0008.png"));
			
		// initialise pumpkin die textures
		var pumpkinDieTextures = [];
		for (var i=0; i < 9; i++)
		 	pumpkinDieTextures.push(PIXI.Texture.fromFrame("pumpkinman_die0" + (i+1) + ".gif"));
		pumpkinDieTextures.push(PIXI.Texture.fromFrame("pumpkinman_die10.gif"));

		// initialise pumpkin hurt textures
		var pumpkinHurtTextures = [];
		for (var i=0; i < 3; i++)
		 	pumpkinHurtTextures.push(PIXI.Texture.fromFrame("pumpkinman_hurt0" + (i+1) + ".gif"));

		// DEVIL -----------------------------------------------------------------------------------

		// initialise devil stop textures
		var devilStopTextures = [];
		for (var i=0; i < 5; i++)
		 	devilStopTextures.push(PIXI.Texture.fromFrame("babydevil2_stop000" + (i) + ".png"));

		// initialise devil walk textures
		var devilWalkTextures = [];
		for (var i=0; i < 8; i++)
		 	devilWalkTextures.push(PIXI.Texture.fromFrame("babydevil2_walk000" + (i) + ".png"));

		// initialise devil jumping textures
		var devilJumpTextures = [];
		devilJumpTextures.push(PIXI.Texture.fromFrame("babydevil2_walk0007.png"));

		// initialise devil die textures
		var devilDieTextures = [];
		for (var i=0; i < 10; i++)
		 	devilDieTextures.push(PIXI.Texture.fromFrame("babydevil2_die000" + (i) + ".png"));
		for (var i=10; i < 12; i++)
		 	devilDieTextures.push(PIXI.Texture.fromFrame("babydevil2_die00" + (i) + ".png"));

		// initialise devil hurt textures
		var devilHurtTextures = [];
		for (var i=0; i < 3; i++)
		 	devilHurtTextures.push(PIXI.Texture.fromFrame("babydevil2_hurt000" + (i) + ".png"));

		// HUMAN -----------------------------------------------------------------------------------

		// initialise human stop textures
		var humanStopTextures = [];
		for (var i=0; i < 4; i++)
		 	humanStopTextures.push(PIXI.Texture.fromFrame("agent2_stop000" + (i) + ".png"));

		// initialise human walk textures
		var humanWalkTextures = [];
		for (var i=0; i < 9; i++)
		 	humanWalkTextures.push(PIXI.Texture.fromFrame("agent2000" + (i) + "_walk.png"));

		// initialise human jumping textures
		var humanJumpTextures = [];
		humanJumpTextures.push(PIXI.Texture.fromFrame("agent20000_walk.png"));

		// initialise human die textures
		var humanDieTextures = [];
		for (var i=0; i < 9; i++)
		 	humanDieTextures.push(PIXI.Texture.fromFrame("agent2000" + (i+1) + "_die.png"));

		// initialise human hurt textures
		var humanHurtTextures = [];
		for (var i=0; i < 3; i++)
		 	humanHurtTextures.push(PIXI.Texture.fromFrame("agent2000" + (i) + "_hurt.png"));

		// MUSHROOM -----------------------------------------------------------------------------------

		// initialise mushroom stop textures
		var mushroomStopTextures = [];
		for (var i=0; i < 4; i++)
		 	mushroomStopTextures.push(PIXI.Texture.fromFrame("mushroom edit000" + (i) + ".png"));

		// initialise mushroom walk textures
		var mushroomWalkTextures = [];
		for (var i=0; i < 7; i++)
		 	mushroomWalkTextures.push(PIXI.Texture.fromFrame("mushroom_0" + (i+1) + ".png"));

		// initialise mushroom jumping textures
		var mushroomJumpTextures = [];
		mushroomJumpTextures.push(PIXI.Texture.fromFrame("mushroom_05.png"));

		// initialise mushroom die textures
		var mushroomDieTextures = [];
		for (var i=0; i < 8; i++)
		 	mushroomDieTextures.push(PIXI.Texture.fromFrame("mushroomDeath000" + (i) + ".png"));

		// initialise mushroom hurt textures
		var mushroomHurtTextures = [];
		for (var i=0; i < 3; i++)
		 	mushroomHurtTextures.push(PIXI.Texture.fromFrame("mushroomHurt0" + (i+1) + ".png"));
	}

	// -------------------------------------------------------------------------------------------

	// create a new character
	this.createCharacter = function(stage, type, isMine){

		var character = new Character();
		switch(type){
			case CHARACTERTYPE.PUMPKIN:
				character.init(stage, pumpkinStopTextures, pumpkinWalkTextures, pumpkinJumpTextures, pumpkinDieTextures, pumpkinHurtTextures, type);
				break;
			case CHARACTERTYPE.MUSHROOM:
				character.init(stage, mushroomStopTextures, mushroomWalkTextures, mushroomJumpTextures, mushroomDieTextures, mushroomHurtTextures, type);
				break;
			case CHARACTERTYPE.HUMAN:
				character.init(stage, humanStopTextures, humanWalkTextures, humanJumpTextures, humanDieTextures, humanHurtTextures, type);
				break;
			case CHARACTERTYPE.DEVIL:
				character.init(stage, devilStopTextures, devilWalkTextures, devilJumpTextures, devilDieTextures, devilHurtTextures, type);
				break;
		}

		character.initDetectors();
		character.setIsMine(isMine);
                
		return character;
	};

}

// For node.js require
if(typeof window == 'undefined')
	global.CharacterFactory = CharacterFactory;
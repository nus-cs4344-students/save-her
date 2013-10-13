"use strict";

function CharacterFactory(){

	if(!ISSERVER){

		// PUMPKIN -----------------------------------------------------------------------------------

		// initialise pumpkin stop textures
		var pumpkinStopTextures = [];
		for (var i=0; i < 4; i++)
		 	pumpkinStopTextures.push(PIXI.Texture.fromFrame("pumpkinmanStop_0" + (i+1) + ".png"));

		// initialise pumpkin walking textures
		var pumpkinWalkTextures = [];
		for (var i=0; i < 9; i++)
		 	pumpkinWalkTextures.push(PIXI.Texture.fromFrame("pumpkinmanWalk_0" + (i+1) + ".png"));

		// initialise pumpkin jumping textures
		var pumpkinJumpTextures = [];
		pumpkinJumpTextures.push(PIXI.Texture.fromFrame("pumpkinmanWalk_09.png"));
			
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

		// initialise devil textures
		var devilWalkTextures = [];
		devilWalkTextures.push(PIXI.Texture.fromFrame("babydevil_01.png"));
		for (var i=1; i < 8; i++)
		 	devilWalkTextures.push(PIXI.Texture.fromFrame("babydevil_0" + (i+1) + ".gif"));

		// HUMAN -----------------------------------------------------------------------------------

		// initialise human textures
		var humanWalkTextures = [];
		humanWalkTextures.push(PIXI.Texture.fromFrame("agent_01.png"));
		for (var i=1; i < 8; i++)
		 	humanWalkTextures.push(PIXI.Texture.fromFrame("agent_0" + (i+1) + ".gif"));

		// MUSHROOM -----------------------------------------------------------------------------------

		// initialise mushroom textures
		var mushroomWalkTextures = [];
		for (var i=0; i < 7; i++)
		 	mushroomWalkTextures.push(PIXI.Texture.fromFrame("mushroom_0" + (i+1) + ".png"));
	}

	// -------------------------------------------------------------------------------------------

	// create a new character
	this.createCharacter = function(stage, type, isMine){

		var character = new Character();
		switch(type){
			case CHARACTERTYPE.PUMPKIN:
				character.init(stage, pumpkinStopTextures, pumpkinWalkTextures, pumpkinJumpTextures, pumpkinDieTextures, pumpkinHurtTextures);
				break;
			case CHARACTERTYPE.MUSHROOM:
				character.init(stage, mushroomWalkTextures, mushroomWalkTextures, mushroomWalkTextures, mushroomWalkTextures, mushroomWalkTextures);
				break;
			case CHARACTERTYPE.HUMAN:
				character.init(stage, humanWalkTextures, humanWalkTextures, humanWalkTextures, humanWalkTextures, humanWalkTextures);
				break;
			case CHARACTERTYPE.DEVIL:
				character.init(stage, devilWalkTextures, devilWalkTextures, devilWalkTextures, devilWalkTextures, devilWalkTextures);
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
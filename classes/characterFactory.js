"use strict";

function CharacterFactory(){

	// PUMPKIN -----------------------------------------------------------------------------------

	if(!ISSERVER){
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
		 	pumpkinDieTextures.push(PIXI.Texture.fromFrame("pumpkinmanDie_0" + (i+1) + ".png"));
		pumpkinDieTextures.push(PIXI.Texture.fromFrame("pumpkinmanDie_10.png"));
	}

	// -------------------------------------------------------------------------------------------

	// create a new character
	this.createCharacter = function(stage, type, isMine){

		switch(type){
			case CHARACTERTYPE.PUMPKIN:
				var character = new Character();
				character.init(stage, pumpkinStopTextures, pumpkinWalkTextures, pumpkinJumpTextures, pumpkinDieTextures);
				character.initDetectors();
				character.setIsMine(isMine);
				break;
		}

		return character;

	};

}

// For node.js require
if(typeof window == 'undefined')
	global.CharacterFactory = CharacterFactory;
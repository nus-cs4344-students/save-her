"use strict;"

var session;

var ownCharacter;		// own player's character
var characters = [];	// other players' character

var myBulletManager;	// bullet manager
var mapRects = [];		// collision rectangles for map

function Game(sessionID){
	
	//need to send sessionID everytime send messages to server so that
	//the updates get to the correct game session
	session = sessionID;

	// initialise sounds and music
	//initSounds();
	//playSound(gameMusic, true);
	
	// load all art assets
	var assetsToLoader = [ "PIXI/SpriteSheet.json", "PIXI/SpriteSheet2.json", "PIXI/PixelFont.fnt"];
	loader = new PIXI.AssetLoader(assetsToLoader);
	loader.onComplete = start;
	loader.load();

	// set the stage and renderer
	var stage = new PIXI.Stage(0x000000);
	renderer = PIXI.autoDetectRenderer(800, 600);
	document.body.appendChild(renderer.view);

	var that = this;

	// complete loading of assets
	function start()
	{
		// initialise background camera
		var backGUI = new PIXI.DisplayObjectContainer();
		stage.addChild(backGUI);

		initGameGUI(stage);

		// initialise game camera
		var camera = new PIXI.DisplayObjectContainer();
		stage.addChild(camera);

		// start animating
		requestAnimFrame( animate );

		// start updating
		setInterval(update, FRAMEDURATION);

		// render backdrop
		var moonTexture = PIXI.Texture.fromImage("moon.png");
		var moon = new PIXI.Sprite(moonTexture);
		moon.position.x = 300;
		moon.position.y = 0;
		moon.width = moon.width*2;
		moon.height = moon.height*2;
		backGUI.addChild(moon);

		for(var i=0; i<2; i++){
			var graveTexture = PIXI.Texture.fromImage("grave.png");
			var grave = new PIXI.Sprite(graveTexture);
			grave.position.x = i*graveTexture.width*2;
			grave.position.y = 0;
			grave.width = grave.width*2;
			grave.height = grave.height*2;
			backGUI.addChild(grave);
		}

		// generate map
		var tileTexture = PIXI.Texture.fromImage("tile.png");
		for(var i=0; i<map.length; i++){

			var prev = 0;
			var prevRect;

			for(var j=0; j<map[i].length; j++){
				if(map[i][j] == 1){
					
					var tile = new PIXI.Sprite(tileTexture);
					tile.position.x = j*TILEWIDTH;
					tile.position.y = i*TILEHEIGHT;
					tile.width = TILEWIDTH+1;
					tile.height = TILEHEIGHT;
					camera.addChild(tile);

					if(prev == 1)
						prevRect.addWidth(TILEWIDTH);		// 'merge' tiles next to each other
					else{
						prevRect = new Rectangle(camera, j*TILEWIDTH, i*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
						mapRects.push(prevRect);
					}
				}
				prev = map[i][j];
			}

		}

		// create OWN character
		// @PRISCILLA - this is where your own character is created
		var characterFac = new CharacterFactory();
		ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.PUMPKIN, true);
		myBulletManager = new bulletManager(camera, ownCharacter);
		
		// set camera to player
		camera.position.x = ownCharacter.getSprite().position.x + 200;
		camera.position.y = ownCharacter.getSprite().position.y + 100;

		// networking
		socket = new SockJS("http://localhost:4000/game");	// set as global variable in constants.js
		socket.onopen = function() {
			socketReady = true;
		}

		// on receiving a message from server
		socket.onmessage = function(e){
			console.log("from Server : " + e.data);

			var message = JSON.parse(e.data);

			switch (message.type) {

				// @PRISCILLA - a message with newPlayer type is sent
				// to clients to create the player in the game
				// characterType indicates type of character
				// playerID corresponds to the socket id of the player
				case "newPlayer":
					characters[message.playerID] = characterFac.createCharacter(camera, message.characterType, false);
					addPlayerGUI(stage);
					break;

				// update position
				case "pos": case "posForce":
					characters[message.playerID].interpolateTo(message.x, message.y);
					break;

				// do a jump
				case "jump":
					characters[message.playerID].jump();
					break;

				// change velocity in horizontal component
				case "speedX":
					characters[message.playerID].setSpeedX(message.x);
			}

		}
	}
	
	// render loop
	function animate() {
		requestAnimFrame( animate );
		renderer.render(stage);
	}

	// game loop
	function update() {
		
		// update characters
		if(ownCharacter != null){
			// update character
			ownCharacter.update();
			
			// update bullets
			myBulletManager.update();

			// update UI
			gameGUIUpdate();
		}

		// update all other characters
		var playerID;
		for(playerID in characters)
			characters[playerID].update();
	}

}

var application = new Game();
application.start();


// For node.js require
global.Game = Game;
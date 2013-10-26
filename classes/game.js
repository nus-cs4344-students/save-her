"use strict;"

var session;
var port;
var player_char;
var ownCharacter;		// own player's character
var characters = [];	// other players' character

var ownBulletManager;	// bullet manager
var ownSkillManager;
var bulletManagers = [];
var skillManagers = [];
var mapRects;		// collision rectangles for map

var camera;
var cameraBack;

var mapType;	// 0:graveyard, 1:pixel, 2:happy

function Game(s,m,c,p){
	
	session = s;
	player_char = c;
	mapType = m;
	port = p;
	
	// initialise sounds and music
	//initSounds();

	// load all art assets
	var assetsToLoader = [ "PIXI/SpriteSheet2.json", "PIXI/PixelFont.fnt"];
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
		cameraBack = new PIXI.DisplayObjectContainer();
		stage.addChild(cameraBack);
		camera = new PIXI.DisplayObjectContainer();
		stage.addChild(camera);

		// initialise FX
		initFX(camera);

		// initialise mobile controls (retrieved from Pong)
       	window.addEventListener("devicemotion", function(e) {
            onDeviceMotion(e);
        }, false);
        window.ondevicemotion = function(e) {
            onDeviceMotion(e);
        }

		// start animating
		requestAnimFrame( animate );

		// start updating
		setInterval(update, FRAMEDURATION);

		var tileTexture;
		var tileTopTexture;
		var tileBottomTexture;

		// render backdrop
		switch(mapType){

			// graveyard level
			case 0:
				playSound(gameMusic, true);

				var moonTexture = PIXI.Texture.fromImage("moon.png");
				var moon = new PIXI.Sprite(moonTexture);
				moon.position.x = 300;
				moon.position.y = 150;
				moon.width = moon.width*2;
				moon.height = moon.height*2;
				backGUI.addChild(moon);

				for(var i=0; i<2; i++){
					var graveTexture = PIXI.Texture.fromImage("grave.png");
					var grave = new PIXI.Sprite(graveTexture);
					grave.position.x = i*graveTexture.width*2;
					grave.position.y = 150;
					grave.width = grave.width*2;
					grave.height = grave.height*2;
					cameraBack.addChild(grave);
				}

				tileTexture = PIXI.Texture.fromImage("graveyardTile.png");
				tileTopTexture = PIXI.Texture.fromImage("graveyardTileTop.png");
				tileBottomTexture = PIXI.Texture.fromImage("graveyardTileInner.png");
				break;

			// pixel level
			case 1:
				playSound(gameMusic3, true);

				var gradientTexture = PIXI.Texture.fromImage("pixelGradient.png");
				var gradient = new PIXI.Sprite(gradientTexture);
				gradient.position.x = -50;
				gradient.position.y = 0;
				gradient.width = gradient.width*2;
				gradient.height = gradient.height*2;
				cameraBack.addChild(gradient);

				var pixelbackTexture = PIXI.Texture.fromImage("pixelbackdrop.png");
				var pixelback = new PIXI.Sprite(pixelbackTexture);
				pixelback.position.x = -50;
				pixelback.position.y = 0;
				pixelback.width = pixelback.width*2;
				pixelback.height = pixelback.height*2;
				pixelback.alpha = 0.6;
				cameraBack.addChild(pixelback);

				tileTexture = PIXI.Texture.fromImage("pixelTile.png");
				tileTopTexture = PIXI.Texture.fromImage("pixelTileTop.png");
				tileBottomTexture = PIXI.Texture.fromImage("pixelTileInner.png");
				break;

			// happy level
			case 2:
				playSound(gameMusic2, true);

				var hellobackTexture = PIXI.Texture.fromImage("helloBackdrop.png");
				var helloback = new PIXI.Sprite(hellobackTexture);
				helloback.position.x = -50;
				helloback.position.y = 0;
				helloback.width = helloback.width*2;
				helloback.height = helloback.height*2;
				cameraBack.addChild(helloback);

				var seaTexture = PIXI.Texture.fromImage("sea.png");
				var sea = new PIXI.Sprite(seaTexture);
				sea.position.x = -50;
				sea.position.y = 500;
				sea.width = sea.width*2;
				sea.height = sea.height*2;
				cameraBack.addChild(sea);

				tileTexture = PIXI.Texture.fromImage("helloTile.png");
				tileTopTexture = PIXI.Texture.fromImage("helloTileTop.png");
				tileBottomTexture = PIXI.Texture.fromImage("helloTileInner.png");
				break;
		}

		// generate map
		mapRects = createArray(map.length, map[0].length);
		var her; var herBubble; var herPositionX; var herPositionY;
		var rect;

		for(var i=0; i<map.length; i++){
			for(var j=0; j<map[i].length; j++){
				
				switch(map[i][j]){

					case 1:
						var tile = new PIXI.Sprite(tileTexture);
						tile.position.x = j*TILEWIDTH;
						tile.position.y = i*TILEHEIGHT;
						tile.width = TILEWIDTH+1;
						tile.height = TILEHEIGHT;
						camera.addChild(tile);

						rect = new Rectangle(camera, j*TILEWIDTH, i*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
						mapRects[i][j] = rect;

						var tileTop = new PIXI.Sprite(tileTopTexture);
						tileTop.position.x = j*TILEWIDTH;
						tileTop.position.y = i*TILEHEIGHT-TILEHEIGHT+1;
						tileTop.width = TILEWIDTH+1;
						tileTop.height = TILEHEIGHT;
						camera.addChild(tileTop);
						break;

					case 2:
						var tile = new PIXI.Sprite(tileBottomTexture);
						tile.position.x = j*TILEWIDTH;
						tile.position.y = i*TILEHEIGHT-1;
						tile.width = TILEWIDTH+1;
						tile.height = TILEHEIGHT+1;
						camera.addChild(tile);

						rect = new Rectangle(camera, j*TILEWIDTH, i*TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
						mapRects[i][j] = rect;
						break;

					case 3:
						herPositionX = j*TILEHEIGHT;
						herPositionY = i*TILEHEIGHT;
						var herBubble = new PIXI.Sprite(PIXI.Texture.fromFrame("savemebubble.png"));
						herBubble.position.x = j*TILEWIDTH + 40;
						herBubble.position.y = i*TILEHEIGHT + 8;
						herBubble.width *=2;
						herBubble.height *=2;

						setInterval(function(){
							herBubble.visible = !herBubble.visible;
						}, 2000);

						break;
				}
			}
		}

		// create OWN character
		// character is created based on player's selection
		var characterFac = new CharacterFactory();
		var herTextures = [];
		switch(player_char){
			case "pompkin":
				for(var k=0; k<4; k++)
					herTextures.push(PIXI.Texture.fromFrame("herPumpkin000" + k + ".png"));
				her = new PIXI.MovieClip(herTextures);
				camera.addChild(her);
				camera.addChild(herBubble);
				ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.PUMPKIN, true);
				player_char = CHARACTERTYPE.PUMPKIN;
				break;
			case "shroom":
				for(var k=0; k<4; k++)
					herTextures.push(PIXI.Texture.fromFrame("herMushroom000" + k + ".png"));
				her = new PIXI.MovieClip(herTextures);
				camera.addChild(her);
				camera.addChild(herBubble);
				ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.MUSHROOM, true);
				player_char = CHARACTERTYPE.MUSHROOM;
				break;
			case "human":
				for(var k=0; k<4; k++)
					herTextures.push(PIXI.Texture.fromFrame("herHumanStop000" + k + ".png"));
				her = new PIXI.MovieClip(herTextures);
				camera.addChild(her);
				camera.addChild(herBubble);
				ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.HUMAN, true);
				player_char = CHARACTERTYPE.HUMAN;
				break;
			case "devilz":
				for(var k=0; k<4; k++)
					herTextures.push(PIXI.Texture.fromFrame("herDevil000" + k + ".png"));
				her = new PIXI.MovieClip(herTextures);
				camera.addChild(her);
				camera.addChild(herBubble);
				ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.DEVIL, true);
				player_char = CHARACTERTYPE.DEVIL;
				break;
		}

		// initialise her
		her.position.x = herPositionX;
		her.position.y = herPositionY;
		her.width = TILEWIDTH;
		her.height = TILEHEIGHT;
		her.animationSpeed = 0.1;
		her.play();

		// initialise bullet manager
		ownBulletManager = new BulletManager(camera, ownCharacter,true, false);
		ownSkillManager = new SkillManager(camera, ownCharacter, ownBulletManager, true, false);
		// set camera to player
		camera.position.x = ownCharacter.getSprite().position.x + 200;
		camera.position.y = ownCharacter.getSprite().position.y + 100;

		// networking		
		var url = "http://localhost:"+port+"/game"
		socket = new SockJS(url);	// set as global variable in constants.js
		
		socket.onopen = function() {
			console.log("socket to game server ready");
			socketReady = true;
			sendToServer({type:"newPlayer",characterType:player_char});
		}

		// on receiving a message from server
		socket.onmessage = function(e){
			//console.log("from Server : " + e.data);

			var message = JSON.parse(e.data);

			switch (message.type) {

				// @PRISCILLA - a message with newPlayer type is sent
				// to clients to create the player in the game
				// characterType indicates type of character
				// playerID corresponds to the socket id of the player
				case "newPlayer":
					characters[message.playerID] = characterFac.createCharacter(camera, message.characterType, false);
					bulletManagers[message.playerID] = new BulletManager(camera,characters[message.playerID],false, false);
                                        skillManagers[message.playerID] = new SkillManager(camera,characters[message.playerID],bulletManagers[message.playerID],false, false);
					addPlayerGUI(stage);
					break;

				// do a jump
				case "jump":
					characters[message.playerID].jump();
					break;

				// landed from a fall
				case "land":
					characters[message.playerID].startInterpolateX(message.PosX);
					characters[message.playerID].startInterpolateY(message.PosY);
					break;

				// fall when hovering over nothing
				case "fall":
					characters[message.playerID].setPosition(message.PosX, message.PosY);
					characters[message.playerID].fall();
					break;

				// change velocity in horizontal component
				case "speedX":
					if(!characters[message.playerID].isObsolete(message.Seq)){
						characters[message.playerID].setSpeedX(message.SpeedX);
						characters[message.playerID].startInterpolateX(message.PosX);
					}
					break;

				case "shoot":
					bulletManagers[message.playerID].setDir(message.dir);
					bulletManagers[message.playerID].shoot();
					break;

				case "hurt":
					if(typeof(characters[message.p2])!="undefined")
						characters[message.p2].hurt(message.dmg);
					else
						ownCharacter.hurt(message.dmg);
					break;

                case "mineHurt":
					if(typeof(characters[message.p1])=="undefined")
						ownSkillManager.removeMine(message.mineId);
					if(typeof(characters[message.p2])!="undefined")
						characters[message.p2].hurt(message.dmg);
					else
						ownCharacter.hurt(message.dmg);
					break;

				case "skill":
					skillManagers[message.playerID].skill();
					break;

				case "stun":
					if(typeof(characters[message.p2])!="undefined")
					{
                                            characters[message.p2].stun(message.time);
                                            bulletManagers[message.p2].stun(message.time);
                                            skillManagers[message.p2].stun(message.time);
                                        }
					else
					{
                                            ownCharacter.stun(message.time);
                                            ownSkillManager.stun(message.time);
                                            ownBulletManager.stun(message.time);
                                        }
					break;
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
			ownBulletManager.update(characters,null,null);
                        ownSkillManager.update(characters,null,null);
			// update UI
			gameGUIUpdate();
		}

		// update all other characters
		var playerID;
		for(playerID in characters)
		{
			characters[playerID].update();
			bulletManagers[playerID].update(characters,ownCharacter,playerID);
			skillManagers[playerID].update(characters,ownCharacter,playerID);
			//alert(playerID);
		}

		switch(mapType){
			case 0:
				cameraBack.position.x = camera.position.x/15;
				break;
			case 1:
				cameraBack.position.x = camera.position.x/10;
				break;
			case 2:
				cameraBack.position.x = camera.position.x/15;
				break;
		}
	}

	var prevVx = 0;
    var onDeviceMotion = function(e) {
        var vx = e.accelerationIncludingGravity.x;
        if (vx - prevVx > 0.1){
			tiltLeft = true;
        }

        if(prevVx - vx > 0.1) {
            tiltRight = true;
        }

        prevVx = vx;
    }

}

// For node.js require
global.Game = Game;
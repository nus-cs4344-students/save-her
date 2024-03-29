"use strict;"

var session;
var port;
var opponment = [];   //stores opponments Name
var opponmentID = []; //stores opponments ID
var killList = [];    // Array of "killers"
var player;
var ownCharacter;		// own player's character
var characters = [];	// other players' character

var ownBulletManager;	// bullet manager
var ownSkillManager;
var bulletManagers = [];
var skillManagers = [];
var pointer = [];
var mapRects;		// collision rectangles for map

var camera;
var cameraBack;

var mapType;	// 0:graveyard, 1:pixel, 2:happy
var isHost;     // game host - decides when game starts

function Game(pl, s, m, p, i) {

    player = pl;
    session = s;
    mapType = m;
    port = p;
    isHost = i;
    var pointerTexture;

    // load all art assets
    var assetsToLoader = ["PIXI/SpriteSheet2.json", "PIXI/PixelFont.fnt"];
    loader = new PIXI.AssetLoader(assetsToLoader);
    loader.onComplete = start;
    loader.load();

    // set the stage and renderer
    var stage = new PIXI.Stage(0x000000, true);
    renderer = PIXI.autoDetectRenderer(800, 600);
    document.body.appendChild(renderer.view);

    var that = this;

    // complete loading of assets
    function start()
    {
        // initialise background camera
        var backGUI = new PIXI.DisplayObjectContainer();
        stage.addChild(backGUI);

        // initialise game camera
        cameraBack = new PIXI.DisplayObjectContainer();
        stage.addChild(cameraBack);
        camera = new PIXI.DisplayObjectContainer();
        stage.addChild(camera);

        // initialise FX
        initFX(camera);

        // initialise mobile accelerometer controls (retrieved from Pong)
        window.addEventListener("devicemotion", function(e) {
            onDeviceMotion(e);
        }, false);
        window.ondevicemotion = function(e) {
            onDeviceMotion(e);
        }

        // start animating
        requestAnimFrame(animate);

        // start updating
        setInterval(update, FRAMEDURATION);

        var tileTexture;
        var tileTopTexture;
        var tileBottomTexture;

        //initialise GUI
        initGameGUI(stage);
        if (isHost)
            displayStartButton(stage, sendStartGameMessage);
        else
            displayWait(stage);

        // render backdrop
        switch (mapType) {

            // graveyard level
            case 0:
                Gamesound.playloop("W1");

                map = map0;

                var moonTexture = PIXI.Texture.fromImage("moon.png");
                var moon = new PIXI.Sprite(moonTexture);
                moon.position.x = 300;
                moon.position.y = 150;
                moon.width = moon.width * 2;
                moon.height = moon.height * 2;
                backGUI.addChild(moon);

                for (var i = 0; i < 2; i++) {
                    var graveTexture = PIXI.Texture.fromImage("grave.png");
                    var grave = new PIXI.Sprite(graveTexture);
                    grave.position.x = i * graveTexture.width * 2 - 100 - i;
                    grave.position.y = 150;
                    grave.width = grave.width * 2;
                    grave.height = grave.height * 2;
                    cameraBack.addChild(grave);
                }

                tileTexture = PIXI.Texture.fromImage("graveyardTile.png");
                tileTopTexture = PIXI.Texture.fromImage("graveyardTileTop.png");
                tileBottomTexture = PIXI.Texture.fromImage("graveyardTileInner.png");
                break;

                // pixel level
            case 1:
                Gamesound.playloop("W2");

                map = map1;

                var gradientTexture = PIXI.Texture.fromImage("pixelGradient.png");
                var gradient = new PIXI.Sprite(gradientTexture);
                gradient.position.x = -100;
                gradient.position.y = -100;
                gradient.width = gradient.width * 2.5;
                gradient.height = gradient.height * 2.5;
                cameraBack.addChild(gradient);

                var pixelbackTexture = PIXI.Texture.fromImage("pixelbackdrop.png");
                var pixelback = new PIXI.Sprite(pixelbackTexture);
                pixelback.position.x = -100;
                pixelback.position.y = -100;
                pixelback.width = pixelback.width * 2.5;
                pixelback.height = pixelback.height * 2.5;
                pixelback.alpha = 0.6;
                cameraBack.addChild(pixelback);

                tileTexture = PIXI.Texture.fromImage("pixelTile.png");
                tileTopTexture = PIXI.Texture.fromImage("pixelTileTop.png");
                tileBottomTexture = PIXI.Texture.fromImage("pixelTileInner.png");
                break;

                // happy level
            case 2:
                Gamesound.playloop("W3");

                map = map2;

                var hellobackTexture = PIXI.Texture.fromImage("helloBackdrop.png");
                var helloback = new PIXI.Sprite(hellobackTexture);
                helloback.position.x = -50;
                helloback.position.y = 0;
                helloback.width = helloback.width * 2.1;
                helloback.height = helloback.height * 2.1;
                cameraBack.addChild(helloback);

                var seaTexture = PIXI.Texture.fromImage("sea.png");
                var sea = new PIXI.Sprite(seaTexture);
                sea.position.x = -50;
                sea.position.y = 500;
                sea.width = sea.width * 2.2;
                sea.height = sea.height * 2.1;
                cameraBack.addChild(sea);

                tileTexture = PIXI.Texture.fromImage("helloTile.png");
                tileTopTexture = PIXI.Texture.fromImage("helloTileTop.png");
                tileBottomTexture = PIXI.Texture.fromImage("helloTileInner.png");
                break;
        }

        // generate map
        mapRects = createArray(map.length, map[0].length);
        var her;
        var herBubble;
        var herPositionX;
        var herPositionY;
        var rect;
        pointerTexture = PIXI.Texture.fromImage("AOE.png");
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {

                switch (map[i][j]) {

                    case 1:
                        var tile = new PIXI.Sprite(tileTexture);
                        tile.position.x = j * TILEWIDTH;
                        tile.position.y = i * TILEHEIGHT;
                        tile.width = TILEWIDTH + 1;
                        tile.height = TILEHEIGHT;
                        camera.addChild(tile);

                        rect = new Rectangle(camera, j * TILEWIDTH, i * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        mapRects[i][j] = rect;

                        var tileTop = new PIXI.Sprite(tileTopTexture);
                        tileTop.position.x = j * TILEWIDTH;
                        tileTop.position.y = i * TILEHEIGHT - TILEHEIGHT + 1;
                        tileTop.width = TILEWIDTH + 1;
                        tileTop.height = TILEHEIGHT;
                        camera.addChild(tileTop);
                        break;

                    case 2:
                        var tile = new PIXI.Sprite(tileBottomTexture);
                        tile.position.x = j * TILEWIDTH;
                        tile.position.y = i * TILEHEIGHT - 1;
                        tile.width = TILEWIDTH + 1;
                        tile.height = TILEHEIGHT + 1;
                        camera.addChild(tile);

                        rect = new Rectangle(camera, j * TILEWIDTH, i * TILEHEIGHT, TILEWIDTH, TILEHEIGHT);
                        mapRects[i][j] = rect;
                        break;

                    case 3:
                        herPositionX = j * TILEHEIGHT;
                        herPositionY = i * TILEHEIGHT;
                        var herBubble = new PIXI.Sprite(PIXI.Texture.fromFrame("savemebubble.png"));
                        herBubble.position.x = j * TILEWIDTH + 40;
                        herBubble.position.y = i * TILEHEIGHT + 8;
                        herBubble.width *= 2;
                        herBubble.height *= 2;

                        setInterval(function() {
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
        switch (player.character) {
            case CHARACTERTYPE.PUMPKIN:
                for (var k = 0; k < 4; k++)
                    herTextures.push(PIXI.Texture.fromFrame("herPumpkin000" + k + ".png"));
                her = new PIXI.MovieClip(herTextures);
                camera.addChild(her);
                camera.addChild(herBubble);
                ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.PUMPKIN, true);
                break;
            case CHARACTERTYPE.MUSHROOM:
                for (var k = 0; k < 4; k++)
                    herTextures.push(PIXI.Texture.fromFrame("herMushroom000" + k + ".png"));
                her = new PIXI.MovieClip(herTextures);
                camera.addChild(her);
                camera.addChild(herBubble);
                ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.MUSHROOM, true);
                break;
            case CHARACTERTYPE.HUMAN:
                for (var k = 0; k < 4; k++)
                    herTextures.push(PIXI.Texture.fromFrame("herHumanStop000" + k + ".png"));
                her = new PIXI.MovieClip(herTextures);
                camera.addChild(her);
                camera.addChild(herBubble);
                ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.HUMAN, true);
                break;
            case CHARACTERTYPE.DEVIL:
                for (var k = 0; k < 4; k++)
                    herTextures.push(PIXI.Texture.fromFrame("herDevil000" + k + ".png"));
                her = new PIXI.MovieClip(herTextures);
                camera.addChild(her);
                camera.addChild(herBubble);
                ownCharacter = characterFac.createCharacter(camera, CHARACTERTYPE.DEVIL, true);
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
        ownBulletManager = new BulletManager(camera, ownCharacter, true, false);
        ownSkillManager = new SkillManager(camera, ownCharacter, ownBulletManager, true, false);
        // set camera to player
        camera.position.x = ownCharacter.getSprite().position.x + 200;
        camera.position.y = ownCharacter.getSprite().position.y + 100;

        // networking		
        var url = "http://localhost:" + port + "/game";
        socket = new SockJS(url);	// set as global variable in constants.js

        socket.onopen = function() {
            console.log("socket to game server ready");
            socketReady = true;
            sendToServer({type: "newPlayer", player: player});
        }

        // on receiving a message from server
        socket.onmessage = function(e) {
            //console.log("from Server : " + e.data);

            var message = JSON.parse(e.data);

            switch (message.type) {

                // @PRISCILLA - a message with newPlayer type is sent
                // to clients to create the player in the game
                // characterType indicates type of character
                // playerID corresponds to the socket id of the player
                // @EVERYONE - pls note that playerID here is not the same
                // as the playerID that is mapped to the player upon login
                // so you cannot do something like playerManager.getPlayerName(playerID)
                // @ZIXIAN - you will receive messsage.player.name (opponent's name) in here
                // see what you wanna do with it..
                case "newPlayer":
                    //push opponment Name
                    opponment.push(message.player.name);
                    //push opponment Player ID
                    opponmentID.push(message.playerID);
                    characters[message.playerID] = characterFac.createCharacter(camera, message.player.character, false);
                    bulletManagers[message.playerID] = new BulletManager(camera, characters[message.playerID], false, false);
                    skillManagers[message.playerID] = new SkillManager(camera, characters[message.playerID], bulletManagers[message.playerID], false, false);
                    var pointerT = new PIXI.Sprite(pointerTexture);
                    pointerT.position.x = 1000;
                    pointerT.position.y = 1000;
                    pointerT.width = 15;
                    pointerT.height = 51;
                    pointer[message.playerID] = pointerT;
                    stage.addChild(pointer[message.playerID]);
                    addPlayerGUI(stage);
                    break;
				case "playerLeave":
					//cheat: just kill the player
					characters[socket.id].HP = -1;
					characters[socket.id].lives = -1;
					break;
                    // the host of the game starts it
                case "hostStartGame":
                    for (var id in characters) {
                        bulletManagers[id].startOperation();
                        skillManagers[id].startOperation();
                        console.log(id);
                    }
                    ownBulletManager.startOperation();
                    ownSkillManager.startOperation();
                    concludeStartMessages(stage);
                    break;

                    // do a jump
                case "jump":
                    characters[message.playerID].jump();
                    break;

                    // force pos at start / landed from a fall
                case "forcePlayerPos":
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
                    if (!characters[message.playerID].isObsolete(message.Seq)) {
                        characters[message.playerID].setSpeedX(message.SpeedX);
                        characters[message.playerID].startInterpolateX(message.PosX);
                        characters[message.playerID].setFaceRight(message.FaceR);
                    }
                    break;

                case "shoot":
                    bulletManagers[message.playerID].setDir(message.dir);
                    bulletManagers[message.playerID].shoot();
                    break;

                case "hurt":
                    if (typeof(characters[message.p2]) != "undefined")
                    {
                        characters[message.p2].hurt(message.dmg);
                        characters[message.p2].HP = message.hpLeft;
                    }
                    else
                    {
                        ownCharacter.hurt(message.dmg);
                        ownCharacter.HP = message.hpLeft;
                    }
                    break;

                case "mineHurt":
                    if (typeof(characters[message.p1]) == "undefined")
                    {
                        ownSkillManager.removeMine(message.mineId);
                    }
                    else
                    {
                        skillManagers[message.p1].removeMine(message.mineId);
                    }
                    if (typeof(characters[message.p2]) != "undefined") {
                        var currPlayer = characters[message.p2];
                        createExplosionFX(currPlayer.getPosX(), currPlayer.getPosY())
                        currPlayer.hurt(message.dmg);
                        currPlayer.HP = message.hpLeft;
                    } else {
                        createExplosionFX(ownCharacter.getPosX(), ownCharacter.getPosY())
                        ownCharacter.hurt(message.dmg);
                        ownCharacter.HP = message.hpLeft;
                    }
                    break;

                case "skill":
                    //console.log(message);
                    if (characters[message.playerID].characterType == CHARACTERTYPE.PUMPKIN)
                    {
                        skillManagers[message.playerID].skillMineRemote(message.x, message.y);
                    }
                    else
                    {
                        skillManagers[message.playerID].skill();
                    }
                    break;
                case "kill":
                    //@zixian
                    //Push the list of killers
                    killList.push(message.p1);
                    //p1 killed p2.(ID)
                    //console.log("opp: " + opponmentID[0]);
                    //console.log("killist1: " + killList[0]);
                    //console.log("killist2: " + killList[1]);
                    //console.log("killer = " + message.p1);
                    //console.log(message.p1 + " killed  " + message.p2);
                    break;
                case "stun":
                    if (typeof(characters[message.p2]) != "undefined")
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
                case "interestUpdate":
                    //console.log(message);
                    characters[message.playerID].setPosition(message.x, message.y);
                    break;
            }

        }
    }

    function sendStartGameMessage() {
        sendToServer({type: "hostStartGame"});
    }
    function updatePointer(id) {
        //console.log(pointer[id].position.x+"  "+pointer[id].position.y);

        var x1 = ownCharacter.getPosX();
        var y1 = ownCharacter.getPosY();
        var x2 = characters[id].getPosX();
        var y2 = characters[id].getPosY();
        var xt = Math.abs(x1 - x2);
        var yt = Math.abs(y1 - y2);
        var x;
        var y;
        //console.log(xt + "  " + yt);
        if ((xt < 800 && yt < 600) && !(xt < 400 && yt < 300))
        {
            if (xt / yt > 4 / 3)
            {
                if (x2 < x1)
                {
                    x = 0;
                }
                else
                {
                    x = 780;
                    //console.log(x1+" "+y1+" "+x2+" "+y2)
                }
                y = (y2 - y1) * 400 / xt+300;
            }
            else
            {
                if (y2 < y1)
                {
                    y = 0;
                }
                else
                {
                    y = 550;
                }
                x = (x2 - x1) * 300 / yt+400;
            }
            pointer[id].position.x = x;
            pointer[id].position.y = y;
        }
        else
        {
            if (pointer[id].position.x != 1000)
            {
                pointer[id].position.x = 1000;
            }
        }
    }
    // render loop
    function animate() {
        requestAnimFrame(animate);
        renderer.render(stage);
    }

    // game loop
    var lastUpdate = Date.now();
    var firstUpdate = true;
    function update() {

        if (firstUpdate) {
            lastUpdate = Date.now();
            firstUpdate = false;
        }

        var now = Date.now();
        deltaTime = (now - lastUpdate) / (FRAMEDURATION);
        lastUpdate = now;
        // update characters
        if (ownCharacter != null) {
            // update character
            ownCharacter.update();

            // update bullets
            ownBulletManager.update(characters, null, null);
            ownSkillManager.update(characters, null, null);
            // update UI
            gameGUIUpdate();
        }

        // update all other characters
        var playerID;
        for (playerID in characters)
        {
            characters[playerID].update();
            updatePointer(playerID);
            //console.log(playerID);
            bulletManagers[playerID].update(characters, ownCharacter, playerID);
            skillManagers[playerID].update(characters, ownCharacter, playerID);
            //alert(playerID);
        }

        switch (mapType) {
            case 0:
                cameraBack.position.x = camera.position.x / 15;
                break;
            case 1:
                cameraBack.position.x = camera.position.x / 10;
                break;
            case 2:
                cameraBack.position.x = camera.position.x / 15;
                break;
        }

    }


    var onDeviceMotion = function(e) {
        var vy = e.accelerationIncludingGravity.y * 5;
        if (vy > 14) {
            tiltRight = true;
        }

        else if (vy < -14) {
            tiltLeft = true;
        }
        else
        {
            tiltLeft = false;
            tiltRight = false;
        }

    }

}

// For node.js require
global.Game = Game;
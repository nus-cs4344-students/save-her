"use strict";

var stage;
var firingFX;
var bulletExplodeFX = [];
var hurtFX;
var explosionFX = [];
var stunnedFX = [];

function initFX(stageArg){
	stage = stageArg;

	firingFX = PIXI.Texture.fromImage("firelight.png");

	for (var i=0; i < 5; i++)
		bulletExplodeFX.push(PIXI.Texture.fromFrame("bulletExplode" + (i+1) + ".png"));

	hurtFX = PIXI.Texture.fromImage("hitFX.png");

    for (var i=0; i < 6; i++)
        explosionFX.push(PIXI.Texture.fromFrame("explosion" + (i+1) + ".png"));

    for (var i=0; i < 6; i++)
        stunnedFX.push(PIXI.Texture.fromFrame("gotStunned_0" + (i) + ".png"));
}

function createFiringFX(x, y, faceLeft){
    Gamesound.play("bulletSound");
    var sprite = new PIXI.Sprite(firingFX);
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    if(faceLeft)
    	sprite.position.x = x + 5;
    else
    	sprite.position.x = x - 5;
    sprite.position.y = y - 30;

    if(faceLeft) sprite.scale.x *= -1;
    stage.addChild(sprite);

    setTimeout(function(){
		stage.removeChild(sprite);	// not sure if this will release the memory
	}, 40);
};

function createBulletExplodeFX(x, y){
    var sprite = new PIXI.MovieClip(bulletExplodeFX);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    sprite.position.x = x;
    sprite.position.y = y;

    sprite.animationSpeed = 0.9;
    sprite.loop = false;

    stage.addChild(sprite);
    sprite.gotoAndPlay(0);
    sprite.onComplete = function(){
    	stage.removeChild(sprite);	// this is causing error in log, but seems to be no solution
    								// https://github.com/GoodBoyDigital/pixi.js/issues/235
    };
};

function createHurtFX(x, y){
    Gamesound.play("bulletHit");
    var sprite = new PIXI.Sprite(hurtFX);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position.x = x;
    sprite.position.y = y;
    stage.addChild(sprite);

    var size = 2;
    var enlarge = setInterval(function(){
    	sprite.scale.x = size;
    	sprite.scale.y = size;
    	if(size >= 3){
    		stage.removeChild(sprite);
    		clearInterval(enlarge);
    	} else {
    		size += 0.3;
    	}
    }, 10);

    setTimeout(function(){
		stage.removeChild(sprite);	// not sure if this will release the memory
	}, 1000);
};

function createExplosionFX(x, y){
    Gamesound.play("explode");
    var sprite = new PIXI.MovieClip(explosionFX);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    sprite.position.x = x;
    sprite.position.y = y;

    sprite.animationSpeed = 0.9;
    sprite.loop = false;

    stage.addChild(sprite);
    sprite.gotoAndPlay(0);
    sprite.onComplete = function(){
        stage.removeChild(sprite);  // this is causing error in log, but seems to be no solution
                                    // https://github.com/GoodBoyDigital/pixi.js/issues/235
    };
};

function createStunnedFX(x, y){
    var sprite = new PIXI.MovieClip(stunnedFX);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    sprite.position.x = x + Math.random()*30 - 15;
    sprite.position.y = y + Math.random()*30 - 5;

    sprite.animationSpeed = 0.8;
    sprite.loop = false;

    stage.addChild(sprite);
    sprite.gotoAndPlay(0);
    sprite.onComplete = function(){
        stage.removeChild(sprite);  // this is causing error in log, but seems to be no solution
                                    // https://github.com/GoodBoyDigital/pixi.js/issues/235
    };
};
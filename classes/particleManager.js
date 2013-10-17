"use strict";

var stage;
var firingFX;
var bulletExplodeFX = [];
var hurtFX;

function initFX(stageArg){
	stage = stageArg;

	firingFX = PIXI.Texture.fromImage("firelight.png");

	for (var i=0; i < 5; i++)
		 	bulletExplodeFX.push(PIXI.Texture.fromFrame("bulletExplode" + (i+1) + ".png"));

	hurtFX = PIXI.Texture.fromImage("hitFX.png");
}

function createFiringFX(x, y, faceLeft){
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

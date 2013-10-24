"use strict";

function Character(){

	// statistics
	this.maxHP = 100;
	this.maxLives = 5;
	this.HP = this.maxHP;
	this.lives = this.maxLives;
	this.characterType;

	// private attributes
	var that = this;

	// this character belongs to this client
	var isMine = true;

	// sequence number for labelling xSpeed packets (each character has its own)
	var speedXSeqNo = 0;

	// for display (client only)
	var stage = stage;
	var spriteMovieClip;
	var stopTextures;
	var walkTextures;
	var jumpTextures;
	var dieTextures;
	var hurtTextures;

	var wallDetector;	// detect walls to block
	var floorDetector;	// detect floors to land
	var hoverDetector;	// detect if it is floating (must fall down)
	var headDetector;	// detect if head is colliding with a tile
	var bodyDetector;	// detect if bullets hit

	var posX = 100;
	var posY = 100;
	var lastposX = 0;	// last sent position
	var lastpoxY = 0;
	var speedX = 0;
	var speedY = 0;

	var faceRight = true;	// whether character is facing right

	// other players only, interpolating gradually based on difference
	var interpolateValidityX = 0;	// how many more frames to interpolate
	var interpolateAmtX = 0;		// amount to interpolate for each frame
	var interpolateValidityY = 0;
	var interpolateAmtY = 0;
	var minHeight = 99999;

	var inAir = false;
	var isDead = false;
	var stopInput = false;

	// client only - initialise all objects for render
	this.init = function(stageArg, stopTexturesArg, walkTexturesArg, jumpTexturesArg, dieTexturesArg, hurtTexturesArg, typeArg){
		if(!ISSERVER){
			stage = stageArg;
			stopTextures = stopTexturesArg;
			walkTextures = walkTexturesArg;
			jumpTextures = jumpTexturesArg;
			dieTextures = dieTexturesArg;
			hurtTextures = hurtTexturesArg;

			spriteMovieClip = new PIXI.MovieClip(stopTextures);
			spriteMovieClip.scale.x = spriteMovieClip.scale.y = 2;
			spriteMovieClip.position.x = posX;
			if(typeArg == CHARACTERTYPE.DEVIL)
				spriteMovieClip.position.y = posY + 32 + 5;
			else
				spriteMovieClip.position.y = posY + 32;
			spriteMovieClip.anchor.x = 0.5;
			spriteMovieClip.anchor.y = 1.0;
			setAnimation("Walk");
			spriteMovieClip.play();
			stage.addChild(spriteMovieClip);
		}

		that.characterType = typeArg;
	}

	this.initDetectors = function(){
		wallDetector = new Rectangle(stage, posX-32+16, posY-32 + 15, 64-2*16, TILEHEIGHT - 2*15);
		floorDetector = new Rectangle(stage, posX-32+25, posY-32+8, 64-2*25, TILEHEIGHT-8);
		hoverDetector = new Rectangle(stage, posX-32+25, posY+32, 64-2*25, 3);
		headDetector = new Rectangle(stage, posX-32+25, posY-32+5, 64-2*25, 3);
		bodyDetector = new Rectangle(stage, posX-32+16, posY-32+5, 64/2, 64);
	}

	this.setIsMine = function(isMe){
		isMine = isMe;
	}

	var firstUpdate = true;
	this.update = function(){

		var updateServer = horizontalMovementUpdate();
		verticalMovementUpdate();

		if(updateServer){
			// send input change to server
			if(!ISSERVER && isMine){
				speedXSeqNo++;
				sendToServer({type:"speedX", SpeedX: remoteSpeedX, PosX: posX, Seq: speedXSeqNo});
				console.log({type:"speedX", SpeedX: remoteSpeedX, PosX: posX, Seq: speedXSeqNo});
			}
		}

		if(!isMine) interpolateUpdate();

		move(speedX, speedY);

		// debug
		if(!ISSERVER && isMine){
			var keys = KeyboardJS.activeKeys();
			if(containsArray(keys, 'h'))
				that.hurt(20);
			if(containsArray(keys, 'd'))
				die();
		}

		// initialise initial position
		if(firstUpdate){
			that.setPosition(225,415);
			firstUpdate = false;
		}
	}

	// move and check for collision
	var move = function(deltaX, deltaY){

		// horizontal component
		if(deltaX != 0) {
			moveBlindlyX(deltaX);
			for(var i=0; i<mapRects.length; i++){
				while(wallDetector.isIntersecting(mapRects[i])){	// colliding, push
					if(deltaX > 0)
						moveBlindlyX(-1);
					else
						moveBlindlyX(1);
				}
			}

			if(!ISSERVER && !inAir){
				if(deltaX > 0){
					spriteMovieClip.scale.x = 2;
					faceRight = true;
				}else{
					spriteMovieClip.scale.x = -2;
					faceRight = false;
				}
			}
		}

		// vertical component
		if(deltaY != 0) {
			moveBlindlyY(deltaY);

			if(deltaY < 0){
				for(var i=0; i<mapRects.length; i++){
					while(headDetector.isIntersecting(mapRects[i])){	// colliding, push
						moveBlindlyY(1);
						speedY = 0;	
					}
				}
			} else {

				for(var i=0; i<mapRects.length; i++){

					var landed = false;

					while(floorDetector.isIntersecting(mapRects[i])){
						moveBlindlyY(-1); // colliding, push
						landed = true;
					}

					if(landed)
						that.land();
				}

			}
		}

		if(!ISSERVER)
			setAnimationBasedOnSpeed(deltaX);
	}

	// use resulting movement to determine animation to play
	var setAnimationBasedOnSpeed = function(deltaX){
            if(!ISSERVER){
		if(!inAir){
			if(deltaX == 0)
				setAnimation("Stop");
			else
				setAnimation("Walk");
		} else {
			setAnimation("Jump");
		}
            }
	}

	var uninterruptedAnimation = false;
	var setAnimation = function(animName){

		if(uninterruptedAnimation)
			return;

		switch(animName){
			case "Walk":
				spriteMovieClip.textures = walkTextures;
				spriteMovieClip.animationSpeed = 0.5;
				break;

			case "Stop":
				spriteMovieClip.textures = stopTextures;
				spriteMovieClip.animationSpeed = 0.1;
				break;

			case "Jump":
				spriteMovieClip.textures = jumpTextures;
				break;

			case "Die":
				spriteMovieClip.textures = dieTextures;
				spriteMovieClip.animationSpeed = 0.7;
				break;

			case "Hurt":
				spriteMovieClip.textures = hurtTextures;
				spriteMovieClip.animationSpeed = 0.5;
				spriteMovieClip.onComplete = uninterruptedAnimationResume;
				break;
		}

		// animations that cannot be interrupted by other animations
		if(animName == "Die" || animName == "Hurt"){
			spriteMovieClip.loop = false;
			spriteMovieClip.gotoAndPlay (0);
			uninterruptedAnimation = true;
		}

	}

	var uninterruptedAnimationResume = function(){
		uninterruptedAnimation = false;
		spriteMovieClip.loop = true;
		spriteMovieClip.play();
		spriteMovieClip.onComplete = null;
	}

	// simply move horizontally, check should be done in move function
	var moveBlindlyX = function(deltaX){
		if(!ISSERVER) spriteMovieClip.position.x += deltaX;
		if(isMine) stage.position.x -= deltaX;
		posX += deltaX;
		wallDetector.moveX(deltaX);
		floorDetector.moveX(deltaX);
		hoverDetector.moveX(deltaX);
		headDetector.moveX(deltaX);
		bodyDetector.moveX(deltaX);
	}

	// move instantly to x
	var teleportToX = function(x){
		var deltaX = x - posX;
		moveBlindlyX(deltaX);
	}

	// simply move vertically, check should be done in move function
	var moveBlindlyY = function(deltaY){
		if(!ISSERVER) spriteMovieClip.position.y += deltaY;
		if(isMine) stage.position.y -= deltaY;
		posY += deltaY;
		wallDetector.moveY(deltaY);
		floorDetector.moveY(deltaY);
		hoverDetector.moveY(deltaY);
		headDetector.moveY(deltaY);
		bodyDetector.moveY(deltaY);
	}

	// move instantly to y
	var teleportToY = function(y){
		var deltaY = y - posY;
		moveBlindlyY(deltaY);
	}

	// returns true if player changes arrow keys
	// means has to send to server the new input
	var holdingKey = [];
	var remoteSpeedX = 0;
	var horizontalMovementUpdate = function(){
		if(!ISSERVER && isMine && !stopInput){
			var keys = KeyboardJS.activeKeys();

			var leftDown, rightDown;

			// keyboard controls
			for(var i=0; i<keys.length; i++){
				switch(keys[i]){
					case 'left':
						leftDown = true;
						break;
					case 'right':
						rightDown = true;
						break;
				}
			}

			// accelerometer controls
			if(tiltRight) rightDown = true;
			if(tiltLeft) leftDown = true;
			tiltLeft = false;
			tiltRight = false;
			
			var inputChanged = false;
			remoteSpeedX = 0;

			// just pressed left
			if(leftDown && !holdingKey['left']){
				holdingKey['left'] = true;
				inputChanged = true;
			}

			// released left
			if(!leftDown && holdingKey['left']){
				holdingKey['left'] = false;
				inputChanged = true;
			}

			// just pressed right
			if(rightDown && !holdingKey['right']){
				holdingKey['right'] = true;
				inputChanged = true;
			}

			// released left
			if(!rightDown && holdingKey['right']){
				holdingKey['right'] = false;
				inputChanged = true;
			}

			// update XSpeed (note that there is no acceleration for remote side)
			if(holdingKey['right']){
				remoteSpeedX = CHARACTERMOVEMENTSPEED;
				speedX = Math.min(speedX + 2, CHARACTERMOVEMENTSPEED);
			}
			else if(holdingKey['left']){
				remoteSpeedX = -CHARACTERMOVEMENTSPEED;
				speedX = Math.max(speedX - 2 , -CHARACTERMOVEMENTSPEED);
			}
			else{
				remoteSpeedX = 0;
				speedX = 0;
			}

			return inputChanged;
		}

		return false;
	}

	var gravityCounter = 0;
	var verticalMovementUpdate = function(){

		// already jumping
		if(inAir){
			if(gravityCounter++ % CHARACTERJUMPGRAVITATIONALPULL == 0)
				setSpeedY(speedY + 1);
			return;
		}

		// remote cannot fall until told to do so
		if(isMine){

			// check if it is not floating in thin air
			var goingToFall = true;
			for(var i=0; i<mapRects.length; i++){
				if(hoverDetector.isIntersecting(mapRects[i])){
					goingToFall = false;
					break;
				}
			}
			if(goingToFall){
				that.fall();
				return;
			}

		}

		if(!ISSERVER && isMine && !stopInput){
			// check if going to jump
			var keys = KeyboardJS.activeKeys();
			if(containsArray(keys, 'space'))	// player wants to jump!
				that.jump();
			
		}
	}

	this.jump = function(){

		if(!ISSERVER && isMine){
			var shrink = setInterval(function(){
				spriteMovieClip.scale.y -= 0.03;
			}, 10);

			setTimeout(function(){
				spriteMovieClip.scale.y = 2;
				inAir = true;
				setSpeedY(-CHARACTERJUMPSPEED);
				gravityCounter = 0;
				clearInterval(shrink);
			}, 100);
		} else {
			inAir = true;
			setSpeedY(-CHARACTERJUMPSPEED);
			gravityCounter = 0;
		}

		// send jump command to server
		if(!ISSERVER && isMine){
			playSound(jumpSound, false);
			sendToServer({type:"jump"});
			console.log({type:"jump"});
		}
	}

	this.land = function(){
		inAir = false;
		setSpeedY(0);
		gravityCounter = 0;

		if(!ISSERVER){
			var shrink = setInterval(function(){
				spriteMovieClip.scale.y -= 0.05;
			}, 10);

			setTimeout(function(){
				spriteMovieClip.scale.y = 2;
				clearInterval(shrink);
			}, 100);
		}

		// send land command to server
		if(!ISSERVER && isMine){
			sendToServer({type:"land", PosY: posY, PosX: posX});
			console.log({type:"land", PosY: posY, PosX: posX});
		}
	}

	this.fall = function(){
		inAir = true;
		gravityCounter = 0;

		// send fall command to server
		if(!ISSERVER && isMine){
			sendToServer({type:"fall", PosY: posY, PosX: posX});
			console.log({type:"fall", PosY: posY, PosX: posX});
		}
	}

	this.setSpeedX = function(newSpeedX){
		if(speedX != newSpeedX){
			speedX = newSpeedX;
		}
	}

	var setSpeedY = function(newSpeedY){
		speedY = newSpeedY;						// note that yspeed is treated differently from xspeed
		if(speedY > CHARACTERMAXFALLSPEED)		// yspeed changes constantly but is more predictable
			speedY = CHARACTERMAXFALLSPEED;		// therefore we only send the jump command over and
												// not send yspeed whenever it changes
	}

	this.getPosX = function(){
		return posX;
	}

	this.getPosY = function(){
		return posY;
	}

	this.setPosition = function(x, y){
		teleportToX(x);
		teleportToY(y);
	}

	this.getSprite = function(){
		return spriteMovieClip;
	}

	// start interpolating to reduce difference in position x
	var lastKnownX;
	this.startInterpolateX = function(x, force){
		lastKnownX = x;
		var deltaX = x - posX;

		// check if possible to interpolate without looking like it's doing so
		var smoothInterpolation = CHARACTERMOVEMENTSPEED >= Math.abs(deltaX / NUMFRAMESTOINTERPOLATE);
		
		// check if interpolation will make it look like it's moving backwards
		var moveForward = (deltaX < 0 && !faceRight) || (deltaX > 0 && faceRight);

		if(force || Math.abs(deltaX) > INTERPOLATETHRESHOLD || (smoothInterpolation && moveForward)){
			console.log("InterpolatedX");
			interpolateAmtX = deltaX / NUMFRAMESTOINTERPOLATE;
			interpolateValidityX = NUMFRAMESTOINTERPOLATE;
		}
	}

	// start interpolating to reduce difference in position y
	var lastKnownY;
	this.startInterpolateY = function(y, force){
		lastKnownY = y;
		var deltaY = y - posY;

		if(force || Math.abs(deltaY) > INTERPOLATETHRESHOLD){

			that.startInterpolateX(lastKnownX, true);

			console.log("InterpolatedY");
			interpolateAmtY = deltaY / NUMFRAMESTOINTERPOLATE;
			interpolateValidityY = NUMFRAMESTOINTERPOLATE;
		}
	}

	var interpolateUpdate = function(){

		// horizontal component
		if(interpolateValidityX > 0){
			interpolateValidityX--;
			moveBlindlyX(interpolateAmtX);
			if(interpolateValidityX == 0)
				interpolateAmtX = 0;
		}

		// vertical component
		if(interpolateValidityY > 0){
			setSpeedY(0);
			interpolateValidityY--;
			moveBlindlyY(interpolateAmtY);
			if(interpolateValidityY == 0)
				interpolateAmtY = 0;
		}
	}

	/*var interpolateValidity = 0;
	var interpolate = function(){

		interpolateValidity--;
		if(interpolateValidity > 0){

			// for horizontal component
			var deltaX = interpolatePosX - posX;

			if(deltaX != 0){
				if(deltaX > CHARACTERMOVEMENTSPEED){						// very far right
					if(deltaX > CHARACTERMOVEMENTSPEED*interpolateValidity)	// too far away, fly over as smoothly as possible
						moveBlindlyX(deltaX/interpolateValidity);
					else													// feign walk right
						moveBlindlyX(CHARACTERMOVEMENTSPEED);
				}
				else if(deltaX < -CHARACTERMOVEMENTSPEED){					 // very far left
					if(deltaX < -CHARACTERMOVEMENTSPEED*interpolateValidity) // too far away, fly over as smoothly as possible
						moveBlindlyX(deltaX/interpolateValidity);
					else													 // feign walk left
						moveBlindlyX(-CHARACTERMOVEMENTSPEED);
				}
			}

			// for vertical component
			var deltaY = interpolatePosY - posY;

			if(deltaY != 0){
				if(deltaY > 60 || deltaY < -60)	// interpolate only if too far away (approx 1 tile away)
					moveBlindlyY(deltaY);
			}

			if(!ISSERVER){
				setAnimationBasedOnSpeed(deltaX);

				if(!inAir && deltaX != 0){
					if(deltaX > 0){
						spriteMovieClip.scale.x = 2;
						faceRight = true;
					} else {
						spriteMovieClip.scale.x = -2;
						faceRight = false;
					}
				}
			}
		}
	}

	this.interpolateTo = function(x, y){
		interpolatePosX = x;
		interpolatePosY = y;
		interpolateValidity = 10;
	}*/

	var die = function(){
		that.lives--;
		that.HP = 0;
                if (!ISSERVER)
                    setAnimation("Die");
		stopInput = true;
		isDead = true;
		
		// stop moving
		that.setSpeedX(0);
		holdingKey = [];

		if(that.lives > 0){

			// spawn after some time, else stay dead forever
			setTimeout(function(){
				that.HP = that.maxHP;
				isDead = false;
				stopInput = false;
                                if (!ISSERVER)
                                    uninterruptedAnimationResume();
				makeInvincible();
			}, 3000);
		
		}
	
	}

	var invincible = false;
	var makeInvincible = function(){
		invincible = true;
		
		// flashing effect
                if (!ISSERVER)
		var flashEffect = setInterval(function(){
			if(invincible)
				spriteMovieClip.visible = !spriteMovieClip.visible;
		}, 100);

		// remove invincible after a while
		setTimeout(function(){
			invincible = false;
                        if (!ISSERVER)
                            spriteMovieClip.visible = true;
			clearInterval(flashEffect);
		}, 3100);
	}

	// return false if manage to hurt it
	this.hurt = function(dmg){
		
		if(isDead || uninterruptedAnimation || invincible)
			return false;
		
		that.HP -= dmg;
		if(that.HP <= 0) die();
                if (!ISSERVER)
		if(!isDead)
			setAnimation("Hurt");
		
		return true;
	}
	
	// return if collided with rectangle
	this.isColliding = function(rectangle){
		return (bodyDetector.isIntersecting(rectangle));
	}

    this.isCollidingCircle = function(x,y,r){
        return bodyDetector.isIntersectingCircle(x,y,r);
    
    }
	this.isFacingRight = function(){
		return faceRight;
	}

	this.isObsolete = function(seqNo){
		if(seqNo > speedXSeqNo){
			speedXSeqNo = seqNo;
			return false;
		}
		return true;
	}

    this.stun = function(time){
    	stopInput = true;
    	console.log("stunned");

        setTimeout(function(){
        	stopInput = false;
        	console.log("unstunned");
        }, time);
    }

    this.stunOn = function(){
    	stopInput = true;
    }

    this.stunOff = function(){
    	stopInput = false;
    }

    this.isStunned = function(){
    	return stopInput;
    }

}

// For node.js require
if(typeof window == 'undefined')
	global.Character = Character;
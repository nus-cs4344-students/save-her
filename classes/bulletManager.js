"use strict"
function bulletManager(stage,player){
	var that = this;
	this.lastShootTime=0;
	this.shootDuration = 100;
	var bullets = [];
	var dir = 0;
	this.update = function(){
		var keys = KeyboardJS.activeKeys();
		for(var i=0; i<keys.length; i++)
		{
			if(keys[i]=='left')
				dir=1;
			if(keys[i]=='right')
				dir=0;
			if(keys[i]=='space')
			{
				shoot();
			}
			
		}
		if(bullets.length!=0)
			if(typeof(bullets[0].ttl)!="undefined")
				if(bullets[0].ttl<=0)
					bullets.shift();	
		for(var i=0;i<bullets.length;i++){
			bullets[i].move();
			
		}
		console.log(bullets.length);
	}
	function shoot(){
		var x = player.getPosX();
		var y = player.getPosY();
		var now=(new Date()).getTime();
		if(now-that.lastShootTime>that.shootDuration){
			if(dir==0){
				var startX=x;
				var startY=y;
				console.log(x+" "+y);
				var newBullet=new bullet(stage,x,y,20,"PIXI/bulletRight.png");
				bullets.push(newBullet);
				newBullet.move();		
			}
			if(dir==1){
				var startX=x;
				var startY=y;
				var newBullet=new bullet(stage,x,y,-20,"PIXI/bulletLeft.png");
				bullets.push(newBullet);
				newBullet.move();		
			}
			that.lastShootTime=now;
		}
		
	}
}

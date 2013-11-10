"use strict"
function BulletManager(stageArg, playerArg, isMine, isS) {
    var that = this;
    this.lastShootTime = 0;
    this.shootDuration = 100;
    var bullets = [];
    var dir = 0;
    this.isMine = isMine;
    var stage = stageArg;
    var player = playerArg;
    var isStun = true;
    var isServer = isS;
    var speed = 20;
    var dmg = 5;
    var normalBulletPath = "bullet.png";
    var powerBulletPath = "pbullet.png";
    var bulletPath = "bullet.png";
    this.setIsMine = function(isMe) {
        that.isMine = isMe;
    }
    this.getBullets = function() {
        return bullets;
    }
    this.stun = function(time) {
        isStun = true;
        setTimeout(function() {
            isStun = false;
        }, time);
    }
    this.startOperation = function(time) {
        isStun = false;
    }
    this.detectCollision = function(players, own, id) {
        //console.log("hit!");
        var hit = false;
        if (isServer)
        {
            var msgs = [];
            for (var j in players)
            {
                if (j != id)
                {
                    for (var i = 0; i < bullets.length; i++)
                    {


                        if (players[j].isColliding(bullets[i].getRect()))
                        {
                            bullets[i].destroy();
                            var HPbefore = players[j].HP;
                            players[j].hurt(bullets[i].getDamage());
                            var HPafter = players[j].HP;
                            if(HPbefore>0&&HPafter<=0)
                            {
                                var killMsg = {type: "kill", p1: id, p2: j};
                                msgs.push(killMsg);
                            }
                            hit = true;
                            var msg = {type: "hurt", p1: id, p2: j, dmg: bullets[i].getDamage(), hpLeft:players[j].HP};
                            msgs.push(msg);
                            //alert(players[j].HP);
                            //alert(bullets[i].getTtl());
                            bullets.splice(i, 1);
                            i--;
                            console.log("hit!");
                        }
                    }

                }
            }
            return msgs;
        }
        else
        {
            for (var j in players)
            {
                if (j != id)
                {
                    for (var i = 0; i < bullets.length; i++)
                    {


                        if (players[j].isColliding(bullets[i].getRect()))
                        {
                            //play sound if bullet hit
                            playSound(bulletHit, false);
                            bullets[i].destroy();
                            //alert(bullets[i].getTtl());
                            bullets.splice(i, 1);
                            i--;
                            console.log("hit!");
                        }
                    }

                }
            }
            if (own != null)
                for (var i = 0; i < bullets.length; i++)
                {
                    if (own.isColliding(bullets[i].getRect()))
                    {
                        //play sound if bullet hit
                        playSound(bulletHit, false);
                        bullets[i].destroy();
                        //alert(bullets[i].getTtl());
                        bullets.splice(i, 1);
                        i--;
                        console.log("hit!");
                    }
                }
        }
    }
    this.update = function(players, own, id) {
        //console.log(that.shootDuration);
        for (var i = 0; i < bullets.length; i++) {
            if (bullets[i].ttl > 0)
            {
                bullets[i].move();

            }
            else
            {
                bullets.splice(i, 1);
                i--;
            }

        }
        // console.log(bullets.length);

        if (isServer)
            return that.detectCollision(players, null, id);
        else
        if (bullets.length > 0)
            if (!(that.isMine))
                that.detectCollision(players, own, id);
            else
            {
                that.detectCollision(players, null, null);
            }

        if (that.isMine && !isStun && !player.isDeadNow()) {

            var isGoingToShoot = false;

            var keys = KeyboardJS.activeKeys();
            for (var i = 0; i < keys.length; i++)
            {
                if (keys[i] == 'z')
                    isGoingToShoot = true;
            }

            if(player.touchShoot)
                isGoingToShoot = true;

            if(isGoingToShoot){
                if (player.isFacingRight())
                    dir = 0;
                else
                    dir = 1;

                that.shoot();
                playSound(bulletSound, false);
            }
        }
    }

    // hongwei - added effect parameter so it can be removed
    this.powerUp = function(effect) {
        bulletPath = powerBulletPath;
        dmg = 10;
        var fx = effect;

        setTimeout(function() {
            bulletPath = normalBulletPath;
            dmg = 5;
            if (!ISSERVER)
                stage.removeChild(fx);
        }, 10000);
    }
    this.setDir = function(dirA) {
        dir = dirA;
    }
    this.shoot = function() {
        var now = (new Date()).getTime();
        if (now - that.lastShootTime > that.shootDuration) {

            if (that.isMine)
                sendToServer({type: "shoot", dir: dir});

            setTimeout(delayedShoot, 50);

            that.lastShootTime = now;
        }
    }

    var delayedShoot = function() {

        var x = player.getPosX();
        var y = player.getPosY();

        var yOffset = 0;
        // huamn holds gun higher
        if (player.characterType == CHARACTERTYPE.HUMAN)
            yOffset = -10;

        // create firing effect
        if (!ISSERVER)
            createFiringFX(x, y + yOffset, dir);

        if (dir == 0) {
            var startX = x;
            var startY = y;
            //console.log(x+" "+y);

            var newBullet = new bullet(stage, x, y + yOffset, speed, bulletPath, isServer, dmg);

            //sendToServer({type:"bullet",x:x,y:y,speed:20,tex:"PIXI/bulletRight.png"});
            bullets.push(newBullet);
            newBullet.move();
        }
        if (dir == 1) {
            var startX = x;
            var startY = y;
            var newBullet = new bullet(stage, x, y + yOffset, 0 - speed, bulletPath, isServer, dmg);
            bullets.push(newBullet);
            //sendToServer({type:"bullet",x:x,y:y,speed:-20,tex:"PIXI/bulletLeft.png"});
            newBullet.move();
        }

    }
}
if (typeof window == 'undefined')
    global.BulletManager = BulletManager;
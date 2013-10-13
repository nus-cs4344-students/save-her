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
    var isServer = isS;
    var speed = 20;
    this.setIsMine = function(isMe) {
        that.isMine = isMe;
    }
    this.getBullets = function() {
        return bullets;
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
                            players[j].hurt(bullets[i].getDamage());
                            hit = true;
                            var msg = {type: "hurt", p1: id, p2: j, dmg: bullets[i].getDamage()};
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

        if (that.isMine) {
            var keys = KeyboardJS.activeKeys();
            for (var i = 0; i < keys.length; i++)
            {
                if (keys[i] == 'left')
                    dir = 1;
                if (keys[i] == 'right')
                    dir = 0;
                if (keys[i] == 'space')
                {
                    that.shoot();

                }

            }
        }
    }
    this.setDir = function(dirA) {
        dir = dirA;
    }
    this.shoot = function() {
        var x = player.getPosX();
        var y = player.getPosY();
        var now = (new Date()).getTime();
        if (now - that.lastShootTime > that.shootDuration) {
            if (that.isMine)
                sendToServer({type: "shoot", dir: dir});
            if (dir == 0) {
                var startX = x;
                var startY = y;
                //console.log(x+" "+y);

                var newBullet = new bullet(stage, x, y, speed, "PIXI/bulletRight.png", isServer);

                //sendToServer({type:"bullet",x:x,y:y,speed:20,tex:"PIXI/bulletRight.png"});
                bullets.push(newBullet);
                newBullet.move();
            }
            if (dir == 1) {
                var startX = x;
                var startY = y;
                var newBullet = new bullet(stage, x, y, 0 - speed, "PIXI/bulletLeft.png", isServer);
                bullets.push(newBullet);
                //sendToServer({type:"bullet",x:x,y:y,speed:-20,tex:"PIXI/bulletLeft.png"});
                newBullet.move();
            }
            that.lastShootTime = now;
        }

    }
}
if (typeof window == 'undefined')
    global.BulletManager = BulletManager;
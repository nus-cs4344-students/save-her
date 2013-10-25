"use strict"
function SkillManager(stageArg, playerArg, bulletManager, isMine, isS) {
    var that = this;
    this.lastSkillTime = 0;
    this.ownBulletManger = bulletManager;
    this.isMine = isMine;
    var stage = stageArg;
    var player = playerArg;
    var isServer = isS;
    var aoe = null;
    var stun = null;
    var superSaiyan = null;

    //for client
    var mines = [];
    //for server
    var minesX = [];
    var minesY = [];

    var mineLeft = 4;
    var mineSize = 50;//width , height
    var mineDamage = 30;
    var lastMineTime = 0;
    var stunTime = 3000;
    var stunOn = false;
    var aoeOn = false;
    this.cd = 0;
    var aoeDamage = 3;
    var aoeRadius = 150;
    var stunRadius = 150;
    this.scd = 0;

    var lastAoeHurtTime = [];
    this.setIsMine = function(isMe) {
        that.isMine = isMe;
    }

    this.detectCollision = function(players, own, id) {
        //console.log("hit!");
        var hit = false;
        var msgs = [];

        switch (player.characterType) {
            case CHARACTERTYPE.PUMPKIN:
                //landmine

                if (mineLeft < 4)
                {
                    var msgs = [];

                    for (var i = 0; i < minesX.length; i++)
                    {
                        for (var j in players)
                        {
                            if (j != id)
                            {

                                if (players[j].isColliding(new Rectangle(stage, minesX[i], minesY[i], mineSize, mineSize)))
                                {
                                    players[j].hurt(mineDamage);
                                    var msg = {type: "mineHurt", p1: id, p2: j, dmg: mineDamage, mineId: i};
                                    msgs.push(msg);
                                    mines.splice(i, 1);
                                    minesX.splice(i, 1);
                                    minesY.splice(i, 1);

                                    mineLeft++;
                                }
                            }
                        }
                    }
                }
                break;

            case CHARACTERTYPE.MUSHROOM:
                //AOE
                if (aoeOn == true)
                {

                    var msgs = [];
                    for (var j in players)
                    {
                        if (j != id)
                        {
                            if (players[j].isCollidingCircle(player.getPosX(), player.getPosY(), aoeRadius))
                            {
                                players[j].hurt(aoeDamage);
                                hit = true;
                                var now = (new Date()).getTime();

                                if (typeof(lastAoeHurtTime[j]) == "undefined")
                                    lastAoeHurtTime[j] = 0;
                                console.log(lastAoeHurtTime[j]);
                                if (now - lastAoeHurtTime[j] >= 1000)
                                {
                                    var msg = {type: "hurt", p1: id, p2: j, dmg: aoeDamage};
                                    msgs.push(msg);
                                    lastAoeHurtTime[j] = now;
                                }

                                //alert(players[j].HP);
                                //alert(bullets[i].getTtl());
                                //console.log("hit!");

                            }
                        }
                    }


                }
                break;

            case CHARACTERTYPE.DEVIL:
                //stun detect only once
                if (stunOn == true)
                {

                    var msgs = [];
                    for (var j in players)
                    {
                        if (j != id)
                        {
                            if (players[j].isCollidingCircle(player.getPosX(), player.getPosY(), stunRadius))
                            {
                                players[j].stun(stunTime);
                                var msg = {type: "stun", p1: id, p2: j, time: stunTime};
                                msgs.push(msg);

                            }
                        }
                    }

                    stunOn = false;
                }
                break;



        }
        return msgs;
    }

    this.update = function(players, own, id) {


        // console.log(bullets.length);
        switch (player.characterType) {

            // HongWei - update FX to follow player
            case CHARACTERTYPE.HUMAN:
                if(superSaiyan != undefined){
                    superSaiyan.position.x = player.getPosX();
                    superSaiyan.position.y = player.getPosY();
                }

                break;
            case CHARACTERTYPE.PUMPKIN:
                //landmine

                break;
            case CHARACTERTYPE.MUSHROOM:
                //local AOE effect
                if (aoeOn == true && !isServer)
                {
                    aoe.position.x = player.getPosX() - aoeRadius;
                    aoe.position.y = player.getPosY() - aoeRadius;
                }

                break;
            case CHARACTERTYPE.DEVIL:
                //local stun effect
                break;

        }
        if (isServer)
            return that.detectCollision(players, null, id);
        else
        {
            if (that.isMine) {
                var keys = KeyboardJS.activeKeys();
                if (player.characterType == CHARACTERTYPE.PUMPKIN)
                {
                    for (var i = 0; i < keys.length; i++)
                    {
                        if (keys[i] == 'x' && mineLeft >= 1)
                        {
                            var now = (new Date()).getTime();
                            if (now - lastMineTime >= 5000)
                            {
                                that.skill();

                                lastMineTime = now;
                            }
                        }
                    }
                }
                else
                {
                    if (that.cd >= 0)
                    {
                        that.cd -= FRAMEDURATION / 1000;

                        that.scd = Math.ceil(that.cd);
                    }
                    else
                    {
                        for (var i = 0; i < keys.length; i++)
                        {
                            if (keys[i] == 'x')
                            {
                                that.skill();
                                that.cd = 60;
                            }
                        }
                    }
                }
            }
        }
    }

    this.skill = function() {

        var x = player.getPosX();
        var y = player.getPosY();
        var now = (new Date()).getTime();


        if (that.isMine)
            sendToServer({type: "skill",x:x,y:y});
        switch (player.characterType) {
            case CHARACTERTYPE.HUMAN:
                //rapid shoot
                if (!isServer)
                {
                    //Super saiyan effect
                    var superSaiyanFX = [];
                    for (var i=0; i < 3; i++)
                        superSaiyanFX.push(PIXI.Texture.fromFrame("anger" + (i+1) + ".png"));
                    superSaiyan = new PIXI.MovieClip(superSaiyanFX);
                    superSaiyan.anchor.x = 0.5;
                    superSaiyan.anchor.y = 0.5;
                    superSaiyan.scale.x *= 2;
                    superSaiyan.scale.y *= 2;
                    superSaiyan.position.x = x;
                    superSaiyan.position.y = y;
                    superSaiyan.animationSpeed = 0.6;
                    stage.addChild(superSaiyan);
                    superSaiyan.play()
                }
                that.ownBulletManger.powerUp(superSaiyan);
                break;
            case CHARACTERTYPE.PUMPKIN:
                //landmine, only myself can see
                mineLeft--;
                if (isMine){
                    var mineTextures = [];
                    for (var i=0; i < 8; i++)
                        mineTextures.push(PIXI.Texture.fromFrame("bomb000" + (i) + ".png"));
                    var mine = new PIXI.MovieClip(mineTextures);
                    mine.anchor.x = 0;
                    mine.anchor.y = 0.2;
                    mine.scale.x *= 2;
                    mine.scale.y *= 2;
                    mine.position.x = x;
                    mine.position.y = y;
                    mine.play();
                    stage.addChild(mine);
                }
                minesX.push(x);
                minesY.push(y);
                break;
            case CHARACTERTYPE.MUSHROOM:
                //AOE
                if (!isServer)
                {
                    //AOE texture
                    var texture = PIXI.Texture.fromImage("AOE.png");
                    aoe = new PIXI.Sprite(texture);
                    aoe.position.x = x - aoeRadius;
                    aoe.position.y = y - aoeRadius;

                    stage.addChild(aoe);
                }
                aoeOn = true;

                setTimeout(function() {
                    if (!isServer)
                        stage.removeChild(aoe);
                    aoeOn = false;
                }, 10000);
                break;
            case CHARACTERTYPE.DEVIL:
                //stun
                if (!isServer)
                {
                    var stunTextures = [];
                    stunTextures.push(PIXI.Texture.fromFrame("STUNwhite.png"));
                    stunTextures.push(PIXI.Texture.fromFrame("STUN.png"));
                    var stun = new PIXI.MovieClip(stunTextures);
                    stun.anchor.x = 0.5;
                    stun.anchor.y = 0.5;
                    stun.scale.x *= 2;
                    stun.scale.y *= 2;
                    stun.position.x = x;
                    stun.position.y = y;
                    stun.loop = false;
                    stun.animationSpeed = 0.2;
                    stun.gotoAndPlay (0);
                    stage.addChild(stun);
                }
                stunOn = true;

                setTimeout(function() {
                    if (!isServer){
                        var fadeOut = setInterval(function(){
                            stun.alpha -= 0.1;
                            if(stun.alpha <= 0){
                                stage.removeChild(stun);
                                clearInterval(fadeOut);
                            }
                        }, 10);
                    }
                    stunOn = false;
                }, 1000);
                break;

        }

        //var newSkill = new skill(stage, x, y + yOffset, speed, "bullet.png", isServer);
        that.lastSkillTime = now;

    }
    this.serverMine = function(x,y){
        minesX.push(x);
        minesY.push(y);
        mineLeft--;
    }
    this.removeMine = function(id) {
        stage.removeChild(mines[id]);
        mines.splice(id, 1);
        minesX.splice(id, 1);
        minesY.splice(id, 1);

        mineLeft++;
    }
}

if (typeof window == 'undefined')
    global.SkillManager = SkillManager;
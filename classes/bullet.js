"use strict";

function bullet(stageArg, init_x, init_y, speed, path, isS, dmg) {
    var wallDetector;
    var that = this;
    var stage = stageArg;
    var isServer = isS;
    var x = init_x + speed * 2;
    var y = init_y + 15;
    var onStage = false;
    if (!isServer)
    {
        Gamesound.play("bulletSound");
        var texture = PIXI.Texture.fromImage(path);
        var b = new PIXI.Sprite(texture);
        b.scale.x = 2;
        b.scale.y = 2;

        b.anchor.x = 0.5;
        b.anchor.y = 0.5;

        // change texture direction if opposite
        if(speed < 0)  // facing left
            b.scale.x *= -1;

        b.position.x = x;
        b.position.y = y;
        stage.addChild(b);
        onStage = true;
    }
    this.damage = dmg;
    this.ttl = 18;
    this.speed = speed;
    wallDetector = new Rectangle(stage, x - 20, y -5, 40, 13);
    this.getRect = function() {
        return wallDetector;
    }
    this.getDamage = function() {
        return that.damage;
    }
    this.move = function() {
        wallDetector.moveX(speed);
        x += speed;
        if (!isServer)
            b.position.x = x;
        if (that.ttl > 0)
            that.ttl--;

        var relevantRects = getRelevantRectangles(x, y);

        for (var i = 0; i < relevantRects.length; i++)
            if (wallDetector.isIntersecting(relevantRects[i]))
            {
                that.ttl = 0;
                break;
            }
        if (that.ttl == 0 && !isServer)
        {
            createBulletExplodeFX(b.position.x, b.position.y)
            stage.removeChild(b);
            wallDetector.destroy();
            onStage = false;
        }
    }
    this.destroy = function() {
        that.ttl = 0;
        if (onStage)
        {
            createBulletExplodeFX(b.position.x, b.position.y);
            createHurtFX(b.position.x, b.position.y);

            stage.removeChild(b);
            wallDetector.destroy();
            onStage = false;
        }
    }
}
if (typeof window == 'undefined')
    global.bullet = bullet;
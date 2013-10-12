"use strict";

function bullet(stageArg, init_x, init_y, speed, path, isS) {
    var wallDetector;
    var that = this;
    var stage = stageArg;
    var isServer = isS;
    var x = init_x + speed * 2;
    var y = init_y;
    var onStage = false;
    if (!isServer)
    {
        var texture = PIXI.Texture.fromImage(path);
        var b = new PIXI.Sprite(texture);
        b.anchor.x = 0.5;
        b.anchor.y = 0.5;

        b.position.x = x;
        b.position.y = y;
        stage.addChild(b);
        onStage = true;
    }
    this.damage = 5;
    this.ttl = 18;
    this.speed = speed;
    wallDetector = new Rectangle(stage, x - 42, y - 6, 84, 13);
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

        for (var i = 0; i < mapRects.length; i++)
            if (wallDetector.isIntersecting(mapRects[i]))
            {
                that.ttl = 0;
                break;
            }
        if (that.ttl == 0 && !isServer)
        {
            stage.removeChild(b);
            wallDetector.destroy();
            onStage = false;
        }
    }
    this.destroy = function() {
        that.ttl = 0;
        if (onStage)
        {
            stage.removeChild(b);
            wallDetector.destroy();
            onStage = false;
        }
    }
}
if (typeof window == 'undefined')
    global.bullet = bullet;
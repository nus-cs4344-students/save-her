
function bullet(stage,init_x,init_y,speed,path) {
	var that = this;
	var stage = stage;
	var texture = PIXI.Texture.fromImage(path);
	var b = new PIXI.Sprite(texture);
	b.anchor.x = 0.5;
    b.anchor.y = 0.5;
    this.damage = 5;
	this.ttl=18;
	this.speed = speed;
	b.position.x=init_x;
	b.position.y=init_y;
	var tex=texture;
	stage.addChild(b);
	this.move = function(){
		b.position.x+=speed;
		that.ttl--;
		if(that.ttl==0)
			stage.removeChild(b);
	}
	
};
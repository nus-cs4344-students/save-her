var HPTexts = [];
var LivesTexts = [];
var cdText;

var health_value;
var heartbar =[];
var stage_copy;


var scene0 = new PIXI.DisplayObjectContainer(),
    scene1 = new PIXI.DisplayObjectContainer(),
    scene2 = new PIXI.DisplayObjectContainer(),
    scene3 = new PIXI.DisplayObjectContainer(),
    scene4 = new PIXI.DisplayObjectContainer(),
    scene5 = new PIXI.DisplayObjectContainer(),
    scene6 = new PIXI.DisplayObjectContainer(),
    scene7 = new PIXI.DisplayObjectContainer(),
    scene8 = new PIXI.DisplayObjectContainer(),
    scene9 = new PIXI.DisplayObjectContainer();







// initialise before making any play sounds call
function initGameGUI(stage){
	addPlayerGUI(stage);
    stage_copy = stage;

        cdText = new PIXI.BitmapText("", {font: "32px 04b03", align: "right"});
	cdText.position.x = 700;
	cdText.position.y = 10;
	stage.addChild(cdText);
}

var nextGUIY = 10;
var nextY = 10;
function addPlayerGUI(stage){
	// setup GUI
	var hpText = new PIXI.BitmapText("", {font: "32px 04b03", align: "left"});
	hpText.position.x = 50;
	hpText.position.y = nextGUIY;
	stage.addChild(hpText);
        HPTexts.push(hpText);
      
        

	var livesText = new PIXI.BitmapText("", {font: "32px 04b03", align: "left"});
	livesText.position.x = 10;
	livesText.position.y = nextGUIY;
	stage.addChild(livesText);

	LivesTexts.push(livesText);


    var texture = PIXI.Texture.fromImage("PIXI/Heart.png");
    var health1 = new PIXI.Sprite(texture);
    health1.position.x = 120;
    health1.position.y = nextY;
    var health2 = new PIXI.Sprite(texture);
    health2.position.x = 140;
    health2.position.y = nextY;
    var health3 = new PIXI.Sprite(texture);
    health3.position.x = 160;
    health3.position.y = nextY;
    var health4 = new PIXI.Sprite(texture);
    health4.position.x = 180;
    health4.position.y = nextY;
    var health5 = new PIXI.Sprite(texture);
    health5.position.x = 200;
    health5.position.y = nextY;
    var health6 = new PIXI.Sprite(texture);
    health6.position.x = 220;
    health6.position.y = nextY;
    var health7 = new PIXI.Sprite(texture);
    health7.position.x = 240;
    health7.position.y = nextY;
    var health8 = new PIXI.Sprite(texture);
    health8.position.x = 260;
    health8.position.y = nextY;
    var health9 = new PIXI.Sprite(texture);
    health9.position.x = 280;
    health9.position.y = nextY;
    var health10 = new PIXI.Sprite(texture);
    health10.position.x = 300;
    health10.position.y = nextY;
    heartbar = [health1,health2,health3,health4,health5,health6,health7,health8,health9,health10];

    scene0.addChild(heartbar[0]);
    scene1.addChild(heartbar[1]);
    scene2.addChild(heartbar[2]);
    scene3.addChild(heartbar[3]);
    scene4.addChild(heartbar[4]);
    scene5.addChild(heartbar[5]);
    scene6.addChild(heartbar[6]);
    scene7.addChild(heartbar[7]);
    scene8.addChild(heartbar[8]);
    scene9.addChild(heartbar[9]);

    nextGUIY += 40;
    nextY += 40;



}


function health_display(val){ // get stage from game.js

    stage_copy.addChild(scene0);
    stage_copy.addChild(scene1);
    stage_copy.addChild(scene2);
    stage_copy.addChild(scene3);
    stage_copy.addChild(scene4);
    stage_copy.addChild(scene5);
    stage_copy.addChild(scene6);
    stage_copy.addChild(scene7);
    stage_copy.addChild(scene8);
    stage_copy.addChild(scene9);

    if(val == 0)
    {
        scene0.visible = false;
        scene1.visible = false;
        scene2.visible = false;
        scene3.visible = false;
        scene4.visible = false;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;




    }
    else if(val == 1)
    {
        scene0.visible = false;
        scene1.visible = false;
        scene2.visible = false;
        scene3.visible = false;
        scene4.visible = false;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;


    }
    else if(val == 2)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = false;
        scene3.visible = false;
        scene4.visible = false;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;


    }
    else if(val == 3)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = false;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;


    }
    else if(val == 4)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = false;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;

    }
    else if(val == 5)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = false;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;
    }
    else if(val == 6)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = true;
        scene6.visible = false;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;
    }
    else if(val == 7)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = true;
        scene6.visible = true;
        scene7.visible = false;
        scene8.visible = false;
        scene9.visible = false;

    }
    else if(val == 8)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = true;
        scene6.visible = true;
        scene7.visible = true;
        scene8.visible = false;
        scene9.visible = false;
    }
    else if(val == 9)
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = true;
        scene6.visible = true;
        scene7.visible = true;
        scene8.visible = true;
        scene9.visible = false;

    }
    else
    {
        scene0.visible = true;
        scene1.visible = true;
        scene2.visible = true;
        scene3.visible = true;
        scene4.visible = true;
        scene5.visible = true;
        scene6.visible = true;
        scene7.visible = true;
        scene8.visible = true;
        scene9.visible = true;

    }

}



function gameGUIUpdate(){

	// update own HP/lives
	if(ownCharacter != null){
		HPTexts[0].setText(ownCharacter.HP.toString());
		LivesTexts[0].setText(ownCharacter.lives.toString());
        health_value = ownCharacter.HP;
        var final_value;
         if(health_value >= 100){final_value = 10;}
         else if(health_value >= 90){final_value = 9;}
         else if(health_value >= 80){final_value = 8;}
         else if(health_value >= 70){final_value = 7;}
         else if(health_value >= 60){final_value = 6;}
         else if(health_value >= 50){final_value = 5;}
         else if(health_value >= 40){final_value = 4;}
         else if(health_value >= 30){final_value = 3;}
         else if(health_value >= 20){final_value = 2;}
         else if(health_value >= 10){final_value = 1;}
         else{final_value = 0;}
         //console.log(final_value);
        health_display(final_value);
        //health_display(final_value);



	}
        if(ownSkillManager!=null){
            cdText.setText("cd: "+ownSkillManager.scd.toString());
        }
	// update other players' HP/lives
	var i=0;
	var playerID;
	for(playerID in characters){
		i++;
		HPTexts[i].setText(characters[playerID].HP.toString());
		LivesTexts[i].setText(characters[playerID].lives.toString());
	}
    
}
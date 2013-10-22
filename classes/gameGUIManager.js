var HPTexts = [];
var LivesTexts = [];
var cdText;


// initialise before making any play sounds call
function initGameGUI(stage){
	addPlayerGUI(stage); 
        cdText = new PIXI.BitmapText("", {font: "32px 04b03", align: "right"});
	cdText.position.x = 700;
	cdText.position.y = 10;
	stage.addChild(cdText);
}

var nextGUIY = 10;
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



    //heart bar GUI
    var texture = PIXI.Texture.fromImage("PIXI/Heart.png");
    var health1 = new PIXI.Sprite(texture);
    health1.position.x = 120;
    health1.position.y = nextGUIY;
    var health2 = new PIXI.Sprite(texture);
    health2.position.x = 140;
    health2.position.y = nextGUIY;
    var health3 = new PIXI.Sprite(texture);
    health3.position.x = 160;
    health3.position.y = nextGUIY;
    var health4 = new PIXI.Sprite(texture);
    health4.position.x = 180;
    health4.position.y = nextGUIY;
    var health5 = new PIXI.Sprite(texture);
    health5.position.x = 200;
    health5.position.y = nextGUIY;
    var health6 = new PIXI.Sprite(texture);
    health6.position.x = 220;
    health6.position.y = nextGUIY;
    var health7 = new PIXI.Sprite(texture);
    health7.position.x = 240;
    health7.position.y = nextGUIY;
    var health8 = new PIXI.Sprite(texture);
    health8.position.x = 260;
    health8.position.y = nextGUIY;
    var health9 = new PIXI.Sprite(texture);
    health9.position.x = 280;
    health9.position.y = nextGUIY;
    var health10 = new PIXI.Sprite(texture);
    health10.position.x = 300;
    health10.position.y = nextGUIY;
    var heartbar;
    heartbar = [health1,health2,health3,health4,health5,health6,health7,health8,health9,health10];
    //for display purposes
    for(var i = 0; i < 10; i++)
    {
        stage.addChild(heartbar[i]);
    }


    nextGUIY += 40;


}

function gameGUIUpdate(){

	// update own HP/lives
	if(ownCharacter != null){
		HPTexts[0].setText(ownCharacter.HP.toString());
		LivesTexts[0].setText(ownCharacter.lives.toString());
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
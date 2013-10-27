var HPTexts = [];
var LivesTexts = [];
var killsTexts = [];
var cdText;

var health_value;
var HPIcons = [];
var stage_copy;


// initialise before making any play sounds call
function initGameGUI(stage){
	addPlayerGUI(stage);
    displayText(stage);

    cdText = new PIXI.BitmapText("", {font: "28px 04b03", align: "right"});
	cdText.position.x = 700;
	cdText.position.y = 40;
	stage.addChild(cdText);
}



function displayText(stage)
{
    //Health Display
    var hpTitle = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    hpTitle.position.x = 120
    hpTitle.position.y = 10;
    hpTitle.setText("Health");
    stage.addChild(hpTitle);

    //Lives Display
    var liveDisplay = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    liveDisplay.position.x = 10
    liveDisplay.position.y = 10;
    liveDisplay.setText("Lives");
    stage.addChild(liveDisplay);

    //Kills Display
    var killsDisplay = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    killsDisplay.position.x = 335;
    killsDisplay.position.y = 10;
    killsDisplay.setText("Kills");
    stage.addChild(killsDisplay);

    //CoolDown Display
    var coolDown = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    coolDown.position.x = 700;
    coolDown.position.y = 10;
    coolDown.setText("SP");
    stage.addChild(coolDown);


}

var nextGUIY = 40;
function addPlayerGUI(stage){
	// setup GUI


	var hpText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
	hpText.position.x = 50;
	hpText.position.y = nextGUIY;
	stage.addChild(hpText);
    HPTexts.push(hpText);



	var livesText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
	livesText.position.x = 10;
	livesText.position.y = nextGUIY;
	stage.addChild(livesText);
	LivesTexts.push(livesText);

    var killsText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    killsText.position.x = 335;
    killsText.position.y = nextGUIY;
    killsText.setText("0");
    stage.addChild(killsText);// example
    //killsTexts.push(killsText);


    var texture = PIXI.Texture.fromImage("PIXI/HeartBar.png");
    var health1 = new PIXI.Sprite(texture);
    health1.position.x = 120;
    health1.position.y = nextGUIY;
    stage.addChild(health1);
    HPIcons.push(health1);

    nextGUIY += 30;
}





function gameGUIUpdate(){

	// update own HP/lives
	if(ownCharacter != null){
        //display health text
		//HPTexts[0].setText(ownCharacter.HP.toString()); //Hide HPText display
        //display health bar
        health_value = ownCharacter.HP;
        var health1;
        health1 = (health_value/100)*200;
        HPIcons[0].width = health1;
        //display live text
        LivesTexts[0].setText(ownCharacter.lives.toString());

        //kill text
        //killsTexts[0].setText(Number of kills.toString());


	}
        if(ownSkillManager!=null){
            cdText.setText("cd: "+ownSkillManager.scd.toString());
        }


	// update other players' HP/lives
	var i=0;
	var playerID;
	for(playerID in characters)
    {
		i++;
        //display health text
		//HPTexts[i].setText(characters[playerID].HP.toString()); //Hide HPText display
        //display health bar
        health_value = characters[playerID].HP;
        var health2;
        health2 = (health_value/100)*200;
        HPIcons[i].width = health2;
        //display live text
        LivesTexts[i].setText(characters[playerID].lives.toString());

        //kill text
        //killsTexts[i].setText(Number of kills.toString());
	}
    
}
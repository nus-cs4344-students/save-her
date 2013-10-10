var HPTexts = [];
var LivesTexts = [];

// initialise before making any play sounds call
function initGameGUI(stage){
	addPlayerGUI(stage);
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

	nextGUIY += 40;
}

function gameGUIUpdate(){

	// update own HP/lives
	if(ownCharacter != null){
		HPTexts[0].setText(ownCharacter.HP.toString());
		LivesTexts[0].setText(ownCharacter.lives.toString());
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
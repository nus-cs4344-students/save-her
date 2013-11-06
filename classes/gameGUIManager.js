var PlayerText = [];
var HPTexts = [];
var LivesTexts = [];
var KillText = [];
var ScoreText = [];
var LText = [];

var HP_value = [];
var Lives_value = [];
var Kill_value = [];
var players_string  = [];

var cdText;
var health_value;
var HPIcons = [];
var stage_copy;
var died = 1;




// initialise before making any play sounds call
function initGameGUI(stage){
    addPlayerGUI(stage);
    displayText(stage);
    stage_copy = stage;
    cdText = new PIXI.BitmapText("", {font: "28px 04b03", align: "right"});
    cdText.position.x = 700;
    cdText.position.y = 40;
    stage.addChild(cdText);

}

var waitText;
function displayWait(stage){
    waitText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    waitText.position.x = 350;
    waitText.position.y = 200;
    stage.addChild(waitText);

    var dots = 0;
    setInterval(function(){
        dots++;
        var str = "Waiting";
        for(var i=0; i<dots; i++)
            str += ".";
        waitText.setText(str);
        if(dots >= 3)
            dots = 0;
    }, 100);
}

function displayStartButton(stage, callback){
    var startText = new PIXI.Sprite(PIXI.Texture.fromImage("start-button.png"));
    startText.anchor.x = 0.5;
    startText.anchor.y = 0.5;
    startText.position.x = 400;
    startText.position.y = 300;
    startText.scale.x = 2;
    startText.scale.y = 2;
    startText.alpha = 0.5;
    stage.addChild(startText);

    startText.setInteractive(true);
    startText.mouseover = function(mouseData){
        startText.alpha = 1;
    }
    startText.mouseout = function(mouseData){
        startText.alpha = 0.5;
    }
    startText.mousedown = function(mouseData){
        startText.scale.x = 2.2;
        startText.scale.y = 2.2;
    }
    startText.mouseup = function(mouseData){
        stage.removeChild(startText);
        callback();
    }
    startText.touchstart = function(mouseData){
        startText.scale.x = 2.2;
        startText.scale.y = 2.2;
        startText.alpha = 1;
    }
    startText.touchend = function(mouseData){
        stage.removeChild(startText);
        callback();
    }
}

function concludeStartMessages(stage){
    if(waitText != undefined)
        stage.removeChild(waitText);
    stage.setInteractive(false);

    var fightText = new PIXI.Sprite(PIXI.Texture.fromImage("fight.png"));
    fightText.anchor.x = 0.5;
    fightText.anchor.y = 0.5;
    fightText.position.x = 400;
    fightText.position.y = 300;
    fightText.scale.x = 2;
    fightText.scale.y = 2;
    stage.addChild(fightText);

    var expandCounter = 0;
    var expand = setInterval(function(){
        expandCounter++;
        fightText.scale.x += 0.2;
        fightText.scale.y += 0.2;

        if(expandCounter > 5){
            clearInterval(expand);

            setTimeout(function(){

                var fadeAway = setInterval(function(){
                    fightText.alpha -= 0.02;
                    if(fightText.alpha > 0)
                        fightText.position.y += 1;
                    else{
                        stage.removeChild(fightText);
                        clearInterval(fadeAway);
                    }
                }, FRAMEDURATION);

            }, 300);

        }

    }, FRAMEDURATION);


}

function displayText(stage)
{
    var playerTitle = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    playerTitle.position.x = 10
    playerTitle.position.y = 10;
    playerTitle.setText("Player");
    stage.addChild(playerTitle);


    //Lives Display
    var liveDisplay = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    liveDisplay.position.x = 120
    liveDisplay.position.y = 10;
    liveDisplay.setText("Lives");
    stage.addChild(liveDisplay);


    //Health Display
    var hpTitle = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    hpTitle.position.x = 230;
    hpTitle.position.y = 10;
    hpTitle.setText("Health");
    stage.addChild(hpTitle);



    //Kills Display
    var killsDisplay = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    killsDisplay.position.x = 445;
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

    var user1 = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    user1.position.x = 10;
    user1.position.y = nextGUIY;
    stage.addChild(user1);
    PlayerText.push(user1);


    var hpText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    hpText.position.x = 50;
    hpText.position.y = nextGUIY;
    stage.addChild(hpText);
    HPTexts.push(hpText);



    var livesText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    livesText.position.x = 120;
    livesText.position.y = nextGUIY;
    stage.addChild(livesText);
    LivesTexts.push(livesText);

    var killsText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    killsText.position.x = 445;
    killsText.position.y = nextGUIY;
    stage.addChild(killsText);// example
    KillText.push(killsText);


    var texture = PIXI.Texture.fromImage("HeartBar.png");
    var health1 = new PIXI.Sprite(texture);
    health1.position.x = 230;
    health1.position.y = nextGUIY;
    stage.addChild(health1);
    HPIcons.push(health1);

    nextGUIY += 30;



}


function gameover(x)
{

    var gameover = new PIXI.Sprite(PIXI.Texture.fromImage("scoreboard.png"));
    gameover.anchor.x = 0.5;
    gameover.anchor.y = 0.5;
    gameover.position.x = 400;
    gameover.position.y = 300;
    gameover.scale.x = 1;
    gameover.scale.y = 1;
    gameover.alpha = 0.9;
    var gameoverText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    gameoverText.position.x = 110;
    gameoverText.position.y = 110;
    if(x==0)
    {
        gameoverText.setText("Game Over, you are dead!");
    }
    if(x==1)
    {
        gameoverText.setText("Congratulations! You are the winner!");
    }
    var sText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    sText.position.x = 110;
    sText.position.y = 150;
    ScoreText.push(sText);

    var lText = new PIXI.BitmapText("", {font: "28px 04b03", align: "left"});
    lText.position.x = 110;
    lText.position.y = 180;
    LText.push(lText);

    stage_copy.addChild(gameover);
    stage_copy.addChild(gameoverText);
    stage_copy.addChild(sText);
    stage_copy.addChild(lText);

    autoRefresh(5000);

}


function gameGUIUpdate(){

    // update own HP/lives
    if(ownCharacter != null){
        health_value = ownCharacter.HP;
        var health1;
        health1 = (health_value/100)*200;
        HPIcons[0].width = health1;
        HP_value[0] = ownCharacter.HP;

        //display live text & copy lives value to array
        LivesTexts[0].setText(ownCharacter.lives.toString());
        Lives_value[0] = ownCharacter.lives;

        // /display own player name
        PlayerText[0].setText(player.name);
        players_string[0] = player.name;

        //display kills
        //Get the list of KillList[], compare with all the opponmentIDs
        //increment the "count" if there is a match
        //take the total number of KillList minus "count"

        var count = 0;
        var final_count = 0;
        var x,y;
        for(x = 0; x<killList.length;x++)
        {
            for(y = 0; y<opponmentID.length;y++)
                if(killList[x]==opponmentID[y])
                    count++;
        }
        final_count = killList.length - count;
        KillText[0].setText(final_count.toString());
        Kill_value[0] = final_count;

        //display scoreboard if player dies
        if(ownCharacter.lives == 0 && died == 1)
        {
            gameover(0);
            totalplayersleft();
            mostkills();
            died++;
        }
        //else
            checkiflast();

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
        //display health bar
        health_value = characters[playerID].HP;
        var health2;
        health2 = (health_value/100)*200;
        HPIcons[i].width = health2;
        HP_value[0] = characters[playerID].HP;
        //display live text
        LivesTexts[i].setText(characters[playerID].lives.toString());
        Lives_value[i] = characters[playerID].lives;
        PlayerText[i].setText(opponment[i-1].toString());
        players_string[i] = opponment[i-1];
        //display kills
        //Get the list of KillList[], compare with all the opponmentIDs
        //increment the "count" if there is a match with each opponmentID
        //"count" will be the total number of kills.

        var count = 0;
        var x;
        for(x = 0; x<killList.length;x++)
        {
            if(killList[x]==opponmentID[i-1])
                count++;
        }
        KillText[i].setText(count.toString());
        Kill_value[i] = count;
    }
}

function totalplayersleft()
{
    //check for sole survior
    var y, counter = 0;
    for(y = 0; y<Lives_value.length;y++)
    {
        if(Lives_value[y] == 0)
            counter++;
    }

    if(counter == Lives_value.length-1)
    {
        var largest = Math.max.apply(Math, Lives_value);
        var a = Lives_value.indexOf(largest);
        LText[0].setText("Last player left: "+players_string[a]);
    }
    else
    {
        LText[0].setText("Total players left: "+(Lives_value.length-1).toString());
    }



}


function checkiflast()
{

if(Lives_value.length>1)
{
        //check for all players dead
        var y, counter = 0;
        for(y = 1; y<Lives_value.length;y++)
        {
            if(Lives_value[y] == 0)
                counter++;
        }

        if(counter == Lives_value.length-1)
        {
            gameover(1);
            totalplayersleft();
            mostkills();
        }
}
}

function mostkills()
{
    var largest = Math.max.apply(Math, Kill_value);
    var idx = Kill_value.indexOf(largest);
    ScoreText[0].setText("Highest Number of kills: "+players_string[idx]);

}

function autoRefresh(refreshPeriod) {
    setTimeout("window.location.reload();",refreshPeriod);
}
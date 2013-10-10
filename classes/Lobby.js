"use strict"; 
 
function Lobby(){
	var stage;
	var root;
	
	var pm;
	var player;
	var playerID;
	var character;
	
	var begin;
	var login;
	var charSelect;
	var mainLobby;
	
	this.start = function() {	
		zebra.ready(function(){
			pm = new PlayerManager();
			// build Zebra stage 
			stage = new zebra.ui.zCanvas(700,400);
			root    = stage.root;
			root.setBackground("yellow");
			
			//panel for startup
			showStart();		

		})
    }
	
	var setCookie = function(cookieName,playerID,validity) {
		var exp=new Date();
		exp.setDate(exp.getDate() + validity);
		var cookieValue=escape(playerID) + ((validity==null) ? "" : "; expires="+exp.toUTCString());
		document.cookie=cookieName + "=" + cookieValue;
	}
	
	var getCookie = function(cookieName){
		var cookie = document.cookie;
		var cookieIndex_start = cookie.indexOf(" " + cookieName + "=");
		if (cookieIndex_start == -1) {
			cookieIndex_start = cookie.indexOf(cookieName + "=");
		}
		if (cookieIndex_start == -1) {
			cookie = null;
		} else {
			cookieIndex_start = cookie.indexOf("=", cookieIndex_start) + 1;
			var cookieIndex_end = cookie.indexOf(";", cookieIndex_start);
			if (cookieIndex_end == -1){
				cookieIndex_end = cookie.length;
			}
			cookie = unescape(cookie.substring(cookieIndex_start,cookieIndex_end));
		}
		return cookie;
	}
	
	var showStart = function(){
		begin = new zebra.ui.Panel(zebra.ui.MouseListener,[function mouseClicked(e) {
			begin.setVisible(false);
			if (isReturningPlayer()){
				//display a different panel
				//remember to retrieve player's name
				//TODO:playerManager.getPlayerById(id);
				console.log("cookie value= "+retrieveReturningPlayer());
			}else{
				showLogin();
			}
		}]);
		begin.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		begin.setBounds(10,10, 680, 380);
		root.add(begin);
		begin.add(zebra.layout.CENTER,new zebra.ui.Label("Click Game Area to begin!"));
	}
	
	var showLogin = function(){
		login = new zebra.ui.Panel();
		login.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		login.setBounds(10,10, 680, 380);
		root.add(login);
		var prompt = new zebra.ui.Label("Name your character: ");
		login.add(zebra.layout.CENTER,prompt);		
		var userInputTF = new zebra.ui.TextField();
		userInputTF.setPSByRowsCols(2,15); 
		login.add(zebra.layout.CENTER,userInputTF);
		var nextButton =  new zebra.ui.Button("Next",zebra.ui.MouseListener,[function mouseClicked(e){
			login.setVisible(false);			
			player = userInputTF.getValue();
			playerID = pm.addPlayer(player);
			setCookie("player",playerID,1);
			console.log(player + " " + playerID);
			showSelectChar();
		}]);
		nextButton.setFireParams(true,-1);
		login.add(zebra.layout.CENTER,nextButton);
	}
	
	var showSelectChar = function(){
		charSelect = new zebra.ui.Panel();
		charSelect.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.HORIZONTAL, 2));
		charSelect.setBounds(10,10, 680, 380);
		root.add(charSelect);
		prompt = new zebra.ui.Label("Select your character: ");
		charSelect.add(zebra.layout.CENTER,prompt);
		var devilz = new zebra.ui.ImagePan("images/devilz.png",zebra.ui.MouseListener,[function mouseClicked(e){
			charSelect.setVisible(false);
			character = "devilz";			
			pm.setChar(playerID,character);
			console.log("selected devilz,"+pm.getChar(playerID));
			showMainLobby();
		}]);
		var shroom = new zebra.ui.ImagePan("images/shroom.png",zebra.ui.MouseListener,[function mouseClicked(e){
			charSelect.setVisible(false);
			character = "shroom";			
			pm.setChar(playerID,character);
			console.log("selected shroom,"+pm.getChar(playerID));
			showMainLobby();
		}]);
		var pompkin = new zebra.ui.ImagePan("images/pompkin.png",zebra.ui.MouseListener,[function mouseClicked(e){
			charSelect.setVisible(false);
			character = "pompkin";			
			pm.setChar(playerID,character);
			console.log("selected pompkin,"+pm.getChar(playerID));
			showMainLobby();
		}]);
		var human = new zebra.ui.ImagePan("images/human.png",zebra.ui.MouseListener,[function mouseClicked(e){
			charSelect.setVisible(false);
			character = "human";				
			pm.setChar(playerID,character);
			console.log("selected human,"+pm.getChar(playerID));
			showMainLobby();
		}]);
		charSelect.add(zebra.layout.CENTER,pompkin);
		charSelect.add(zebra.layout.CENTER,human);
		charSelect.add(zebra.layout.CENTER,devilz);
		charSelect.add(zebra.layout.CENTER,shroom);
	}
	
	var showMainLobby = function(){
		mainLobby = new zebra.ui.Panel();
		mainLobby.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		mainLobby.setBounds(10,10, 680, 380);
		root.add(mainLobby);
		var prompt = new zebra.ui.Label("Welcome, " + pm.getPlayerById(playerID));
		var prompt2 = new zebra.ui.Label("Your Character is:" + pm.getChar(playerID));
		mainLobby.add(zebra.layout.CENTER,prompt);
		mainLobby.add(zebra.layout.CENTER,prompt2);
	}
	
	var isReturningPlayer = function() {
		var player=getCookie("player");
		if (player!=null && player!="") {
			return true;
		} else {
			return false;
		}
	}
	
	var retrieveReturningPlayer = function() {
		var player=getCookie("player");
		return player;
	}
	
	var newPlayer = function() {
	
	}
}
 
// Load lobby after 0.5s, wait for libraries
var lobby = new Lobby();
setTimeout(function() {lobby.start();}, 500);

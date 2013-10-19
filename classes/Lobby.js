"use strict"; 
 
function Lobby(){
	var socket;

	var stage;
	var root;
	
	var player;
	var playerName;
	var playerID;
	var character;
	var avatar;
	var map;
	var session;
	
	var loading;
	var begin;
	var login;
	var charSelect;
	var mainLobby;
	var selectMap;
	
	var lg_flag = false; //this flag is to help mark the login frame so that it only needs to be loaded once, after which just be toggled visible
	var cs_flag = false; //this flag is to help mark the charSelect frame so that it only needs to be loaded once, after which just be toggled visible
	var allSessions = new Array();
	var sessionCount;
	
	/*
     * private method: sendToServer(msg)
     *
     * The method takes in a JSON structure and send it
     * to the server, after converting the structure into
     * a string.
	 *
	 * adapted from PongClient.js
     */
    var sendToServer = function (msg) {
        socket.send(JSON.stringify(msg));
    }	
		
    /*
     * private method: initNetwork(msg)
     *
     * Connects to the server and initialize the various
     * callbacks.
     */
	 
    var initNetwork = function() {
        // Attempts to connect to game server
        try {
            socket = new SockJS("http://localhost:4001/SaveHer");
            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);
                switch (message.type) {
				
					case "new_player":
						playerID = message.playerID;
						setCookie("player",playerID,1);
						console.log(playerName + " " + playerID);
						break;
					case "relog_player":	
						player = message.player;
						playerName = message.playerName;
						character = message.character;
						avatar = message.avatar;
						session = message.session;
						console.log("received relog_player "+player+" "+playerName+" "+character+" "+avatar+" "+session);
						showMainLobby();
						break;
					case "join_game":
						console.log("joining game...");
						$(stage.canvas).fadeOut();
						connectGame();
						break;
					case "new_game":
						session = message.sessionID;
						console.log("received new_game from server, sessionID = #" + session);
						$(stage.canvas).fadeOut();
						connectGame();
						break;
					case "PlayerNotFound":
						showLogin();
						break;
					case "get_all_sessions":
						sessionCount=0;
						allSessions = message.allSessions;
						//console.log("received all sessions, checking now:");
						for (var j = 0; j < allSessions.length; j++){
							if (allSessions[j]!= undefined){
								sessionCount++;
							}
						}
						break;
				}
            }
        } catch (e) {
            console.log("Failed to connect to " + "http://" + Pong.SERVER_NAME + ":" + Pong.PORT);
        }
    }
		
    /*
     * private method: showStart()
     *
     * The first frame to show when browser loads.
	 * Player is asked to click anywhere in the game area to proceed.
	 *
     */
	
	var showStart = function(){
		//prepare loading screen, set invisible
		loading = new zebra.ui.Panel();
		loading.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		loading.setBounds(10,10, 680, 380);
		loading.setVisible(false);
		root.add(loading);
		loading.add(zebra.layout.CENTER,new zebra.ui.Label("Game Loading..."));
		
		//starting screen
		begin = new zebra.ui.Panel(zebra.ui.MouseListener,[function mouseClicked(e) {
			begin.setVisible(false);
			if (isReturningPlayer()){
				playerID = retrieveReturningPlayer();
				//connect to loginServer to retrieve player's name
				//TODO
				sendToServer({type:"relog_player", playerID:playerID}); 
			}else{
				showLogin();
			}
		}]);
		begin.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		begin.setBounds(10,10, 680, 380);
		root.add(begin);
		begin.add(zebra.layout.CENTER,new zebra.ui.Label("Click Game Area to begin!"));

	}	
	
    /*
     * private method: showLogin()
     *
     * If it is a new player, he will be asked to input a name here.
	 * Based on the name, the loginServer will help to create a new player.
	 *
     */
	
	var showLogin = function(){
		if(!lg_flag){
			lg_flag = true;
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
				playerName = userInputTF.getValue();
				newPlayer(playerName);
				showSelectChar();
			}]);
			nextButton.setFireParams(true,-1);
			login.add(zebra.layout.CENTER,nextButton);
		}
		else{
			login.setVisible(true);
		}
	}
	
    /*
     * private method: showLogin()
     *
     * Player is asked to choose his character here.
	 * Player can change character multiple times so it is important to note that:
	 * Each time this frame is shown, it should not be "new" again. Want to just toggle 
	 * it on and off by setVisible(). Thus a cs_flag is used to check if this is the first
	 * time this frame is displayed, if yes: load everything from scratch, else: toggle visible true.
	 *
     */
	
	var showSelectChar = function(){
		if (!cs_flag){
			cs_flag = true;
			charSelect = new zebra.ui.Panel();
			charSelect.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.HORIZONTAL, 2));
			charSelect.setBounds(10,10, 680, 380);
			root.add(charSelect);
			prompt = new zebra.ui.Label("Select your character: ");
			charSelect.add(zebra.layout.CENTER,prompt);
			var devilz = new zebra.ui.ImagePan("images/devilz.gif",zebra.ui.MouseListener,[function mouseClicked(e){
				charSelect.setVisible(false);
				character = "devilz";
				avatar = "images/devilz.gif";
				sendToServer({type:"set_char", playerID:playerID,character:character}); 
				console.log("selected devilz");
				showMainLobby();
			}]);
			var shroom = new zebra.ui.ImagePan("images/shroom.gif",zebra.ui.MouseListener,[function mouseClicked(e){
				charSelect.setVisible(false);
				character = "shroom";			
				avatar = "images/shroom.gif";
				sendToServer({type:"set_char", playerID:playerID,character:character}); 
				console.log("selected shroom");
				showMainLobby();
			}]);
			var pompkin = new zebra.ui.ImagePan("images/pompkin.gif",zebra.ui.MouseListener,[function mouseClicked(e){
				charSelect.setVisible(false);
				character = "pompkin";			
				avatar = "images/pompkin.gif";
				sendToServer({type:"set_char", playerID:playerID,character:character}); 
				console.log("selected pompkin");
				showMainLobby();
			}]);
			var human = new zebra.ui.ImagePan("images/human.gif",zebra.ui.MouseListener,[function mouseClicked(e){
				charSelect.setVisible(false);
				character = "human";		
				avatar = "images/human.gif";		
				sendToServer({type:"set_char", playerID:playerID,character:character}); 
				console.log("selected human");
				showMainLobby();
			}]);
			charSelect.add(zebra.layout.CENTER,pompkin);
			charSelect.add(zebra.layout.CENTER,human);
			charSelect.add(zebra.layout.CENTER,devilz);
			charSelect.add(zebra.layout.CENTER,shroom);
		} else{
			charSelect.setVisible(true);
		}
	}
	
    /*
     * private method: showMainLobby()
     *
	 * This is where Player selects whether he wants to join an
	 * existing session or create a new game session. 
	 * He can also change his character here.
	 *
     */
	 
	var showMainLobby = function(){	
		//retrieve all sessions, to be displayed later
		var checkSessions = setInterval(function(){sendToServer({type:"get_all_sessions", playerID:playerID})},1000);
		
		mainLobby = new zebra.ui.Panel();
		mainLobby.setLayout(new zebra.layout.RasterLayout(zebra.layout.USE_PS_SIZE));
		mainLobby.setBounds(10,10, 680, 380);
		root.add(mainLobby);
		
		if (character!=""){
			var prompt = new zebra.ui.MLabel("Welcome, " + playerName + ".\nCurrently selected character: " + character + "\n(Click on character to change.)");
			var avatarPan = new zebra.ui.ImagePan(avatar,zebra.ui.MouseListener,[function mouseClicked(e){
				mainLobby.setVisible(false);
				showSelectChar();
			}]);
			avatarPan.setLocation(10,10);
			prompt.setLocation(10,50);
			mainLobby.add(avatarPan);
			mainLobby.add(prompt);		
		} else{
			var prompt = new zebra.ui.Label("Welcome, " + playerName + ".");
			var selectCharButton = 	new zebra.ui.Button("Select Character",zebra.ui.MouseListener,[function mouseClicked(e){
				mainLobby.setVisible(false);
				showSelectChar();
			}]);
			prompt.setLocation(10,10);
			selectCharButton.setLocation(10,50);
			selectCharButton.setFireParams(true,-1);
			mainLobby.add(prompt);
			mainLobby.add(selectCharButton);
		}
		
		
		var subLobby = new zebra.ui.Panel();
		subLobby.setLayout(new zebra.layout.RasterLayout(zebra.layout.USE_PS_SIZE));
		subLobby.setBounds(10,100, 680, 280);
		root.add(subLobby);
		
		//JOIN EXISTING GAME
		var count = 0;
		setInterval(function(){
			if (sessionCount != count){
				count = sessionCount;
				console.log("removing..");
				subLobby.removeAll();
				var yposition = 100;
				for(var i = 0; i < allSessions.length; i++){
					if (allSessions[i]!= undefined){
						console.log("displaying.." + allSessions[i].sessionID);
						var id = allSessions[i].sessionID;
						if (allSessions[i].sessionID == session){
							var s = new zebra.ui.Label(new zebra.data.Text(id.toString()),
							zebra.ui.MouseListener,[function mouseClicked(e){
								subLobby.setVisible(false);
								mainLobby.setVisible(false);
								loading.setVisible(true);
								clearInterval(checkSessions);
								session = this.getValue();
								console.log("rejoin session #" + session);
								sendToServer({type:"join_game", playerID:playerID, sessionID:session}); 
							}]);
							var s2 = new zebra.ui.Label("Last Played: Map " + allSessions[i].map + " (" + allSessions[i].numPlayers + " Players)");
						}
						else{	
							var s = new zebra.ui.Label(new zebra.data.Text(id.toString()),
							zebra.ui.MouseListener,[function mouseClicked(e){		
								subLobby.setVisible(false);
								mainLobby.setVisible(false);
								loading.setVisible(true);
								clearInterval(checkSessions);
								session = this.getValue();
								console.log("join session #" + session);
								sendToServer({type:"join_game", playerID:playerID, sessionID:session}); 
							}]);
							var s2 = new zebra.ui.Label("Map " + allSessions[i].map + " (" + allSessions[i].numPlayers + " Players)");
						}
						s.setLocation(300,yposition);
						s2.setLocation();
						subLobby.add(s);
						subLobby.add(s2);
						yposition += 50;
					}
					
					
				}
			}
		},1000);		
			
		//CREATE NEW GAME
		var newGameButton =  new zebra.ui.Button("Create New Game",zebra.ui.MouseListener,[function mouseClicked(e){
			mainLobby.setVisible(false);	
			subLobby.setVisible(false);
			console.log("new session");
			clearInterval(checkSessions);
			showSelectMap();
		}]);
		newGameButton.setLocation(300, 60);
		newGameButton.setFireParams(true,-1);
		mainLobby.add(newGameButton);
	}
	
    /*
     * private method: showSelectMap()
     *
     * This is where the player choose a new map when he wants to
	 * create a new session. 
	 *
     */
	
	var showSelectMap = function(){
		selectMap = new zebra.ui.Panel();
		selectMap.setLayout(new zebra.layout.FlowLayout(zebra.layout.CENTER,zebra.layout.CENTER,zebra.layout.VERTICAL, 2));
		selectMap.setBounds(10,10, 680, 380);
		root.add(selectMap);
		var prompt = new zebra.ui.Label("Select Map:");
		var mapC1 = new zebra.ui.ImagePan("images/map1.png",zebra.ui.MouseListener,[function mouseClicked(e){
			selectMap.setVisible(false);
			loading.setVisible(true);
			map = 1;
			console.log("selected map 1");
			newGame();
		}, function mouseEntered(e){
			hoverC0.setVisible(false);
			hoverC1.setVisible(true);
		}, function mouseExited(e){
			hoverC1.setVisible(false);
			hoverC0.setVisible(true);
		}]);
		var mapC2 = new zebra.ui.ImagePan("images/map2.png",zebra.ui.MouseListener,[function mouseClicked(e){
			selectMap.setVisible(false);
			loading.setVisible(true);
			map = 2;
			console.log("selected map 2");
			newGame();
		}, function mouseEntered(e){
			hoverC0.setVisible(false);
			hoverC2.setVisible(true);
		}, function mouseExited(e){
			hoverC2.setVisible(false);
			hoverC0.setVisible(true);
		}]);
		var mapC3 = new zebra.ui.ImagePan("images/map3.png",zebra.ui.MouseListener,[function mouseClicked(e){
			selectMap.setVisible(false);
			loading.setVisible(true);
			map = 3;
			console.log("selected map 3");
			newGame();
		}, function mouseEntered(e){
			hoverC0.setVisible(false);
			hoverC3.setVisible(true);
		}, function mouseExited(e){
			hoverC3.setVisible(false);
			hoverC0.setVisible(true);
		}]);
		var hoverC0 = new zebra.ui.Label();
		var hoverC1 = new zebra.ui.Label("Map 1");
		var hoverC2 = new zebra.ui.Label("Map 2");
		var hoverC3 = new zebra.ui.Label("Map 3");
		selectMap.add(mapC1);
		selectMap.add(mapC2);
		selectMap.add(mapC3);
		selectMap.add(hoverC0);
		selectMap.add(hoverC1);
		selectMap.add(hoverC2);
		selectMap.add(hoverC3);
		hoverC1.setVisible(false);
		hoverC2.setVisible(false);
		hoverC3.setVisible(false);
	}
	
	
    /*
     * private method: connectGame()
     *
     * TODO
	 *
     */
	
	var connectGame = function(){
		
		var game = new Game();
	
	}
	
    /*
     * private method: newGame()
     *
     * TODO
	 *
     */
	
	var newGame = function(){
	
		sendToServer({type:"new_game", playerID:playerID, ownerID:playerID, map:map}); 
		
	}
	
    /*
     * private method: setCookie()
     *
     * When a new player is created, a cookie is also saved.
	 * Cookie contains player's ID, so that can detect when he 
	 * reconnects to the server.
	 *
     */
	
	var setCookie = function(cookieName,playerID,validity) {
		var exp=new Date();
		exp.setDate(exp.getDate() + validity);
		var cookieValue=escape(playerID) + ((validity==null) ? "" : "; expires="+exp.toUTCString());
		document.cookie=cookieName + "=" + cookieValue;
	}
	
    /*
     * private method: getCookie()
     *
     * When browser is open, checks if player has played before 
	 * within the day. If yes, skip showLogin() and go
	 * straight to showMainLobby()
	 *
     */
	
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
	
    /*
     * private method: isReturningPlayer()
     *
     * Using the cookie, determine if a player has played before 
	 * within the day. If yes, skip showLogin() and go
	 * straight to showMainLobby()
	 *
     */
	
	var isReturningPlayer = function() {
		var p=getCookie("player");
		if (p!=null && p!="") {
			return true;
		} else {
			return false;
		}
	}
	
    /*
     * private method: retrieveReturningPlayer()
     *
     * Using the cookie, determine if a player has played before 
	 * within the day. Get his playerID from cookie.
	 *
     */	
	
	var retrieveReturningPlayer = function() {
		var pid=getCookie("player");
		return pid;
	}
	
	
    /*
     * private method: newPlayer()
     *
     * If a player is new, just send a message to the server
	 * to notify and setup the necessary variables associated with
	 * the player
	 *
     */
	
	var newPlayer = function(playerName) {
	
		sendToServer({type:"new_player", player:playerName}); 
	
	}
	
	
	/*
     * public method: start()
     *
     * Basically the entry point to the client
     * 
     */
	 
	this.start = function() {
		//setup connection
		initNetwork();
		
		zebra.ready(function(){
			// build Zebra stage 
			stage = new zebra.ui.zCanvas(700,400);
			root    = stage.root;
			root.setBackground("yellow");
			
			//panel for startup
			showStart();		

		})
    }
	
}
 
// Load lobby after 0.5s, wait for libraries
var lobby = new Lobby();
setTimeout(function() {lobby.start();}, 500);

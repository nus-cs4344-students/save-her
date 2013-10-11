"use strict"; 
 
function Player(name,id){
	var name = name;
	var id = id;
	var character;
	var avatar;
	var map;
	var session;
	
	characer = "";
	avatar = "";
	map = "";
	session = "";
	
	this.setChar = function(chr){
	
		character = chr;
		if (chr == "devilz"){
			avatar = "images/devilz.gif";
		} else if (chr == "pompkin"){
			avatar = "images/pompkin.gif"
		} else if (chr == "human"){
			avatar = "images/human.gif"
		} else if (chr == "shroom"){
			avatar = "images/shroom.gif"
		}
		
	}
	
	this.setMap = function(m,s){
	
		map = m;
		session = s;
		
	}
	
	this.getLastSession = function(){

		return session;
		
	}
	
	this.getChar = function(){
	
		return character;
		
	}
	
	this.getCharAvatar = function(){
	
		return avatar;
		
	}
	
	this.getName = function(){
	
		return name;
		
	}
}

// For node.js require
global.Player = Player;
"use strict"; 
 
function Player(name,id){

	var that = this;
	this.name = name;
	this.id = id;
	this.character;
	this.avatar;
	this.session;
	
	this.character = "";
	this.avatar = "";
	
	this.setChar = function(chr){
	
		that.character = chr;
		if (chr == "devilz"){
			that.avatar = "images/devilz.gif";
		} else if (chr == "pompkin"){
			that.avatar = "images/pompkin.gif"
		} else if (chr == "human"){
			that.avatar = "images/human.gif"
		} else if (chr == "shroom"){
			that.avatar = "images/shroom.gif"
		}
		
	}
		
	this.setSession = function(s){
		
		//set session object
		that.session = s;		
		
	}
	
	this.getLastSession = function(){
		
		//return session object
		return that.session;
		
	}
	
	this.getChar = function(){
	
		return that.character;
		
	}
	
	this.getCharAvatar = function(){
	
		return that.avatar;
		
	}
	
	this.getName = function(){
	
		return that.name;
		
	}
}

// For node.js require
global.Player = Player;
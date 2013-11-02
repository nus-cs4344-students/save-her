"use strict"; 
 
function Player(name,id){


	var that = this;
	this.name = name;
	this.id = id;
	this.character;
	this.session;
	
	this.character = "";
	this.avatar = "";
	
	this.setChar = function(chr){
	
		that.character = chr;
		
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
	
	this.getName = function(){
	
		return that.name;
		
	}
}

// For node.js require
global.Player = Player;
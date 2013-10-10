"use strict"; 
 
function Player(name,id){
	//constructor
	var name = name;
	var id = id;
	var character;
	
	this.setChar = function(chr){
		character = chr;
	}
	
	this.getChar = function(){
		return character;
	}
	
	this.getName = function(){
		return name;
	}
}

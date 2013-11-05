var context;

// music
var gameMusic0 = "Sounds/World0.mp3";
var gameMusic1 = "Sounds/World1.mp3";
var gameMusic2 = "Sounds/World2.mp3";

// sound
var jumpSound = "Sounds/JumpSound.wav";

// bullet sound

var bulletSound = "Sounds/bullet1.wav";

// bullet hit
var bulletHit = "Sounds/bulletHit.wav";

// Specials



// initialise before making any play sounds call
function initSounds(){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
}

// play sound
// not sure if this is slow
function playSound(filename, loop){
    bufferLoader = new BufferLoader(
    	context, [filename],
    	function(buffer){
			var source = context.createBufferSource();
			source.loop = loop;
			source.buffer = buffer[0];
			source.connect(context.destination);
			source.start(0);
		}
	);
  	bufferLoader.load();
}

var context;

// music
var gameMusic = "Sounds/107 Thumbs Up!.mp3";

// sound
var jumpSound = "Sounds/JumpSound.wav";

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
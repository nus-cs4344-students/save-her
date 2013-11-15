var Gamesound = new function()
{




	this.init = function(){
	if (!createjs.Sound.initializeDefaultPlugins()) {return;}
	createjs.WebAudioPlugin.BASE_PATH = "classes/";
	 createjs.Sound.registerPlugin(createjs.WebAudioPlugin);
			var audioPath = "Sounds/";
			var manifest = [
				{id:"W1", src:audioPath+"World2.mp3"},
				{id:"W2", src:audioPath+"World3.mp3"},
				{id:"W3", src:audioPath+"World1.mp3"},
				{id:"jump", src:audioPath+"JumpSound.wav"},
				{id:"bulletSound", src:audioPath+"bullet1.wav"},
				{id:"bulletHit", src:audioPath+"bulletHit.wav"},
				{id:"special1", src:audioPath+"pompkin.wav"},//pompkin
				{id:"special2", src:audioPath+"human.wav"},//human
				{id:"special3", src:audioPath+"devil.wav"},//devil
				{id:"special4", src:audioPath+"shroom.wav"},
				{id:"explode", src:audioPath+"explode.wav"}

			];
			
			createjs.Sound.addEventListener("fileload", handleLoad);
			createjs.Sound.registerManifest(manifest);
		}

		function handleLoad(event) {
			console.log("Sound loaded");
		}
		this.play = function(id)
		{
			console.log(id);
			createjs.Sound.play(id);
		}
		this.playloop = function(id)
		{
			console.log(id);
			createjs.Sound.play(id,{interrupt: createjs.Sound.INTERRUPT_ANY, loop:-1});
		}
}

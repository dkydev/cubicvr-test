// TODO: fix all of this...

function bodyLoaded()
{
	canvas = document.getElementById("canvas");
	canvas.tabIndex = 1;
	
	loadJSON("data/sprites.json", function(data) {
		var spriteSheets = JSON.parse(data);
		for (var i = 0; i < spriteSheets.length; i++) {
			spriteMap[spriteSheets[i].name] = spriteSheets[i];
		}	
		jsonLoaded();
	});
	
};

function loadJSON(filename, callback)
{
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
	xobj.open('GET', filename, true);
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function jsonLoaded()
{
	require([
		"src/lib/CubicVR.min.js",
		"src/GameClient",
		"src/system/System",
		"src/system/ActionSystem",
		"src/system/InputSystem",
		"src/system/MotionSystem",
		"src/system/RenderSystem",
		"src/system/SpriteSystem",
		"src/component/Component",
		"src/component/InputComponent",
		"src/component/MotionComponent",
		"src/component/PlayerActionComponent",
		"src/component/RenderComponent",
		"src/component/SpriteComponent",
		"src/entity/Entity",
		"src/entity/BarrelEntity",
		"src/entity/PlayerEntity",
		"src/entity/BoxEntity"
	], function(a) {
		initClient();
	});
}

var client;
var spriteMap = {};
var canvas;
function initClient()
{
	client = new GameClient(canvas);
	client.start();
}
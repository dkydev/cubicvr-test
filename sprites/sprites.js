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


var spriteMap = {};
loadJSON("sprites.json", function(data) {
	var spriteSheets = JSON.parse(data);
	for (var i = 0; i < spriteSheets.length; i++) {
		spriteMap[spriteSheets[i].name] = spriteSheets[i];
	}	
	jsonLoaded();
});

/**************************************************************************************************************************************/

function RenderSystem()
{
	this.name = "render";
	this.entities = [];
	this.update = function()
	{
		this.entities.forEach(function(entity) {
			
			entity.render.sceneObject.x = entity.x;
			entity.render.sceneObject.y = entity.y+1;
			entity.render.sceneObject.z = entity.z;
			
		});
	}
	this.addEntity = function(entity)
	{
		if (entity.render && entity.render.sceneObject) {
			this.entities.push(entity);
			scene.bindSceneObject(entity.render.sceneObject);
		}
	}
}

function SpriteSystem()
{
	this.name = "sprite";
	this.entities = [];
	this.update = function()
	{
		var frame;
		var animation;
		this.entities.forEach(function(entity) {
			if (entity.sprite.animationEnabled) {
				animation = entity.sprite.spriteSheet.animations[entity.sprite.currentAnimation];		
				frame = animation[entity.sprite.currentFrame];				
				entity.sprite.currentFrameCount++;
				if (entity.sprite.currentFrameCount > frame.frames) {
					entity.sprite.currentFrameCount = 0;
					entity.sprite.currentFrame++;
					if (entity.sprite.currentFrame > animation.length - 1) {
						entity.sprite.currentFrame = 0;
					}
				}
				entity.render.sceneObject.getInstanceMaterials()[0].uvOffset = [frame.x / entity.sprite.spriteSheet.imageWidth, 0];
			}
		});
	}
	this.addEntity = function(entity)
	{
		if (entity.sprite && entity.render) {
			this.entities.push(entity);
		}
	}
}

function MotionSystem()
{
	this.name = "motion";
	this.entities = [];	
	this.update = function()
	{
		this.entities.forEach(function(entity) {
			
			entity.x += entity.motion.vx;
			entity.y += entity.motion.vy;
			entity.z += entity.motion.vz;
			
			entity.motion.vy -= entity.motion.gravity;
			if (entity.y < 0) {
				entity.y = 0;
				entity.motion.vy = 0;
			}
		});
	}
	this.addEntity = function(entity)
	{
		if (entity.motion) {
			this.entities.push(entity);
		}
	}
}

function InputSystem()
{	
	var self = this;
	this.name = "input";
	this.entities = [];	
	this.inputs = {};	
	this.key = {};	
	this.entityKeyAction = {};	
	this.init = function(element) {
		element.addEventListener("keydown", this.keyDown);		
		element.addEventListener("keyup", this.keyUp);		
	};
	this.keyDown = function(event) {		
		var value = 1;
		if (self.key[event.keyCode] != value) {
			self.key[event.keyCode] = value;
			if (self.entityKeyAction[event.keyCode]) {
				self.entityKeyAction[event.keyCode].forEach(function(keyAction) {
					keyAction.entity.action[keyAction.action] = value;                    
				});
			}
			event.preventDefault();
			return false;
		}
	}
	this.keyUp = function(event) {		
		var value = 0;		
		self.key[event.keyCode] = value;
		if (self.entityKeyAction[event.keyCode]) {
			self.entityKeyAction[event.keyCode].forEach(function(keyAction) {
				keyAction.entity.action[keyAction.action] = value;
			});
		}
		event.preventDefault();
        return false;
	}	
	this.addEntity = function(entity) {
		if (entity.input && entity.action) {
			this.entities.push(entity);
			for (var key in entity.input.keyActionMap) {
				if (!this.entityKeyAction[key]) {
					this.entityKeyAction[key] = [];
				}
				this.entityKeyAction[key].push({
					entity : entity,
					action : entity.input.keyActionMap[key],
				});
			}
		}		
	}
}
function ActionSystem()
{
	this.name = "action";
	this.entities = [];
	this.update = function() {
		this.entities.forEach(function(entity) {
			entity.action.update(entity);
		});
	};
	
	this.addEntity = function(entity) {	
		if (entity.action) {
			this.entities.push(entity);
		}
	};
}

/**************************************************************************************************************************************/

function RenderComponent(name, type, imagePath, width, height)
{
	this.texture = new CubicVR.Texture(imagePath, CubicVR.enums.texture.filter.NEAREST);
	var size = width/64;
	if (type == "sprite") {
		// this.alpha = new CubicVR.Texture(this.spriteSheet.alphaPath, CubicVR.enums.texture.filter.NEAREST);
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "plane",
					size : size,
					material : {
						textures : { // color  map
							color : this.texture,
							//alpha : this.alpha
						},
						diffuse : [1.0,1.0,1.0],
						specular : [0.1,0.1,0.1]
					},
					uv : {			
						projectionMode : CubicVR.enums.uv.projection.PLANAR,
						projectionAxis : CubicVR.enums.uv.axis.Z,
						scale : [size*width/height,size,1.0],
						center : [0.0,0.0,0.0]
					}
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});	
	}
	if (type == "box") {
		
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "box",
					size : size,
					material : {
						textures: {
							color : this.texture,
						},
					},
					uvmapper : {			
						projectionMode : CubicVR.enums.uv.projection.CUBIC,
						scale : [1.0,1.0,1.0],
					},
					//transform : (new CubicVR.Transform()).scale([1,2,1])
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});
	}
	if (type == "cylinder") {
		
		var height = 0.60;
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "cylinder",
					radius : size * 0.20,
					height : height,
					size : size,
					lon : 8,
					wrapW : 10,
					wrapH : 1,
					material : {
						textures: {
							color : this.texture,
						},
						diffuse : [2,2,2],
						specular : [0.0,0.0,0.0]
					},
					uvmapper : {
						projectionMode : CubicVR.enums.uv.projection.CUBIC,
						projectionAxis : CubicVR.enums.uv.axis.Z,
						scale : [size * 0.20,height,1.0],
					},
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});
		
	}
}

function SpriteComponent(spriteSheet)
{
	this.name = "sprite";
	this.spriteSheet = spriteSheet;
	
	this.animationEnabled = this.spriteSheet.animations ? true : false;
	
	this.currentFrame = 0;
	this.currentFrameCount = 0;
	this.currentAnimation = "idle";
	
	this.setAnimation = function(animation)
	{
		this.currentAnimation = animation;
		this.currentFrame = 0;
		this.currentFrameCount = 0;
	}
}

function MotionComponent(entity)
{
	this.name = "motion";
	this.vx = 0;
	this.vy = 0;
	this.vz = 0;
	this.ax = 0.04;
	this.ay = 0.15;
	this.az = 0.035;
	this.gravity = 0.01;
}

function InputComponent(keyActionMap)
{
	this.name = "input";
	this.keyActionMap = keyActionMap;
}

function ActionComponent()
{
	this.name = "action";	
	this.left 	= 0;
	this.right 	= 0;
	this.up 	= 0;
	this.down 	= 0;
	this.jump 	= 0;
	this.update = function(entity)
	{		
		entity.motion.vx = (this.left - this.right) * entity.motion.ax;
		entity.motion.vz = (this.up - this.down)	* entity.motion.az;
		
		if (this.jump == 1) {
			this.jump = 0;
			if (entity.y == 0) {
				entity.motion.vy = entity.motion.ay;
			}
		}
	}
}

function PlayerActionComponent()
{
	this.name = "action";	
	this.left 	= 0;
	this.right 	= 0;
	this.up 	= 0;
	this.down 	= 0;
	this.jump 	= 0;
	this.update = function(entity)
	{
		if (this.left) {
			entity.render.sceneObject.sclX = 1;
		}
		if (this.right) {
			entity.render.sceneObject.sclX = -1;
		}
		if (this.left || this.right || this.up || this.down) {
			if (entity.sprite.currentAnimation != "walk") {
				entity.sprite.setAnimation("walk");
			}
		} else {
			if (entity.sprite.currentAnimation != "idle") {
				entity.sprite.setAnimation("idle");
			}
		}
		
		entity.motion.vx = (this.left - this.right) * entity.motion.ax;
		entity.motion.vz = (this.up - this.down)	* entity.motion.az;
		
		if (this.jump == 1) {
			this.jump = 0;
			if (entity.y == 0) {
				entity.motion.vy = entity.motion.ay;
			}
		}
	}
}


/**************************************************************************************************************************************/

function Entity(name)
{
	this.name = name;
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

/**************************************************************************************************************************************/

function jsonLoaded()
{
	inputSystem.init(canvas);
	
	player = new Entity("player");
	
	player.render = new RenderComponent(player.name, "sprite", spriteMap["player"].imagePath, spriteMap["player"].spriteWidth, spriteMap["player"].spriteHeight);
	player.sprite = new SpriteComponent(spriteMap["player"]);
	player.motion = new MotionComponent();
	player.action = new PlayerActionComponent();
	player.input = new InputComponent({
		"37" : "left",
		"39" : "right",
		"38" : "up",
		"40" : "down",
		"32" : "jump",
	});
	
	/*
	player.sprite.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel2_spec.png", CubicVR.enums.texture.filter.NEAREST_MIP), CubicVR.enums.texture.map.SPECULAR);
	player.sprite.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel2_normal.png", CubicVR.enums.texture.filter.NEAREST_MIP), CubicVR.enums.texture.map.NORMAL);
	*/
	
	// player.sprite.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/dude_norm.png", CubicVR.enums.texture.filter.NEAREST_MIP), CubicVR.enums.texture.map.NORMAL);
	
	renderSystem.addEntity(player);
	spriteSystem.addEntity(player);
	motionSystem.addEntity(player);
	inputSystem.addEntity(player);
	actionSystem.addEntity(player);
	
	camera.target = player.render.sceneObject.position;
	
	box = new Entity("box");
	box.render = new RenderComponent(box.name, "box", spriteMap["box"].imagePath, spriteMap["box"].spriteWidth, spriteMap["box"].spriteHeight);
	box.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/box_bump.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.BUMP);
	// box.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/box_normal.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.NORMAL);
	box.motion = new MotionComponent();
	
	
	barrel = new Entity("barrel");
	barrel.render = new RenderComponent(barrel.name, "cylinder", spriteMap["barrel1"].imagePath, spriteMap["barrel1"].spriteWidth, spriteMap["barrel1"].spriteHeight);
	barrel.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel1_bump.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.BUMP);
	// barrel.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel1_normal.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.NORMAL);
	barrel.motion = new MotionComponent();	
	barrel.action = new ActionComponent();
	barrel.input = new InputComponent({
		"37" : "left",
		"39" : "right",
		"38" : "up",
		"40" : "down",
		"32" : "jump",
	});
	
	
	renderSystem.addEntity(player);
	spriteSystem.addEntity(player);
	motionSystem.addEntity(player);
	inputSystem.addEntity(player);
	actionSystem.addEntity(player);
	
	renderSystem.addEntity(box);
	motionSystem.addEntity(box);
	
	renderSystem.addEntity(barrel);
	motionSystem.addEntity(barrel);
	inputSystem.addEntity(barrel);
	actionSystem.addEntity(barrel);
	
	//barrel = new Entity();
	//barrel.sprite = new SpriteComponent("barrel");
	// barrel.sprite.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel2_spec.png", CubicVR.enums.texture.filter.NEAREST_MIP), CubicVR.enums.texture.map.SPECULAR);
	// barrel.sprite.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel2_spec.png", CubicVR.enums.texture.filter.NEAREST_MIP), CubicVR.enums.texture.map.NORMAL);
	//spriteSystem.addEntity(barrel);
}

var player, box;
var entities = [];
var motionSystem = new MotionSystem();
var renderSystem = new RenderSystem();
var spriteSystem = new SpriteSystem();
var inputSystem = new InputSystem();
var actionSystem = new ActionSystem();

var scene;
var camera;
var mvc;
function webGLStart(gl, canvas)
{
	scene = new CubicVR.Scene();
	camera = new CubicVR.Camera({
		name: "the_camera",
		fov: 60.0,
		position: [0.0,1.8,-4.0],
		target: [0.0,0.5,0.0],
		width: canvas.width,
		height: canvas.height
	});
	var light = new CubicVR.Light({
		name: "the_light",
		type: "point",
		position: [-0.5,0.5,-1.5]
	});	
	
	var roadTexture = new CubicVR.Texture("data/road.png", CubicVR.enums.texture.filter.NEAREST_MIP);
	var road = new CubicVR.SceneObject({
		name : "road",
		mesh : new CubicVR.Mesh({
			primitive : {
				type : "plane",
				material : {
					textures : {
						color   : roadTexture
					},
					diffuse : [1.0,1.0,1.0],
					specular : [0,0,0]
				},
				uv : {			
					projectionMode : CubicVR.enums.uv.projection.PLANAR,
					projectionAxis : CubicVR.enums.uv.axis.Z,
					scale : [0.1,0.1,1.0],
					center : [0.0,0.0,-0.5],
					wrapW: 5,
					wrapH: 2.5
				}
			},
			compile : true
		}),
		rotation : [90.0,0.0,0.0],
		scale : [20.0,20.0,2.0],
		position : [0.0,0.0,0.0]
	});
	
	scene.bindCamera(camera);
	scene.bindLight(light);
	scene.bindSceneObject(road, false, false);
	
	mvc = new CubicVR.MouseViewController(canvas, scene.camera);
	
	CubicVR.addResizeable(scene);
	
	CubicVR.MainLoop(function(timer, gl)
	{
		motionSystem.update();
		actionSystem.update();
		spriteSystem.update();
		renderSystem.update();
		
		/*
		if (player && player.sprite && player.sprite.sceneObject) {
			camera.position[0] = player.sprite.sceneObject.position[0];
			camera.position[1] = player.sprite.sceneObject.position[1] + 1;
			camera.position[2] = player.sprite.sceneObject.position[2] - 3;
		}*/
		
		scene.render();		
	});
}

var canvas = document.getElementById("canvas");
canvas.tabIndex = 1;

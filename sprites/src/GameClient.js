var GameClient = function(canvas)
{	
	this.motionSystem = new MotionSystem();
	this.renderSystem = new RenderSystem();
	this.spriteSystem = new SpriteSystem();
	this.inputSystem = new InputSystem();
	this.actionSystem = new ActionSystem();
	this.entities = [];
	
	
	this.canvas = canvas;
	var self = this;
	this.canvas.addEventListener("keydown", function(event) {
		self.inputSystem.keyDown.call(self.inputSystem, event);
	});        
    this.canvas.addEventListener("keyup", function(event) {
		self.inputSystem.keyUp.call(self.inputSystem, event);
	});
	
}

GameClient.prototype.addEntity = function(entity)
{
	this.motionSystem.addEntity(entity);
	this.renderSystem.addEntity(entity);
	this.spriteSystem.addEntity(entity);
	this.inputSystem.addEntity(entity);
	this.actionSystem.addEntity(entity);
	this.entities.push(entity);
}

GameClient.prototype.start = function()
{
	CubicVR.start(this.canvas, this.webGLStart);
	this.player = new PlayerEntity();
	this.addEntity(this.player);
	//this.addEntity(new BoxEntity());
	//this.addEntity(new BarrelEntity());
}

GameClient.prototype.webGLStart = function(gl, canvas)
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
	
	//camera.target = this.player.render.sceneObject.position;	
	
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
		client.motionSystem.update();
		client.actionSystem.update();
		client.spriteSystem.update();
		client.renderSystem.update();
		
		/*
		if (player && player.sprite && player.sprite.sceneObject) {
			camera.position[0] = player.sprite.sceneObject.position[0];
			camera.position[1] = player.sprite.sceneObject.position[1] + 1;
			camera.position[2] = player.sprite.sceneObject.position[2] - 3;
		}*/
		
		scene.render();		
	});
}
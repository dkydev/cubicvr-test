var BarrelEntity = function()
{
	Entity.call(this, "barrel");
	
	this.render = new RenderComponent(this, this.name, "cylinder", spriteMap["barrel1"].imagePath, spriteMap["barrel1"].spriteWidth, spriteMap["barrel1"].spriteHeight);
	this.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel1_bump.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.BUMP);
	// barrel.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/barrel1_normal.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.NORMAL);
	this.motion = new MotionComponent(this);
	this.input = new InputComponent(this, {
		"37" : "left",
		"39" : "right",
		"38" : "up",
		"40" : "down",
		"32" : "jump",
	});	
}

BarrelEntity.prototype = Object.create(Entity.prototype);
BarrelEntity.prototype.constructor = BarrelEntity;
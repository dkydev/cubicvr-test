var BoxEntity = function()
{
	Entity.call(this, "barrel");
	
	this.render = new RenderComponent(this, this.name, "box", spriteMap["box"].imagePath, spriteMap["box"].spriteWidth, spriteMap["box"].spriteHeight);
	this.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/box_bump.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.BUMP);
	// box.render.sceneObject.getInstanceMaterials()[0].setTexture(new CubicVR.Texture("data/box_normal.png", CubicVR.enums.texture.filter.NEAREST), CubicVR.enums.texture.map.NORMAL);
	this.motion = new MotionComponent(this);
}

BoxEntity.prototype = Object.create(Entity.prototype);
BoxEntity.prototype.constructor = BoxEntity;
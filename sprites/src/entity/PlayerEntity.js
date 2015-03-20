var PlayerEntity = function()
{
	Entity.call(this, "player");
	
	var spriteData = spriteMap["dude2"];
	
	this.render = new RenderComponent(this, spriteData.name, "sprite", spriteData.imagePath, spriteData.spriteWidth, spriteData.spriteHeight);
	this.sprite = new SpriteComponent(this, spriteData);
	this.motion = new MotionComponent(this);
	this.action = new PlayerActionComponent(this);
	this.input = new InputComponent(this, {
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
	
}

PlayerEntity.prototype = Object.create(Entity.prototype);
PlayerEntity.prototype.constructor = PlayerEntity;
var SpriteSystem = function()
{
	System.call(this, "sprite");	
}

SpriteSystem.prototype = Object.create(System.prototype);
SpriteSystem.prototype.constructor = SpriteSystem;

SpriteSystem.prototype.update = function()
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
SpriteSystem.prototype.addEntity = function(entity)
{
	if (entity.sprite && entity.render) {
		this.entities.push(entity);
	}
}
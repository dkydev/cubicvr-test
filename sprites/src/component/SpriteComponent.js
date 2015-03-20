var SpriteComponent = function(entity, spriteSheet)
{
	Component.call(this, "sprite", entity);
	
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

SpriteComponent.prototype = Object.create(Component.prototype);
SpriteComponent.prototype.constructor = SpriteComponent;
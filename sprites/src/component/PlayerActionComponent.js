var PlayerActionComponent = function(entity)
{
	Component.call(this, "playerAction", entity);
	
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

PlayerActionComponent.prototype = Object.create(Component.prototype);
PlayerActionComponent.prototype.constructor = PlayerActionComponent;
var MotionComponent = function(entity)
{
	Component.call(this, "motion", entity);
	
	this.vx = 0;
	this.vy = 0;
	this.vz = 0;
	this.ax = 0.04;
	this.ay = 0.15;
	this.az = 0.035;
	this.gravity = 0.01;
}

MotionComponent.prototype = Object.create(Component.prototype);
MotionComponent.prototype.constructor = MotionComponent;
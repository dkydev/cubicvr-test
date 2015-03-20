var MotionSystem = function()
{
    System.call(this, "motion");
}

MotionSystem.prototype = Object.create(System.prototype);
MotionSystem.prototype.constructor = MotionSystem;

MotionSystem.prototype.update = function()
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
MotionSystem.prototype.addEntity = function(entity)
{
	if (entity.motion) {
		this.entities.push(entity);
	}
}
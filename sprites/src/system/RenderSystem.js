var RenderSystem = function()
{
	System.call(this, "render");
}

RenderSystem.prototype = Object.create(System.prototype);
RenderSystem.prototype.constructor = RenderSystem;

RenderSystem.prototype.update = function()
{
	this.entities.forEach(function(entity) {
		
		entity.render.sceneObject.x = entity.x;
		entity.render.sceneObject.y = entity.y+1;
		entity.render.sceneObject.z = entity.z;
		
	});
}
RenderSystem.prototype.addEntity = function(entity)
{
	if (entity.render && entity.render.sceneObject) {
		this.entities.push(entity);
		scene.bindSceneObject(entity.render.sceneObject);
	}
}
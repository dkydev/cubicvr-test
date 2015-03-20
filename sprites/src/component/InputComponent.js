var InputComponent = function(entity, keyActionMap)
{
	Component.call(this, "input", entity);
	this.keyActionMap = keyActionMap;
}

InputComponent.prototype = Object.create(Component.prototype);
InputComponent.prototype.constructor = InputComponent;
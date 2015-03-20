var System = function(name)
{
	this.name = name;
	this.entities = [];
}
System.prototype.update = function() {};
System.prototype.addEntity = function(entity) {};
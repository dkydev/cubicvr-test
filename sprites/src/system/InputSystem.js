var InputSystem = function()
{    
    System.call(this, "input");
    
    this.self = this;
    this.inputs = {};
    this.key = {};
    this.entityKeyAction = {};
}

InputSystem.prototype = Object.create(System.prototype);
InputSystem.prototype.constructor = InputSystem;

InputSystem.prototype.keyDown = function(event)
{
    var value = 1;
    if (this.key[event.keyCode] != value) {
        this.key[event.keyCode] = value;
        if (this.entityKeyAction[event.keyCode]) {
            this.entityKeyAction[event.keyCode].forEach(function(keyAction) {
                keyAction.entity.action[keyAction.action] = value;                    
            });
        }
        event.preventDefault();
        return false;
    }
}
InputSystem.prototype.keyUp = function(event)
{
    var value = 0;        
    this.key[event.keyCode] = value;
    if (this.entityKeyAction[event.keyCode]) {
        this.entityKeyAction[event.keyCode].forEach(function(keyAction) {
            keyAction.entity.action[keyAction.action] = value;
        });
    }
    event.preventDefault();
    return false;
}    
InputSystem.prototype.addEntity = function(entity)
{
    if (entity.input && entity.action) {
        this.entities.push(entity);
        for (var key in entity.input.keyActionMap) {
            if (!this.entityKeyAction[key]) {
                this.entityKeyAction[key] = [];
            }
            this.entityKeyAction[key].push({
                entity : entity,
                action : entity.input.keyActionMap[key],
            });
        }
    }        
}
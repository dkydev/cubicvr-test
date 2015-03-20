var RenderComponent = function(entity, name, type, imagePath, width, height)
{
	Component.call(this, "render", entity);
	
	this.texture = new CubicVR.Texture(imagePath, CubicVR.enums.texture.filter.NEAREST);
	var size = width/64;
	if (type == "sprite") {
		// this.alpha = new CubicVR.Texture(this.spriteSheet.alphaPath, CubicVR.enums.texture.filter.NEAREST);
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "plane",
					size : size,
					material : {
						textures : { // color  map
							color : this.texture,
							//alpha : this.alpha
						},
						diffuse : [1.0,1.0,1.0],
						specular : [0.1,0.1,0.1]
					},
					uv : {			
						projectionMode : CubicVR.enums.uv.projection.PLANAR,
						projectionAxis : CubicVR.enums.uv.axis.Z,
						scale : [size*width/height,size,1.0],
						center : [0.0,0.0,0.0]
					}
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});	
	}
	if (type == "box") {
		
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "box",
					size : size,
					material : {
						textures: {
							color : this.texture,
						},
					},
					uvmapper : {			
						projectionMode : CubicVR.enums.uv.projection.CUBIC,
						scale : [1.0,1.0,1.0],
					},
					//transform : (new CubicVR.Transform()).scale([1,2,1])
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});
	}
	if (type == "cylinder") {
		
		var height = 0.60;
		this.sceneObject = new CubicVR.SceneObject({
			name : name,
			mesh : new CubicVR.Mesh({
				primitive : {
					type : "cylinder",
					radius : size * 0.20,
					height : height,
					size : size,
					lon : 8,
					wrapW : 10,
					wrapH : 1,
					material : {
						textures: {
							color : this.texture,
						},
						diffuse : [2,2,2],
						specular : [0.0,0.0,0.0]
					},
					uvmapper : {
						projectionMode : CubicVR.enums.uv.projection.CUBIC,
						projectionAxis : CubicVR.enums.uv.axis.Z,
						scale : [size * 0.20,height,1.0],
					},
				},
				compile : true
			}),
			position : [0.0,0.0,0.0]
		});
		
	}
}

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

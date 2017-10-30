
var Element = imports("element/");

var Renderer = function(){
		
}

Renderer.prototype = {
	
	renderer : function(data , template , selector){
		
		var html = template , _this = this;
		
		
		html = html.replace(new RegExp("\\{\\{(.*)\\}\\}" , "g") , function(name){
			
			return _this.getData(data , name.replace(/[\{|\}]/g,""));
			
		});
		
		this.template = template;
		
		this.selector = selector;
		
		this.data = data;
		
		Element.get(selector).append(html);
		
		this.bindEvent();
		
		return this;
		
	},
	
	getData : function(data , str){
		
		return str.split(".").reduce(function(prev , curr){
				
			return prev[curr];
			
		} , data);
		
	},
	
	bindEvent : function(){
		
		var data = this.data;
		
		var _this = this;
		
		var temp = this.template;
		
		var selector = this.selector;
		
		
		Element.get( "*" , Element.get(this.selector)[0]).each(function(node , i){
			
			var newAttrs = [];
			
			var nodeAttributes = Array.prototype.slice.call(node.attributes);
				
			
			for(var i = 0 , len = nodeAttributes.length; i < len; i++){
				
				var attr = nodeAttributes[i];
				
				var attrs , value , attrName;
				
				attrs = attr.name.match(/\*(.*)/g);
				
				if(attrs && attrs.length){
					attrName = attrs[0].replace(/\*/g , "");
					value = attr.value;
					if(attrName == "if"){
						if(!_this.getData(data , value)){
							node.parentNode.removeChild(node);
							break;
						}
					}
				}

				
				
				attrs = attr.name.match(/\((.*)\)/g);
				
				if(attrs && attrs.length){
					
					var eventName = attrs[0].replace(/[\(|\)]/g , "");
				
					value = attr.value.replace("$" , "");
				
					var callBack = eval("(function(event){data." + value  + ";_this.renderer(data , temp , selector)})")
				
					node.addEventListener(eventName , callBack , false);
				}
				
				
				attrs = attr.name.match(/\[(.*)\]/g);
				
				
				if(attrs && attrs.length){
					
					attrName = attrs[0].replace(/[\[|\]]/g , "");
				
					value = attr.value;
				
					newAttrs.push({
						name : attrName,
						value : _this.getData(data , value)
					})
				}

				
			}
			
			
			newAttrs.forEach(function(attrData){
				
				if(attrData['value'] === false){
					node.removeAttribute(attrData['name']);
				}else{
					node.setAttribute(attrData['name'] , attrData['value']);
				}
				
				
			})
			
		})
		
		
	}

	
}


exports = (function(){
	
	return new Renderer;
	
})();

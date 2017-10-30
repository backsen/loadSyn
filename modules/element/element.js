
var _Element = function(selector , parentNode){
	
	return _Element.prototype.get(selector , parentNode);
	
}

_Element.prototype = {
	
	get : function(selector , parentNode){
		
		parentNode = parentNode || document;
				
		this.doms = Array.prototype.slice.call(parentNode.querySelectorAll(selector));
		
		var that = this;
		
		return this.each(function(node , i){
			
			that[i] = node;
			
		});
		
	},
	
	append : function(html){
		
		return this.each(function(node){
			node.innerHTML = html;
			
		});
		
	},
	
	click : function(){
		
		
	},
	
	each : function(callback){
		
		this.doms.forEach(function(node , i){
			
			callback && callback(node , i);
			
		})

		
		return this;
		
	}
	
	
	
	
}

var Element = {
	
	get : function(selector , parentNode){
		
		return new _Element(selector , parentNode)
		
	},
	addStyles : function(styles){
		
		if(typeof styles == "string"){
			
			styles = [styles];
			
		}
		
		styles.forEach(function(styleText , i){
			
			var styleTag = document.createElement("style");
			
			styleTag.textContent = styleText;
			
			document.head.appendChild(styleTag);
			
		})
		
		
	}
	
}


exports = Element;

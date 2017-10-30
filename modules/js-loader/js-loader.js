
loadScript  = function(src , module){
		
	var ajax = new XMLHttpRequest;
			
	try{
		
		ajax.onload = function(){
		
			if(ajax.status == 200){
				
				var importsArrs = ajax.responseText.match(/imports\((.*)\)/gm) || [];
				
				var devs = [];
				
				for(var i = 0 , len = importsArrs.length; i < len; i++){
					
					devs.push(importsArrs[i].replace(/imports\((.*)\)/g , "$1"));
					
				}
				
				module['devs'] = devs;
				
				var currentPath = module.src;
				
				var scriptCode = ajax.responseText.replace(/imports\((.*)\)/gm , `imports($1 , currentPath)`);
				
				
				var callBack = new Function("module" , "exports" , "imports" , "currentPath" ,`
					imports.route = module.src;
					${scriptCode};
					module = module;
					module.exports = !exports.isExports ? exports : module.exports;
					return module;
				`);
									
				module = callBack(module , {isExports : true} , imports , currentPath);
				
				delete callBack;
				
				module.loaded = true;	
				
			}else if(ajax.status == 404 && src.indexOf("index.js") == -1){
									
				src = src.substr(0 , src.lastIndexOf(".js")) + "/index.js";
				
				module['src'] = src;
				
				module.exports = loadScript(src, module);
									
			}else{
				
				module.exports = `${ajax.status} -- ${ajax.statusText}`;
				
			}
			
			
		}
		
		ajax.onerror = function(){
			
			return false;
			
		}
		
		ajax.open("GET" , src , false);
		
		ajax.send(null);
		
		return module.exports;

		
		
	}catch(e){
		
		console.error(e);
		
	}

	return module.exports;
	
}

exports = loadScript;
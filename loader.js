(function(window){
	
	
	var allModules = window.allModules =  {},
	
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
			//TODO handle the exception
			
			console.error(e);
			
		}
	
		return module.exports;
		
	},
	
	src = "/",
	
	getSrc = function(path , src , after){
		
		
		var rootPath = location.origin + location.pathname.substr(0 , location.pathname.lastIndexOf("/")) + "/" ,
			currentPath = path ? path.substr(0 , path.lastIndexOf("/")) + "/" : rootPath, url = currentPath;
		
		
		if( /^\.\//.test(src)){
			
			url = currentPath;
			src = src.replace("./" , "");
			
		}else if(/^(http|https):\/\//.test(src)){
			
			url = "";
			
		}else if(/^\.\.\//.test(src)){
			
			url = currentPath;
			
		}else{
			
			url = rootPath;
						
			var paths = loader.config.paths || {} , 
			
			isModule = true;
		
			for(var name in paths){
				
				var srcPath = src.split("/");
				
				if(srcPath[0] == name){
					
					isModule = false;
					
					if(srcPath[0] != paths[name]){
						
						srcPath[0] = paths[name];
					
						src = srcPath.join("/");
						
					}
					
					
				}
				
				
			}
			
			if(isModule && src != "loader.config.js") src = "modules/" + src;

			
		}
		
		url += src;
				
		
		if(url[url.length - 1] == "/") url += "index.js";
		
		if((!after || after == "js") && url.lastIndexOf(".js") == -1) url += "." + after || ".js";
				
		
		return url;
		
	},
	
	imports = function(moduleUrl , currentPath){
		
		
		var type = getFileType(moduleUrl) || "js";
		
		var src = getSrc(currentPath || imports.route , moduleUrl , type);
		
		if(allModules[src] && allModules[src]['loaded']){
			return allModules[src].exports;
		}
		
		var module = allModules[src] = {
			loaded : false,
			name : moduleUrl,
			src : src,
			exports :{},

		}
				
		var myLoaders = loader.config.loaders;
		
		if(myLoaders && myLoaders[type] && type != "js"){
			
			return imports(myLoaders[type] + "/")(module.src, module);
			
		}else{
			
			return loadScript(module.src, module);
		}
		
			
	},
	
	getFileType = function(url){
		
		var type = "" , types = loader.config['fileTypes'] || ["js" , "json" , "css" , "html"];
		
		for(var i = 0 , len = types.length; i <len; i++){
			
			if(new RegExp("\." + types[i] + "$" , "gim").test(url)){
				
				type = types[i];
				
			}
			
		}
		
		return type;		
		
	},
		
	bootloader = function(){
			
		var config = imports("loader.config.js");
		
		
		loader.loaders = {};
		
		for(var name in config){
			
			loader.config[name] = config[name];
			
			
		}
		
		loader.config['loaders'] = loader.config['loaders'] || {};
		
		for(var name in loader.config.loaders){
			loader.loaders[name] = imports(loader.config.loaders[name] + "/");
		}			
		
		
		if(config['main']){
			imports.route = "";
			imports(config.main);
		}
		
				
	},
	
	loader = {
		
		config : {
			loaders : {
				"json" : "json-loader",
				"js" : "js-loader"
			},
			fileTypes : ["js" , "json" , "css" , "html"]
		},
		
		loaders : {},
		
		bootloader : bootloader		
	};
	
	imports.route = "/";
	
	loader.bootloader();
	
	window.imports = imports;
	
	
})(window)

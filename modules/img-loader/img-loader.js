
var xhr = imports("xhr/")


exports = function(url , module){
	
	xhr.get({
		
		url : url,
		asyn : false,
		success : function(result){
			
			data = result;
			
			module.exports = url;
			
			module.loaded = true;
			
		}
		
	})
		
	return module.exports;
	
}

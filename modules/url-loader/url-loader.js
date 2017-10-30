
var xhr = imports("xhr/")


exports = function(url , module){
	
	var data = {};
	
	xhr.get({
		
		url : url,
		asyn : false,
		success : function(result){
			
			data = result;
						
			module.exports = data;
			
			module.loaded = true;
			
		}
		
	})
		
	return data;
	
}

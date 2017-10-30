
var setRequestHeader = function(xhr , options){
		
	if(xhr.readyState == 0 && options){
		
		for(var i in options){
			
			xhr.setRequestHeader(i , options[i]);
			
		}
	}

};


var xhr = {
	
	get : function(options){
		
		var ajax = new XMLHttpRequest;
		
		setRequestHeader(ajax , options.headers);
		
		ajax.onload = function(){
			options.success(ajax.responseText);
			
		}
		
		ajax.onerror = function(e){
			
			options.error(e);
			
		}
		
		ajax.open("GET" ,options.url , options.asyn === undefined ? true : options.asyn);
		
		ajax.send(null)
		
	}
	
}

exports = xhr;

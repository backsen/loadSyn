
var Promise = imports("promise/")

var Http = function(){
		
	if(typeof Promise !== "function"){
		throw TypeError("Http 依赖有效的 Promise 模块")
	};
	
	var resolveCallback , rejectCallback , progressCallback , startCallback
	
	toPromise = new Promise(function(resolve , reject , progress , start){
		
		resolveCallback = resolve;
		rejectCallback = reject;
		progressCallback = progress;
		startCallback = start;
		
	}),
	
	setRequestHeader = function(xhr , options){
		
		if(xhr.readyState == 0 && options){
			
			for(var i in options){
				
				xhr.setRequestHeader(i , options[i]);
				
			}
		}
	
	};
	
	this.toPromise = function(){
		return toPromise;
	};
	
	this.post = function(url , data , requestOptions){
		
		var xhr = new XMLHttpRequest;
		
		var datas = {};
		
		data.forEach(function(value , key){
			datas[key] = value;
		})
		
		xhr.open("POST" , url , true);
		
		setRequestHeader(xhr , requestOptions);
		
		xhr.onloadstart = function(){
			startCallback();
		}
		
		xhr.onload = function(event){
			
			resolveCallback({
				"body" : xhr.responseText,
				"status" : xhr.status,
				"data" : datas
			});
			
		}
		
		xhr.upload.onprogress = function(event){
			
			progressCallback(event);
			
		}
		
		xhr.onerror = function(event){
			
			rejectCallback(event);
			
		}
			
		
		xhr.send(data);
		
		return this;
		
	}
	
	this.get = function(url , requestOptions){
		
		var xhr = new XMLHttpRequest;
				
		xhr.open("GET" , url , true);
		
		setRequestHeader(xhr , requestOptions);
		
		xhr.onloadstart = function(){
			startCallback();
		}
		
		xhr.onload = function(event){
			
			resolveCallback({
				"body" : xhr.responseText,
				"status" : xhr.status,
				"data" : datas
			});
			
		}
		
		xhr.upload.onprogress = function(event){
			
			progressCallback(event);
			
		}
		
		xhr.onerror = function(event){
			
			rejectCallback(event);
			
		}
			
		
		xhr.send(null);
		
		return this;
		
	}
	
}

exports = Http;
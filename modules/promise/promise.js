var Promise = function(fn){
		
	var state = null,
	
		value = null,
		
		deferreds = [],
		
		resolve,
		
		reject,
		
		handle,
		
		finale,
		
		progressCallback,
		
		startCallback,
		
		doResolve,
		
		errorMsg = null,
		
		self = this;

	this.progressCallback = function(){}
	
	this.startCallback = function(){};
	
	this.then = function(fulfilled , rejected){
								
		return new self.constructor(function(resolve, reject){
			
			handle(new Handler(fulfilled , rejected , resolve , reject));
							
		})
		
	}
	
	this.catch = function(callback){
		
		
		return this.then(null , callback);
		
		
		return this;
		
	}

	this.start = function(callBack){
		
		this.startCallback = callBack;
		
		return this;
		
	}
	
	this.progress = function(callBack){
		
		this.progressCallback = callBack;
		
		return this;
		
	}
	
	progressCallback = function(result){
		
		self.progressCallback(result);
		
	}
	
	startCallback = function(result){
		
		self.startCallback(result);
		
	}
	
	handle = function(handler){
		
		if(state === null){
			
			deferreds.push(handler);
			
			return;
		}
		
		var cd = state ? handler.fulfilled : handler.rejected;
		
		if(cd === null){
			
			(state ? handler.resolve : handler.reject)(value);
			return;
		}
		
		var res;
		
		try{
			
			res = cd(value);
			
		} catch (e){
			
			errorMsg = e;
			
			handler.reject(e);
			
        		return;
			
		}
		
		handler.resolve(res);
		
	}
	
	resolve = function(result){
		
		try{
			
			state = true;
    			value = result;
    			finale();
    			
		}catch(e){
			
			reject(e);
			
		}

	}
	
	reject = function(result){
		
		errorMsg = result;
	
		throw(`(in promise) ${result}` );
		
		state = false;
    		value = result;
    		finale();

	}
	
	finale = function(){
		
		for (var i = 0, len = deferreds.length; i < len; i++) handle(deferreds[i]);
		
    		deferreds = [];
    		
	}

	
	function Handler( fulfilled , rejected, resolve, reject){
		
		this.fulfilled = typeof fulfilled === "function" ? fulfilled : null;
		this.rejected = typeof rejected === "function" ? rejected : null;
		
		this.resolve = resolve;
		this.reject = reject;
		
	}
	
	fn && fn(resolve.bind(this) , reject.bind(this) , progressCallback.bind(this) , startCallback.bind(this));
	
	
};


exports = Promise;
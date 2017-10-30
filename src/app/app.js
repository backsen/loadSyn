
var Renderer = imports("renderer/")

var Element = imports("element/");

var app = function(){
	
	var selector = "app-root";
	
	var styles = [imports("./app.css")];
	
	var template = imports("./app.html");
	
	var userData = imports("datas/data.json");
	
	this.hiddenAge = true;
	
	this.data = userData;
	
	this.showUserImg = false;
	
	this.hideBtn = false;
		
	Element.addStyles(styles);
	
	Renderer.renderer(this , template , selector);	
	
}

app.prototype.showAge = function(event , str){
		
	this.data.showAge = "backsen今年快" + this.data.age + "岁了";
	
	this.hiddenAge = false;
	
	this.showUserImg = true;
	
	this.hideBtn = true;
	
	var img = imports(this.data.userImg);
	
	this.img = img;
	
}


exports = function(){
	
	return new app();
	
};

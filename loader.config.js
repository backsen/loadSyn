exports = {
	
	main : "./src/main.js",
	
	paths : {
		
		"datas" : "/datas",
		"assets" : "/src/assets"
		
	},
	
	fileTypes : ["js" , "json" , "css" , "html" , "jpg" , "png" , "gif"],
	
	loaders : {
		
		"json" : "json-loader",
		"js" : "js-loader",
		"html" : "url-loader",
		"css" : "url-loader"	,
		"jpg" : "img-loader",
		"png" : "img-loader",
		"gif" : "img-loader"
	}
	
}

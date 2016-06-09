var fs = require('fs-extra')
var path = require('path');

var filesToCopy = process.argv[2];
filesToCopy = filesToCopy.substr(1,filesToCopy.length-2);
filesToCopy = filesToCopy.split(",");

var destinyFolder = process.argv[3];
console.log(__dirname+filesToCopy[0]);
filesToCopy.forEach(function(file){
	var nameFile = path.basename(file);
	console.log(' --> [copied] => '+nameFile);
	fs.copySync(__dirname+'\\'+file,__dirname+'\\'+destinyFolder+'\\'+nameFile);
});
var path = require('path');

var Package = require('dgeni').Package;

module.exports = new Package('api', [
	require('dgeni-markdown')
])
.config(function(readFilesProcessor) {
	// Specify the base path used when resolving relative paths to source files
	readFilesProcessor.basePath = path.resolve(__dirname, '../dist/es5');

	// Specify collections of source files that should contain the documentation to extract
	readFilesProcessor.sourceFiles = [
		{
			// Process all js files in `src` and its subfolders ...
			include: '**/*.js',
			basePath: readFilesProcessor.basePath
		}
	];
})
.config(function(writeFilesProcessor) {
	// Specify where the writeFilesProcessor will write our generated doc files
	writeFilesProcessor.outputFolder = path.resolve(path.resolve(__dirname, '.'), './api');
});
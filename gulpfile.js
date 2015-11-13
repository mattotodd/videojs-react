'use strict';

var require = require || {};
var gulp = require('gulp');
var webpack = require('webpack-stream');
 
var webpack_module = {
	loaders: [
		{
		    test: /\.jsx?$/, 
		    exclude: /node_modules/, 
		    loader: 'babel-loader', 
		    query:{presets:['es2015', 'react']}
		}
	],
	resolve: {
		extensions: ['', '.js', '.jsx', '.json']
	}
}
gulp.task('scripts', function()  {
    gulp.src('./src/video.jsx')
	  .pipe(webpack({
	    watch: false,
	    module: webpack_module,
	    output: {
        	filename: 'video.js',
        }
	  }))
	  .pipe(gulp.dest('lib/'));

	gulp.src('./src/example/example.jsx')
	  .pipe(webpack({
	    watch: false,
	    module: webpack_module,
	    output: {
        	filename: 'example.js',
        }
	  }))
	  .pipe(gulp.dest('lib/'));
});
	
gulp.task('build', ['scripts']);
gulp.task('default', ['build']);


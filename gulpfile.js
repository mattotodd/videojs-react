'use strict';

var require = require || {};
const gulp = require('gulp');
const webpack = require('gulp-webpack');
 
gulp.task('scripts', () => {
    return gulp.src('./src/video.jsx')
	  .pipe(webpack({
	    watch: false,
	    module: {
	      loaders: [
	        {
                test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader', 
                query:{presets:['es2015', 'react']}
            }
	      ],
	    },
	    output: {
        	filename: 'index.js',
        }
	  }))
	  .pipe(gulp.dest('lib/'));
});
	
gulp.task('build', ['scripts']);
gulp.task('default', ['build']);


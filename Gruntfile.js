'use strict';

module.exports = function(grunt){

	require('jit-grunt')(grunt,{
		useminPrepare: 'grunt-usemin'
	});

	grunt.initConfig({
		watch : {
	  		livereload: {
	            options: {
	                livereload: '<%= connect.options.livereload %>'
	            },
	            files: [
	                'dist/{,*/}*.html'
	            ]
	      	}
	  	},
		connect: {
	      options: {
	        port: 9001,
	        hostname: 'localhost',
	        livereload: 35729
	      },
	      prod: {
	        options: {
	          open: true,
	          base:{
           		path: 'dist',
	            options: {
	                index: 'index.html'
	            }
	          }
	        }
	      }
	    },
	    clean: {
	        build:{
	            src: [ 'dist/']
	        }
	    },
	    useminPrepare: {
	        html: 'app/index.html',
	        options: {
	            dest: 'dist'
	        }
	    },
	      // Concat
	    concat: {
	        options: {
	            separator: ';'
	        },
	        // dist configuration is provided by useminPrepare
	        dist: {}
	    },
	      // Uglify
	    uglify: {
	        // dist configuration is provided by useminPrepare
	        dist: {}
	    },
	    cssmin: {
	        dist: {}
	    },
	    usemin: {
	        html: ['dist/*.html'],
	        css: ['dist/styles/*.css'],
	        options: {
	            assetsDirs: ['dist', 'dist/styles']
	        }
	    },copy: {
	      dist: {
	        cwd: 'app',
	        src: [ '**','!styles/**/*.css','!scripts/**/*.js' ],
	        dest: 'dist',
	        expand: true
	      }
	  	}
	});
	grunt.registerTask('build',[
		'clean',
		'useminPrepare',
		'concat',
		'cssmin',
		'copy'
	]);
	grunt.registerTask('default',['connect','watch']);
};
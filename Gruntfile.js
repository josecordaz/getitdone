'use strict';

module.exports = function(grunt){
	//require('time-grunt')(grunt);

	require('jit-grunt')(grunt,{
		useminPrepare: 'grunt-usemin'
	});

	grunt.initConfig({
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
	    /*uglify: {
	        // dist configuration is provided by useminPrepare
	        dist: {},
	        compress:{
	        	unused : false
	        }
	    },*/
	    /*cssmin: {
	        dist: {}
	    },*/
	    usemin: {
	        html: ['dist/*.html'],
	        css: ['dist/styles/*.css'],
	        options: {
	            assetsDirs: ['dist', 'dist/styles']
	        }
	    },
	    copy: {
	      dist: {
	        cwd: 'app',
	        src: [ '**','!styles/**/*.css','!scripts/**/*.js' ],
	        dest: 'dist',
	        expand: true
	      }
	  	},
	  	watch : {
			//copy: {
	        //    files: [ 'app/**', '!app/**/*.css', '!app/**/*.js'],
	        //    tasks: [ 'build' ]
	        //},
	        //scripts: {
	        //    files: ['app/scripts/app.js'],
	        //    tasks:[ 'build']
	        //},
	        //styles: {
	        //    files: ['app/styles/mystyles.css'],
	        //    tasks:['build']
	        //},
	  		livereload: {
	            options: {
	                livereload: '<%= connect.options.livereload %>'
	            },
	            files: [
	                'app/{,*/}*.html',
	                '.tmp/styles/{,*/}*.css'
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
           		path: '.',
	            options: {
	                index: 'index.html'
	            }
	          }
	        }
	      }
	    }
	});
	grunt.registerTask('build',[
		'clean',
		'useminPrepare',
		'concat',
		//'cssmin',
		//'uglify',
		'copy',
		'usemin'
	]);
	grunt.registerTask('prod',['build','connect:prod','watch']);

	grunt.registerTask('default',['connect:prod','watch']);
};
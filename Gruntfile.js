module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "ptr.js", "ptr.min.js", "ptr.css", "ptr.min.css" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: ".sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * *\n' +
                ' * PullToRefresh *\n' +
                ' * Version <%= pkg.version %> *\n' +
                ' * License:  MIT *\n' +
                ' * SimonWaldherr *\n' +
                ' * * * * * * * * */\n\n',
        footer: '\n\n\n\n /* foo */'
      },
      dist: {
        files: {
          './ptr.min.js': ['./ptr.js']
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* * * * * * * * *\n' +
                  ' * PullToRefresh *\n' +
                  ' * Version <%= pkg.version %> *\n' +
                  ' * License:  MIT *\n' +
                  ' * SimonWaldherr *\n' +
                  ' * * * * * * * * */\n\n'
        },
        files: {
          './ptr.min.css': ['./ptr.css']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'ptr.min.js', dest: '/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['uglify', 'cssmin', 'compare_size']);
};

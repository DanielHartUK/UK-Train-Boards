module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          'css/style.css': 'src/sass/style.scss',
        },
      },
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require( 'autoprefixer' )({ browsers: ['last 1 version'] })
        ]
      },
      dist: {
        src: 'css/style.css'
      }
    },

    uglify: {
      script: {
        files: {
          'js/script.min.js': 'src/js/script.js',
          'js/departures.min.js': 'src/js/departures.js',
          'js/departuresDetailed.min.js': 'src/js/departuresDetailed.js',
          'js/arrivals.min.js': 'src/js/arrivals.js'
        }
      }
    },

    watch: {
      styles: {
        files: 'src/sass/*.scss',
        tasks: ['sass', 'postcss']
      },
      script: {
        files: 'src/js/*.js',
        tasks: ['uglify']
      },
    },

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register tasks
  grunt.registerTask('default', ['sass', 'postcss', 'uglify', 'watch']);

};
'use strict';


module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {

      options: {
        jshintrc: '.jshintrc',
        ignores: [
          '*.min.js',
          'node_modules/**/*',
          'coverage/**/*'
        ]
      },

      all: [
        '*.js',
        '**/*.js'
      ],

    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('lint', 'jshint:all');


};

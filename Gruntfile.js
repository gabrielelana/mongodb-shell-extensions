module.exports = function(grunt) {

  var chalk = require('grunt-attention/node_modules/chalk')

  grunt.initConfig({
    bower_concat: {
      dist: {
        dest: '.work/bower_components.js'
      }
    },
    concat: {
      dist: {
        dest: '.dist/mongorc.js',
        src: ['.work/*.js', 'src/**/*.js']
      }
    },
    copy: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: process.env.HOME + '/.mongorc.js',
      }
    },
    attention: {
      installed: {
        options: {
          borderColor: 'bgGreen',
          message: 
            chalk.green.bold('MongoDB shell extensions installed in your home directory (see <%= copy.dist.dest %>)') + "\n" +
            chalk.green('next time you\'ll open your mongo shell you\'ll have all the extensions automatically loaded')
        }
      }
    },
    clean: ['.work', '.dist']
  });

  grunt.loadNpmTasks('grunt-bower-concat')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-attention')

  // TODO: jshint
  // TODO: automatic tests
  grunt.registerTask('build', ['clean', 'bower_concat', 'concat'])
  grunt.registerTask('install', ['build','copy', 'attention:installed'])
  grunt.registerTask('default', ['build'])
}

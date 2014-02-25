/* jshint camelcase: false */

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
        dest: (process.env.HOME || process.evn.HOMEPATH || process.env.USERPROFILE) + '/.mongorc.js',
      }
    },
    attention: {
      installed: {
        options: {
          borderColor: 'bgGreen',
          message:
            chalk.green.bold('MongoDB shell extensions installed in your home directory\n') +
            chalk.green('(see <%= copy.dist.dest %>) \n\n') +
            chalk.green('Next time you\'ll open your mongo shell you\'ll have all the extensions automatically loaded')
        }
      }
    },
    release: {
      options: {
        bump: true,
        add: true,
        commit: true,
        commitMessage: 'Release <%= version %>',
        tag: true,
        tagName: '<%= version %>',
        tagMessage: 'Release <%= version %>',
        push: true,
        pushTags: true,
        npm: true
      }
    },
    clean: ['.work', '.dist']
  });

  grunt.loadNpmTasks('grunt-bower-concat')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-attention')
  grunt.loadNpmTasks('grunt-release')

  // TODO: jshint
  // TODO: automatic tests
  grunt.registerTask('build', ['clean', 'bower_concat', 'concat'])
  grunt.registerTask('install', ['build', 'copy', 'attention:installed'])
  grunt.registerTask('default', ['build'])

  grunt.registerTask('release-and-tag', ['bump-readme:minor', 'release:minor'])
  grunt.registerTask('fix-and-tag', ['bump-readme:patch', 'release:patch'])

  grunt.registerTask('bump-readme', 'Bump version in README.md', function(howToBump) {
    var readme = grunt.file.read('README.md'),
        pkg = grunt.file.readJSON('package.json')

    readme = readme.replace(new RegExp('download/' + pkg.version), function(match) {
      return 'download/' + require('semver').inc(pkg.version, howToBump || 'patch')
    })
    grunt.file.write('README.md', readme)
  })
}

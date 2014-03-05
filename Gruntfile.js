/* jshint camelcase: false */

module.exports = function(grunt) {

  var chalk = require('grunt-attention/node_modules/chalk')

  grunt.initConfig({
    install_at: (process.env.HOME || process.evn.HOMEPATH || process.env.USERPROFILE) + '/.mongorc.js',
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
      release: {
        src: '<%= concat.dist.dest %>',
        dest: '<% copy.released.dest %>'
      },
      builded: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= install_at %>',
      },
      released: {
        src: './released/mongorc.js',
        dest: '<%= install_at %>',
      }
    },
    attention: {
      installed: {
        options: {
          borderColor: 'bgGreen',
          message:
            chalk.green.bold('MongoDB shell extensions installed in your home directory\n') +
            chalk.green('(see <%= install_at %>) \n\n') +
            chalk.green('Next time you\'ll open your mongo shell you\'ll have all the extensions automatically loaded')
        }
      }
    },
    jshint: {
      options: grunt.file.readJSON('.jshintrc'),
      all: ['Gruntfile.js', 'spec/**/*.js', 'src/**/*.js']
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
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-attention')
  grunt.loadNpmTasks('grunt-release')

  grunt.registerTask('build', ['clean', 'jshint', 'bower_concat', 'concat'])

  grunt.registerTask('install-head', ['build', 'copy:builded', 'attention:installed'])
  grunt.registerTask('install-released', ['copy:released', 'attention:installed'])

  grunt.registerTask('spec', ['spec-on-head'])
  grunt.registerTask('spec-on-head', ['build', 'run-all-specs:head'])
  grunt.registerTask('spec-on-installed', ['run-all-specs:installed'])

  grunt.registerTask('release-and-tag', ['copy:release', 'release:minor'])
  grunt.registerTask('fix-and-tag', ['copy:release', 'release:patch'])

  grunt.registerTask('default', ['spec'])



  grunt.registerTask('run-all-specs', 'Run all specs in MongoDB Shell', function(onWhat) {
    var done = this.async(),
        path = require('path'),
        spawn = require('child_process').spawn,
        fileToLoad = (onWhat || 'head') === 'head' ? path.join(__dirname, './.dist/mongorc.js') : null,
        commandArguments = fileToLoad ? ['--quiet', fileToLoad, '_runner.js'] : ['--quiet', '_runner.js'],
        runner = spawn('mongo', commandArguments, {cwd: path.join(__dirname, 'spec')})

    runner.stdout.on('data', function(data) {
      grunt.log.write(data.toString())
    })
    runner.stderr.on('data', function(data) {
      grunt.log.error(data.toString())
    })
    runner.on('close', function(code) {
      if (code !== 0) {
        grunt.util.exit(code)
      }
      done()
    })
  })
}

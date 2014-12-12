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
        src: ['.work/*.js', 'src/**/*.js'],
        dest: '.dist/mongorc.js',
        options: {
          process: function (content, srcpath) {
            return content.replace(
              '###version###', grunt.file.readJSON('package.json')['version']
            )
          }
        }
      }
    },
    copy: {
      release: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= copy.released.src %>'
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
        add: false,
        bump: false,
        commit: false,
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

  // To do a release you need to:
  // * change the version in package.json
  // * execute `grunt prepare-release`
  // * execute `git add --all && git commit -m "Release <version>"`
  // * execute `grunt release-and-publish`
  grunt.registerTask('prepare-release', ['build', 'copy:release'])
  grunt.registerTask('release-and-publish', ['release'])

  grunt.registerTask('default', ['spec'])

  // !!! I need to automate this, but it's not easy
  // How to run tests on a different MongoDB
  // * start mongod on a different port with a command like
  //    `~/opt/mongodb-2.2.7/bin/mongod --port 3100
  //    --dbpath .tmp/db --logpath .tmp/log --fork
  //    --quiet --nojournal --noprealloc --smallfiles
  //    `
  // * change the task spec definition to `['spec-on-head:3100']`
  // * run `grunt spec`

  grunt.registerTask('run-all-specs', 'Run all specs in MongoDB Shell', function(onWhat, onPort) {
    var done = this.async(),
        path = require('path'),
        spawn = require('child_process').spawn,
        fileToLoad = (onWhat || 'head') === 'head' ?
          path.join(__dirname, './.dist/mongorc.js') :
          grunt.config('install_at'),
        portToConnectTo = (onPort ? onPort : '27017'),
        commandArguments = ['--quiet', '--port', portToConnectTo, fileToLoad, '_runner.js'],
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

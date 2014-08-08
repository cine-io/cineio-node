
module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    watch:
      grunt:
        files: ["Gruntfile.coffee"]

      coffee:
        files: ["src/*.coffee"]
        tasks: ["coffee"]

      test:
        files: ["test/**/*.js"]
        tasks: ["mochaTest"]

    coffee:
      compile:
        files:
          './index.js': ['src/*.coffee']

    mochaTest:
      test:
        options:
          reporter: 'spec'
        src: ['test/**/*.js']

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks("grunt-contrib-watch")
  grunt.loadNpmTasks('grunt-mocha-test')

  grunt.registerTask('default', 'mochaTest');

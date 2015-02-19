var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      vendor: {
        files: [
          {
            expand: true, cwd: 'node_modules/bootstrap/',
            src: ['js/**', 'less/**'], dest: 'assets/vendor/bootstrap/'
          },
          {
            expand: true, cwd: 'node_modules/backbone/',
            src: ['backbone.js'], dest: 'assets/vendor/backbone/'
          },
          {
            expand: true, cwd: 'node_modules/font-awesome/',
            src: ['fonts/**', 'less/**'], dest: 'assets/vendor/font-awesome/'
          },
          {
            expand: true, cwd: 'node_modules/html5shiv/dist/',
            src: ['html5shiv.js'], dest: 'assets/vendor/html5shiv/'
          },
          {
            expand: true, cwd: 'node_modules/jquery/dist/',
            src: ['jquery.js'], dest: 'assets/vendor/jquery/'
          },
          {
            expand: true, cwd: 'node_modules/jquery.cookie/',
            src: ['jquery.cookie.js'], dest: 'assets/vendor/jquery.cookie/'
          },
          {
            expand: true, cwd: 'node_modules/moment/',
            src: ['moment.js'], dest: 'assets/vendor/momentjs/'
          },
          {
            expand: true, cwd: 'node_modules/respond.js/src/',
            src: ['respond.js'], dest: 'assets/vendor/respond/'
          },
          {
            expand: true, cwd: 'node_modules/underscore/',
            src: ['underscore.js'], dest: 'assets/vendor/underscore/'
          }
        ]
      },
      backboneapp: {
        files: [
          {
            expand: true, cwd: 'assets/views/',
            src: ['index.min.js'], dest: 'www/'
          },
          {
            expand: true, cwd: 'assets/views/about/',
            src: ['*.jade'], dest: 'www/views/about/'
          },
          {
            expand: true, cwd: 'assets/views/account/**/',
            src: ['*.jade'], dest: 'www/views/account/**/'
          },
          {
            expand: true, cwd: 'assets/views/admin/**/',
            src: ['*.jade'], dest: 'www/views/admin/**/'
          },
          {
            expand: true, cwd: 'assets/views/contact/',
            src: ['*.jade'], dest: 'www/views/contact/'
          },
          {
            expand: true, cwd: 'assets/views/http/',
            src: ['*.jade'], dest: 'www/views/http/'
          },
          {
            expand: true, cwd: 'assets/views/login/**/',
            src: ['*.jade'], dest: 'www/views/login/**/'
          },
          {
            expand: true, cwd: 'assets/views/signup/',
            src: ['*.jade'], dest: 'www/views/signup/'
          },
        ]
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "www/index.html": ["assets/views/*.jade"]
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: function(filePath) {
          return filePath + '.map';
        }
      },
      layouts: {
        files: {
          'assets/layouts/core.min.js': [
            'assets/vendor/jquery/jquery.js',
            'assets/vendor/jquery.cookie/jquery.cookie.js',
            'assets/vendor/underscore/underscore.js',
            'assets/vendor/backbone/backbone.js',
            'assets/vendor/bootstrap/js/affix.js',
            'assets/vendor/bootstrap/js/alert.js',
            'assets/vendor/bootstrap/js/button.js',
            'assets/vendor/bootstrap/js/carousel.js',
            'assets/vendor/bootstrap/js/collapse.js',
            'assets/vendor/bootstrap/js/dropdown.js',
            'assets/vendor/bootstrap/js/modal.js',
            'assets/vendor/bootstrap/js/tooltip.js',
            'assets/vendor/bootstrap/js/popover.js',
            'assets/vendor/bootstrap/js/scrollspy.js',
            'assets/vendor/bootstrap/js/tab.js',
            'assets/vendor/bootstrap/js/transition.js',
            'assets/vendor/momentjs/moment.js',
            'assets/layouts/core.js'
          ],
          'assets/layouts/ie-sucks.min.js': [
            'assets/vendor/html5shiv/html5shiv.js',
            'assets/vendor/respond/respond.js',
            'assets/layouts/ie-sucks.js'
          ],
          'assets/layouts/admin.min.js': ['assets/layouts/admin.js']
        }
      },
      views: {
        files: [{
          expand: true,
          cwd: 'assets/views/',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'assets/views/',
          ext: '.min.js'
        }]
      }
    },
    jshint: {
      assets: {
        options: {
          jshintrc: '.jshintrc-assets',
          ignores: [
            'assets/layouts/**/*.min.js',
            'assets/views/**/*.min.js'
          ]
        },
        src: [
          'assets/layouts/**/*.js',
          'assets/views/**/*.js'
        ]
      }
    },
    less: {
      options: {
        compress: true
      },
      layouts: {
        files: {
          'assets/layouts/core.min.css': [
            'assets/less/bootstrap-build.less',
            'assets/less/font-awesome-build.less',
            'assets/layouts/core.less'
          ],
          'assets/layouts/admin.min.css': ['assets/layouts/admin.less']
        }
      },
      views: {
        files: [{
          expand: true,
          cwd: 'assets/views/',
          src: ['**/*.less'],
          dest: 'www/views/',
          ext: '.min.css'
        }]
      }
    },
    clean: {
      js: {
        src: [
          'assets/layouts/**/*.min.js',
          'assets/layouts/**/*.min.js.map',
          'www/views/**/*.min.js',
          'www/views/**/*.min.js.map'
        ]
      },
      css: {
        src: [
          'assets/layouts/**/*.min.css',
          'www/views/**/*.min.css'
        ]
      },
      vendor: {
        src: ['assets/vendor/**']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-newer');

  //grunt.registerTask('default', ['copy:vendor', 'newer:uglify', 'newer:less', 'concurrent']);
  grunt.registerTask('build', ['copy:vendor', 'jade', 'uglify', 'less', 'copy:backboneapp']);
  grunt.registerTask('lint', ['jshint']);
};

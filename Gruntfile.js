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
      fred: {
        files: [
          { expand: true, cwd: 'assets/', src: ['media/*'], dest: 'www/' },
          { expand: true, cwd: 'assets/vendor/font-awesome', src: ['fonts/*'], dest: 'www/' },
          { expand: true, cwd: 'assets/', src: ['favicon.ico'], dest: 'www/' },
          { expand: true, cwd: 'assets/views', src: ['templates.js'], dest: 'www/views/' },
          { expand: true, cwd: 'assets/views/account/', src: ['*.jade'], dest: 'www/views/account/' },
          { expand: true, cwd: 'assets/views/account/settings/', src: ['*.jade'], dest: 'www/views/account/settings/' },
          { expand: true, cwd: 'assets/views/account/verification/', src: ['*.jade'], dest: 'www/views/account/verification/' },
          { expand: true, cwd: 'assets/views/admin/', src: ['*.jade'], dest: 'www/views/admin/' },
          { expand: true, cwd: 'assets/views/admin/accounts/', src: ['*.jade'], dest: 'www/views/admin/accounts/' },
          { expand: true, cwd: 'assets/views/admin/admin-groups/', src: ['*.jade'], dest: 'www/views/admin/admin-groups/' },
          { expand: true, cwd: 'assets/views/admin/administrators/', src: ['*.jade'], dest: 'www/views/admin/administrators/' },
          { expand: true, cwd: 'assets/views/admin/categories/', src: ['*.jade'], dest: 'www/views/admin/categories/' },
          { expand: true, cwd: 'assets/views/admin/statuses/', src: ['*.jade'], dest: 'www/views/admin/statuses/' },
          { expand: true, cwd: 'assets/views/admin/users/', src: ['*.jade'], dest: 'www/views/admin/users/' }
        ]
      }
    },
    jade: {
      compile: {
        options: {
          data: function(dest, src) {
            // Return an object of data to pass to templates
            return grunt.file.readJSON('assets/locals.json');
          }
        },  
        files: {
          "www/index.html": ["assets/layouts/public.jade"],
          "assets/views/header/tmpl-header.html": ["assets/views/header/*.jade"],
          "assets/views/home/tmpl-home.html": ["assets/views/home/*.jade"],
          "assets/views/about/tmpl-about.html": ["assets/views/about/*.jade"],
          "assets/views/cellar/tmpl-cellar.html": ["assets/views/cellar/index.jade"],
          "assets/views/cellar/wines/tmpl-wines.html": ["assets/views/cellar/wines/index.jade"],
          //"assets/views/cellar/filter/tmpl-filter.html": ["assets/views/cellar/filter/filter.jade"],
          //"assets/views/cellar/paging/tmpl-paging.html": ["assets/views/cellar/paging/paging.jade"],
          "assets/views/login/forgot/tmpl-forgot.html": ["assets/views/login/forgot/*.jade"],
          "assets/views/login/reset/tmpl-reset.html": ["assets/views/login/reset/*.jade"]
        }
      }
    },
    jst: {
      compile: {
        files: {
          "assets/views/templates.js": ["assets/views/**/*.html"]
        }
      }
    },
    uglify: {
      /*options: {
        sourceMap: true,
        sourceMapName: function(filePath) {
          return filePath + '.map';
        }
      },*/
      layouts: {
        files: {
          'www/scripts/vendor.min.js': [
            'assets/vendor/jquery/jquery.js',
            'assets/vendor/jquery.cookie/jquery.cookie.js',
            'assets/vendor/underscore/underscore.js',
            'assets/vendor/backbone/backbone.js',
            //'assets/vendor/bootstrap/js/affix.js',
            //'assets/vendor/bootstrap/js/alert.js',
            'assets/vendor/bootstrap/js/button.js',
            'assets/vendor/bootstrap/js/carousel.js',
            //'assets/vendor/bootstrap/js/collapse.js',
            'assets/vendor/bootstrap/js/dropdown.js',
            //'assets/vendor/bootstrap/js/modal.js',
            //'assets/vendor/bootstrap/js/tooltip.js',
            //'assets/vendor/bootstrap/js/popover.js',
            //'assets/vendor/bootstrap/js/scrollspy.js',
            //'assets/vendor/bootstrap/js/tab.js',
            //'assets/vendor/bootstrap/js/transition.js',
            //'assets/vendor/momentjs/moment.js'
          ],
          'www/scripts/ie-sucks.min.js': [
            'assets/vendor/html5shiv/html5shiv.js',
            'assets/vendor/respond/respond.js',
            'assets/layouts/ie-sucks.js'
          ],
          'www/scripts/admin.min.js': ['assets/layouts/admin.js'],
          'www/scripts/account.min.js': ['assets/layouts/account.js'],
          'www/scripts/public.min.js': ['assets/layouts/public.js'],
          'www/scripts/index.min.js': ['assets/views/index.js']
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
          'www/styles/vendor.min.css': [
            'assets/less/bootstrap-build.less',
            'assets/less/font-awesome-build.less'
          ],
          'www/styles/admin.min.css': ['assets/layouts/admin.less'],
          'www/styles/account.min.css': ['assets/layouts/account.less'],
          'www/styles/public.min.css': ['assets/layouts/public.less'],
          'www/styles/index.min.css': ['assets/views/index.less']
        }
      },
      views: {
        files: [{
          expand: true,
          cwd: 'assets/views/',
          src: ['**/*.less'],
          dest: 'assets/views/',
          ext: '.min.css'
        }]
      }
    },
    clean: {
      js: {
        src: [
          'assets/layouts/**/*.min.js',
          //'assets/layouts/**/*.min.js.map',
          'www/scripts/**/*.min.js',
          //'www/scripts/**/*.min.js.map'
        ]
      },
      css: {
        src: [
          'assets/layouts/**/*.min.css',
          'www/styles/**/*.min.css'
        ]
      },
      vendor: {
        src: ['assets/vendor/**']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-newer');

  //grunt.registerTask('default', ['copy:vendor', 'newer:uglify', 'newer:less', 'concurrent']);
  grunt.registerTask('build', ['copy:vendor', 'jade', 'jst', 'uglify', 'less', 'copy:fred']);
  grunt.registerTask('lint', ['jshint']);
};

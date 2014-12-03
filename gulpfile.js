/* laxcomma: true */
'use strict';

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()

gulp.task('styles', function () {
  var themes = $.filter('themes/*.css');

  return gulp.src([
    'less/style.less'
  //, 'less/themes/*.less'
  ], {base: 'less'})
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer())
    //.pipe($.csso())
    //.pipe(themes)
    //.pipe($.rename({
    //  dirname: '/'
    //, prefix: 'custom_'
    //}))
    //.pipe(themes.restore())
    .pipe(gulp.dest('design'))
    .pipe($.size({showFiles: true}));
});

gulp.task('scripts', function () {
  var dependencies = require('wiredep')()
    , source = $.filter('js/src/**/*.js');

  return gulp.src((dependencies.js || []).concat([
    'js/src/main.js'
  ]))
    .pipe($.plumber())
    .pipe($.concat('custom.js'))
    //.pipe($.uglify())
    .pipe(gulp.dest('js'))
    .pipe($.size({showFiles: true}));
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('less/**/*.less')
    .pipe(wiredep())
    .pipe(gulp.dest('less'));
});

function deploydir(dir) {
  return gulp.src(dir + '/*')
    .pipe($.scp({
      host: 'tkl',
      user: 'root',
      path: '/home/www.qweni.be/themes/qweni-theme/' + dir + '/'
    }));
}

gulp.task('deploystyles', ['styles'], function() {
  return deploydir('design');
});

gulp.task('deployjs', ['scripts'], function() {
  return deploydir('js');
});

gulp.task('deployviews', function() {
  return deploydir('views');
});

gulp.task('deploy', ['deploystyles', 'deployjs', 'deployviews']);

gulp.task('default', ['styles', 'scripts', 'deploy']);

gulp.task('watch',  function () {
  var server = $.livereload();

  gulp.watch([
    'design/*.css'
  , 'js/*.js'
  , 'views/**/*.tpl'
  ], function (file) {
    return server.changed(file.path);
  });

  gulp.watch(['less/**/*.less', 'design/**/*.@(jpg|png)'], ['styles', 'deploystyles']);
  gulp.watch('js/src/**/*.js', ['scripts', 'deployscripts']);
  gulp.watch('views/**/*.tpl', ['deployviews']);
  gulp.watch('bower.json', ['wiredep']);
});

// Expose Gulp to external tools
module.exports = gulp;

// File: Gulpfile.js
'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  inject = require('gulp-inject'),
  wiredep = require('wiredep').stream,
  historyApiFallback = require('connect-history-api-fallback');


// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 9000,
    livereload: true,
    middleware: function(connect, opt) {
      return [historyApiFallback()];
    }
  });
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src(['./app/*.html', './app/views/**/*.html'])
    .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el CSS
gulp.task('css', function() {
  gulp.src('./app/styles/**/*.css')
    .pipe(connect.reload());
});

//Recarga el navegador cuando hay cambios en el js
gulp.task('js', function() {
  gulp.src('./app/scripts/**/*.js')
    .pipe(connect.reload());
});


// Busca los archivos js y css creados y los injecta en el index.html
gulp.task('inject', function() {
  var target = gulp.src('index.html', {
    cwd: './app'
  });
  var sources = gulp.src(['./app/scripts/**/*.js', './app/styles/**/*.css'], {
    read: false
  });
  return target
    .pipe(inject(sources, {
      relative: true
    }))
    .pipe(gulp.dest('./app'));
});


// Buscar las librerias intaladas con bower y la inject en el html
gulp.task('bower', function() {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: 'app/vendor'
    }))
    .pipe(gulp.dest('./app'));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/styles/**/*.css'], ['css']);
  gulp.watch(['./app/scripts/**/*.js'], ['js', 'inject']);
  gulp.watch(['bower.json'], ['bower']);
});


gulp.task('default', ['server', 'inject', 'watch']);
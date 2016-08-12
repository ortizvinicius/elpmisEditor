var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
 
var files = "./src/*.js";
var filesTest = "./test/*";
 
gulp.task('lint', function() {
	gulp.src(files)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});
 
gulp.task('dist', function() {
	gulp.src(files)
	.pipe(concat('./dist'))
	.pipe(rename('elpmisEditor.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
	gulp.src(files)
	.pipe(concat('elpmisEditor.js'))
	.pipe(gulp.dest('./test'));
});

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "./test"
    }
  });
});
 
gulp.task('default', ['lint', 'dist', 'test', 'server', 'watch']);

gulp.task('reload', function(){
	reload();
});

gulp.task('watch', function() {
	gulp.watch([files, filesTest], ['lint', 'dist', 'test', 'reload']);
});
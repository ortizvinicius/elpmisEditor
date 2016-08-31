var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var wrap = require("gulp-wrap");
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var files = {
	watch: "./src/**/*",
	testWatch: "./test/*",
	concat: './src/lib/*.js',
	wrapper: './src/elpmisEditor.js',
	destiny: './dist/elpmisEditor.min.js'
}

gulp.task('lint', function() {
	gulp.src(files.concat)
	.pipe(concat('elpmisEditor.js'))
	.pipe(wrap({src:files.wrapper}))
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});
 
gulp.task('dist', function() {
	gulp.src(files.concat)
	.pipe(concat('elpmisEditor.js'))
	.pipe(wrap({src:files.wrapper}))
	.pipe(gulp.dest('./dist'))
	.pipe(rename('elpmisEditor.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist'));
});

gulp.task('test', function() {
	gulp.src(files.concat)
	.pipe(concat('elpmisEditor.js'))
	.pipe(wrap({src:files.wrapper}))
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
	gulp.watch([files.watch, files.testWatch], ['lint', 'dist', 'test', 'reload']);
});
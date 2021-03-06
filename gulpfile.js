'use strict'

// Libraries
var gulp 				 = require('gulp'),
    sass 				 = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss 	 = require('gulp-minify-css'),
    uglify 			 = require('gulp-uglify'),
    imagemin 		 = require('gulp-imagemin'),
    rename 			 = require('gulp-rename'),
    concat 			 = require('gulp-concat'),
    connect 		 = require('gulp-connect'),
    sftp         = require('gulp-sftp'),
    rimraf 			 = require('rimraf');

// Directories

var dirs = {
	dev: './dev',
	dist: './dist',
	devStyles: './dev/scss',
	distStyles: './dist/css',
	devJS: './dev/js',
	distJS: './dist/js',
	devImages: './dev/img',
	distImages: './dist/img'
};

// Spring Cleanin'

gulp.task('clean:dist', function(cb) {
	rimraf(dirs.dist + '/**/', cb);
});

// Styles

gulp.task('styles', function() {
  return gulp.src(dirs.devStyles + '/**/*.scss', { style: 'expanded' })
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(dirs.distStyles))
});

gulp.task('autoprefixer', ['styles'], function() {
  return gulp.src(dirs.distStyles + '/*.css')
    .pipe(autoprefixer({
        browsers: ['> 1%','last 2 versions', 'Firefox ESR', 'Opera 12.1'],
        cascade: false
    }))
    .pipe(gulp.dest(dirs.distStyles))
    .pipe(connect.reload())
})

// Vendor Scripts

gulp.task('vendor-js', function() {
  return gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/fastclick/lib/fastclick.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.distJS))
});

// Scripts

gulp.task('js', function() {
  return gulp.src(dirs.devJS + '/**/*.js')
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.distJS))
    .pipe(connect.reload())
});

// Images

gulp.task('images', function() {
	 return gulp.src(dirs.devImages + '/**/*')
    .pipe(imagemin({ optimizationLevel: 1 }))
    .pipe(gulp.dest(dirs.distImages))
    .pipe(connect.reload())
});

// HTML

gulp.task('html', function() {
	return gulp.src(dirs.dev + '/*.html')
    .pipe(gulp.dest(dirs.dist))
    .pipe(connect.reload())
});

// Default Task

gulp.task('default', ['clean:dist', 'serve'], function() {
	gulp.start('styles', 'autoprefixer', 'js', 'vendor-js', 'images', 'html', 'watch');
});

// Serve
// Starts a server
// Default Port: 8080
gulp.task('serve', function() {
  return connect.server({
    root: dirs.dist,
    livereload: true
  });
});

// Watch

gulp.task('watch', function() {
  gulp.watch(dirs.devStyles + '/**/*.scss', ['autoprefixer']);
  gulp.watch(dirs.devJS + '/*.js', ['js']);
  gulp.watch(dirs.dev + '/*.html', ['html']);
  gulp.watch(dirs.devImages + '/**/*', ['images']);
});

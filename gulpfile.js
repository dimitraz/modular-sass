var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Live browser reloading
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
});

// Watch
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
    // Refresh the browser if any HTML changes occur
    gulp.watch('*.html', browserSync.reload);
});

// Clean
gulp.task('clean:css', function() {
    return del.sync('css/');
});

// Minify CSS
gulp.task('minify', function() {
    return gulp.src('css/main.css')
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'));
});

// And finally, build tasks
gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    );
});

gulp.task('build', function (callback) {
    runSequence('clean:css', 'sass', 'minify',
        callback
    );
});


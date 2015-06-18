var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    addsrc = require('gulp-add-src'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlify = require('gulp-angular-htmlify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    chmod = require('gulp-chmod'),
    clean = require('gulp-clean');

/*CONFIG*/
var config = { 

    'jsPrimary': [
        "src/js/vendor/jquery/jquery.js"
    ] ,
    'jsVendor' : [
        "src/js/vendor/**/*.js"
    ],
    'jsPartials': [
        "src/js/partials/**/*.js"
    ],
    'jsModule': [
        "src/js/module/**/*.js"
    ],
    'develop': true
};

var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};

/*BOWER*/
    gulp.task('bower', function () {
        require('bower-installer');
    });

/*SUBTASK*/

    gulp.task('js', function () {
        gulp.src(
            config.jsPrimary
            .concat(config.jsVendor)
            .concat(config.jsModule)
            .concat(config.jsPartials))
        .pipe(gulpif( (config.develop === false) , sourcemaps.init() ))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('default.js'))
        .pipe(gulpif( (config.develop === false) , uglify()))
        .pipe(gulpif( (config.develop === false) , sourcemaps.write('default.js.map') ))
        .pipe(gulp.dest("./public"));
    });

    gulp.task('css', function () {
        gulp.src('src/scss/main.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(addsrc.append('./src/css/vendor/**/*.css'))
        .pipe(addsrc.append('./src/css/module/**/*.css'))
        .pipe(autoprefixer())
        .pipe(concat('default.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest("./public"));
    });

    gulp.task('html',function(){
        gulp.src('./src/html/*.html')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('./public/html'));
    });

    gulp.task('img',function(){
        gulp.src('./src/img/**/*.*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('./public/img'));
    });

    gulp.task('fonts', function() {
        gulp.src('./src/fonts/**/*.*')
            .pipe(plumber({ errorHandler: onError }))
            .pipe(gulp.dest('./public/fonts'));
    });

/*WATCH*/
    gulp.task('mainTask', ['css', 'js', 'html', 'img', 'fonts']);

    gulp.task('dev', function () {
        config.develop = true;
        gulp.run('mainTask');
    });

    gulp.task('prod', function () {
        config.develop = false;
        gulp.run('mainTask');
    });

gulp.task('watch', function () {
    
    gulp.run('dev');

    gulp.watch(['./src/**'], function () {
        gulp.run('dev');
    });
});

gulp.task('default', ['watch']);
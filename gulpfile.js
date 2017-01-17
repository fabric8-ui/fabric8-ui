
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc = require('gulp-typescript'),
    embedTemplates = require('gulp-inline-ng2-template'),
    wait = require('gulp-wait'),
    del = require('del'),
    exec = require('child_process').exec;

var appSrc = 'src';
var librarySrc = 'src-library';
var libraryDist = 'dist-library';

var tsProject = tsc.createProject('tsconfig.json');

gulp.task('build:library', function(done) {
  runSequence(
    'clean',
    'compile-sass',
    'compile-typings',
    'assets',
    'copy-library-definitions',
    done
  );
});

gulp.task('clean', function (done) {
  return del([libraryDist], done);
});

gulp.task('assets', function(done) {
    return gulp.src(['src/assets/*/**', 'src/*.*'])
        .pipe(gulp.dest(libraryDist));
});

gulp.task('watch', function () {
    gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['compile']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });
    gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['resources']).on('change', function (e) {
        console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
});

//typescript compilation including sourcemaps and template embedding
gulp.task('compile-typings', function() {

    //loading typings file
    return gulp.src([ appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'])
        .pipe(embedTemplates({ 
            base: appSrc + '/app',
            useRelativePaths: true,
            supportNonExistentFiles: true,
            target: 'es5'
        }))
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(libraryDist + '/lib'));
});

//Sass compilation and minifiction
gulp.task('compile-sass', function () {
  return gulp.src(appSrc + '/app/**/*.scss')
    .pipe(sass().on('error', sass.logError)) // this will prevent our future watch-task from crashing on sass-errors
    .pipe(minifyCss({compatibility: 'ie8'})) // see the gulp-sass doc for more information on compatibilitymodes
        .pipe(gulp.dest(function(file) {
            return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('copy-library-definitions', function(done) {
  let files = [
    'package.json',
    'README.adoc',
    'LICENSE',
    librarySrc + '/components.d.ts',
    librarySrc + '/components.js'
  ];
  return gulp.src(files).pipe(gulp.dest(libraryDist));
});

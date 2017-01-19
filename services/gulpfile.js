
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc = require('gulp-typescript'),
    wait = require('gulp-wait'),
    del = require('del'),
    exec = require('child_process').exec;

var appSrc = 'src';
var librarySrc = 'src-library';
var libraryDist = 'dist';

var tsProject = tsc.createProject('tsconfig.json');

gulp.task('build:library', function(done) {
  runSequence(
    'clean',
    'compile-typings',
    'copy-library-definitions',
    done
  );
});

gulp.task('clean', function (done) {
  return del([libraryDist], done);
});

gulp.task('compile-typings', function() {
    return gulp.src([ appSrc + '/**/*.ts', '!' + appSrc + '/**/*.spec.ts'])
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(libraryDist + '/lib'));
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

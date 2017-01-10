
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    tsc = require('gulp-typescript'),
    embedTemplates = require('gulp-inline-ng2-template'),
    wait = require('gulp-wait'),
    exec = require('child_process').exec;

var libraryDist = 'dist-library';
var librarySrc = 'src-library';

gulp.task('build', function (done) {
  runSequence(
    'clean',
    'compile-sass',
    'compile-typings',
    'copy-library-definitions',
    done
  );
});

gulp.task('clean', function (done) {
  exec('rm -rf ' + libraryDist, function (err, stdOut, stdErr) {
    if (err) {
        done(err);
    } else {
        done();
    }
  });
});

//typescript compilation including sourcemaps and template embedding
gulp.task('compile-typings', function() {

    //loading typings file
    var tsProject = tsc.createProject('tsconfig.json');

    return gulp.src(['src/app/**/*.ts', '!src/app/**/*.spec.ts'])
        .pipe(embedTemplates({ 
            base:'/src/app',
            useRelativePaths: true 
        }))
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(libraryDist + '/lib'));
});

//Sass compilation and minifiction
gulp.task('compile-sass', function () {
  return gulp.src('src/app/**/*.scss')
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

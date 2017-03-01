
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  runSequence = require('run-sequence'),
  minifyCss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  tsc = require('gulp-typescript'),
  embedTemplates = require('gulp-inline-ng2-template'),
  wait = require('gulp-wait'),
  del = require('del'),
  replace = require('gulp-string-replace'),
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

gulp.task('build:scss-css', function(done) {
  runSequence(
    'add-require-for-templates',
    'replace-html',
    'add-require-for-styles',
    'replace-scss',
    'compile-sass',
    done
  );
});

gulp.task('clean', function (done) {
  return del([libraryDist], done);
});

gulp.task('add-require-for-templates', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/templateUrl:\s/g, 'template: require('))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('replace-html', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/\.html'/g, ".html')"))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('add-require-for-styles', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/styleUrls: \[/g, 'styles: [require('))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('replace-scss', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/\.scss'],/g, ".css').toString()],"))
    .pipe(replace(/\.scss']/g, ".css').toString()]"))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

//Sass compilation and minifiction
gulp.task('compile-sass', function () {
  return gulp.src(appSrc + '/app/**/*.scss')
    .pipe(sass().on('error', sass.logError)) // this will prevent our future watch-task from crashing on sass-errors
    .pipe(minifyCss({compatibility: 'ie8'})) // see the gulp-sass doc for more information on compatibility modes
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
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

gulp.task('assets', function(done) {
  return gulp.src(['src/assets/*/**', 'src/*.*'])
    .pipe(gulp.dest(libraryDist));
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

gulp.task('watch', function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['compile']).on('change', function (e) {
    console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
  });
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['resources']).on('change', function (e) {
    console.log('Resource file ' + e.path + ' has been changed. Updating.');
  });
});


// Put the SASS files back to normal
gulp.task('build:css-scss', function(done) {
  runSequence(
    'remove-require-for-templates',
    'replace-require-html',
    'remove-require-for-styles',
    'replace-require-scss',
    'remove-css',
    done
  );
});

gulp.task('remove-require-for-templates', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/template: require\(/g, 'templateUrl: '))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('replace-require-html', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/\.html'\),/g, ".html',"))
    .pipe(replace(/\.html'\)/g, ".html'"))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('remove-require-for-styles', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/styles: \[require\(/g, 'styleUrls: ['))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('replace-require-scss', function() {
  gulp.src([appSrc + '/app/**/*.ts'])
    .pipe(replace(/\.css'\)\.toString\(\)],/g, ".scss'],"))
    .pipe(replace(/\.css'\)\.toString\(\)]/g, ".scss']"))
    .pipe(gulp.dest(function(file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

gulp.task('remove-css', function (done) {
  return del([appSrc + '/app/**/*.css'], done);
});

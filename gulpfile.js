
/*
 * Main build file for fabric8-planner. Use the commands here to build and deploy
 * the library. See the commands below for detailed documentation.
 */

var gulp = require('gulp'),
  //sassCompiler = require('gulp-sass'),
  less = require('gulp-less'),
  del = require('del'),
  replace = require('gulp-string-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  cp = require('child_process'),
  exec = require('gulp-exec'),
  ngc = require('gulp-ngc'),
  changed = require('gulp-changed'),
  sass = require('./deploy/sass'),
  runSequence = require('run-sequence'),
  argv = require('yargs').argv,
  path = require('path'),
  util = require('gulp-util'),
  KarmaServer = require('karma').Server;

var appSrc = 'src';
var libraryDist = 'dist';
var watchDist = 'dist-watch';

/*
 * FUNCTION LIBRARY
 */

// copies files to the libraryDist directory.
function copyToDist(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length); // save directly to dist
    }));
}

// copies files from the libraryDist to the watchDist.
function updateWatchDist() {
  return gulp
    .src(libraryDist + '/**')
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}

// transpiles a given SASS source set to CSS, storing results to libraryDist.
/*function transpileSASS(src, debug) {
  var opts = {
    outputStyle: 'compressed',
    includePaths: sass.modules.map(function (val) {
      return val.sassPath;
    })
  };
  if (debug) {
    opts.outputStyle = 'expanded';
    opts.sourceComments = true;
    console.log('Compiling', src, 'in debug mode using SASS options:', opts);
  }
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(sassCompiler(opts).on('error', sassCompiler.logError)) // this will prevent our future watch-task from crashing on sass-errors
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length); // save directly to dist
    }));
}*/
// transpiles a given LESS source set to CSS, storing results to libraryDist.
function transpileLESS(src, debug) {
  var opts = {
    // paths: [ path.join(__dirname, 'less', 'includes') ],
  }
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(less(opts))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length + 'src/'.length);
  }));
 }

/*
 * TASKS
 */

// Deletes dist directories.
gulp.task('clean:dist', function () {
  return del([
    'dist-watch',
    'dist'
  ]);
});

// Deletes npm cache.
gulp.task('clean:npmcache', function () {
  return cp.execFile('npm cache clean');
});

// Deletes and cleans all.
gulp.task('clean:all', ['clean:dist', 'clean:npmcache'], function () {
  return del([
    'node_modules',
    'coverage'
  ]);
});

// Deletes and re-installs dependencies.
gulp.task('reinstall', ['clean:all'], function () {
  return cp.execFile('npm install');
});

// Run unit tests.
gulp.task('test:unit', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

// FIXME: why do we need that?
// replaces templateURL/styleURL with require statements in js.
gulp.task('post-transpile', ['transpile'], function () {
  return gulp.src(['dist/app/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    //.pipe(replace(/\.scss']/g, ".css').toString()]"))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
    }));
});

// Transpile and minify sass, storing results in libraryDist.
//gulp.task('transpile-sass', function () {
//  if (argv['sass-src']) {
//    return transpileSASS(argv['sass-src'], true);
//  } else {
//    return transpileSASS(appSrc + '/app/**/*.scss');
//  }
//});
// Transpile and minify less, storing results in libraryDist.
gulp.task('transpile-less', function () {
  if (argv['less-src']) {
    return transpileLESS(argv['less-src'], true);
  } else {
    return transpileLESS(appSrc + '/app/**/*.less');
  }
});

// transpiles the ts sources to js using the tsconfig.
gulp.task('transpile', function () {
  return ngc('tsconfig.json')
});

// copies the template html files to libraryDist.
gulp.task('copy-html', function () {
  return copyToDist([
    'src/**/*.html'
  ]);
});

// copies the static asset files to libraryDist.
gulp.task('copy-static-assets', function () {
  return gulp.src([
    'LICENSE',
    'README.adoc',
    'package.json',
  ]).pipe(gulp.dest(libraryDist));
});

// Put the sass files back to normal
gulp.task('build:library',
  [
    'transpile',
    'post-transpile',
   // 'transpile-sass',
    'transpile-less',
    'copy-html',
    'copy-static-assets'
  ]);

// Main build goal, builds the release library.
gulp.task('build', function(callback) {
  runSequence('clean:dist',
              'build:library',
              callback);
});

// Watch Tasks follow.

gulp.task('copy-watch', ['post-transpile'], function () {
  return updateWatchDist();
});

gulp.task('copy-watch-all', ['build:library'], function () {
  return updateWatchDist();
});

gulp.task('watch', ['build:library', 'copy-watch-all'], function () {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts'], ['transpile', 'post-transpile', 'copy-watch']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Compiling.');
  });
  //gulp.watch([appSrc + '/app/**/*.scss']).on('change', function (e) {
  //  util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
  //  transpileSASS(e.path);
  //  updateWatchDist();
  //});
  gulp.watch([appSrc + '/app/**/*.less']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    transpileLESS(e.path);
    updateWatchDist();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (e) {
    util.log(util.colors.cyan(e.path) + ' has been changed. Updating.');
    copyToDist(e.path);
    updateWatchDist();
  });
  util.log('Now run');
  util.log('');
  util.log(util.colors.red('    npm link', path.resolve(watchDist)));
  util.log('');
  util.log('in the npm module you want to link this one to');
});

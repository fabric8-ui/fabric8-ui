
const gulp = require('gulp'),
  autoprefixer = require('autoprefixer'),
  LessAutoprefix = require('less-plugin-autoprefix'),
  autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }),
  changed = require('gulp-changed'),
  cssmin = require('gulp-cssmin'),
  del = require('del'),
  exec = require('child_process').exec,
  gulpngc = require('gulp-ngc'),
  fs = require("fs"),
  htmlMinifier = require('html-minifier'),
  lessCompiler = require('gulp-less'),
  // ngc = require('@angular/compiler-cli/src/main').main,
  path = require('path'),
  postcss = require('postcss'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename');
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  stylelint = require('gulp-stylelint'),
  stylus = require('stylus');

const appSrc = 'src';
const libraryBuild = 'build';
const libraryDist = 'dist';
const demoDist = 'dist-demo';
const watchDist = 'dist-watch';
const globalExcludes = [
  '!./**/demo.*',
  '!./**/demo/**',
  '!./**/example',
  '!./**/example/**'
];

/**
 * FUNCTION LIBRARY
 */

// Copy example files to dist-demo (e.g., HTML and Typscript for docs)
function copyExamples() {
  return copyToDemo([
    'src/**/example/*.*'
  ]);
}

// Copy package files to dist
function copyPkgFiles() {
  return copyToDist([
    './LICENSE.txt',
    './README.md',
    './package.json'
  ]);
}

// Copy given files to demo directory
function copyToDemo(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return demoDist + file.base.slice(__dirname.length); // save directly to demo
    }));
}

// Copy given files to dist directory
function copyToDist(srcArr) {
  return gulp.src(srcArr.concat(globalExcludes))
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length); // save directly to dist
    }));
}

// Minify HTML templates
function minifyTemplate(file) {
  try {
    let minifiedFile = htmlMinifier.minify(file, {
      collapseWhitespace: true,
      caseSensitive: true,
      removeComments: true
    });
    return minifiedFile;
  } catch (err) {
    console.log(err);
  }
}

// Build and minify LESS separately
function transpileMinifyLESS(src) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(lessCompiler({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(cssmin().on('error', function(err) {
      console.error(err);
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length);
    }));
}

/**
 * LESS
 */

// Stylelint
function lintCss() {
  return gulp
    .src([appSrc + '/**/*.less'])
    .pipe(stylelint({
      failAfterError: true,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
}

// Less compilation and minifiction
function transpileLess() {
  return transpileMinifyLESS(appSrc + '/**/*.less');
}

// update templates styleUrls
function postTranspile() {
  return gulp.src(['dist/**/*.js'])
    .pipe(replace(/templateUrl:\s/g, "template: require("))
    .pipe(replace(/\.html',/g, ".html'),"))
    .pipe(replace(/\.html'/g, ".html')"))
    .pipe(replace(/styleUrls: \[/g, "styles: [require("))
    .pipe(replace(/\.less']/g, ".css').toString()]"))
    .pipe(gulp.dest(function (file) {
      return file.base; // because of Angular's encapsulation, it's natural to save the css where the less-file was
    }));
}

/**
 * Typescript
 */

// Inline HTML templates in component classes
function inlineTemplate() {
  return gulp.src([appSrc + '/app/**/*.ts'].concat(globalExcludes), {base: './'})
    .pipe(replace(/templateUrl.*\'/g, function (matched) {
      let fileName = matched.match(/\/.*html/g).toString();
      let dirName = this.file.relative.substring(0, this.file.relative.lastIndexOf('/'));
      let fileContent = fs.readFileSync(dirName + fileName, "utf8");
      return 'template: \`' + minifyTemplate(fileContent) + '\`';
    }))
    .pipe(gulp.dest(libraryBuild));
}

// Build the components
function transpile() {
  /**
   * Stick with gulp-ngc v0.2.1 due to "function calls are not supported in decorators" issue
   *
   * See: https://github.com/angular/angular/issues/23609
   * Related: https://github.com/dherges/ng-packagr/issues/727
   *
   * gulp-ngc v0.3.0 uses different args
   * See: https://github.com/jolly-roger/gulp-ngc/issues/9
   */
  return gulpngc('tsconfig.json');
}

// Build with AOT enabled
function transpileAot() {
  // https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async
  return new Promise(function(resolve, reject) {
    // Need to capture the exit code
    exec('node_modules/.bin/ngc -p tsconfig-aot.json', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err !== null) {
        process.exit(1);
      }
    });
    resolve();
  });
}

/**
 * Watch
 */

// Watch source
function watch() {
  gulp.watch([appSrc + '/app/**/*.ts', '!' + appSrc + '/app/**/*.spec.ts']).on('change', function (path) {
    console.log('TypeScript file ' + path + ' has been changed. Compiling.');
    gulp.series(inlineTemplate, transpile, updateWatchDist)();
  });
  gulp.watch([appSrc + '/app/**/*.less', appSrc + '/assets/**/*.less']).on('change', function (path) {
    console.log(path + ' has been changed. Updating.');
    gulp.series(() => transpileMinifyLESS(path), updateWatchDist)();
  });
  gulp.watch([appSrc + '/app/**/*.html']).on('change', function (path) {
    console.log(path + ' has been changed. Updating.');
    gulp.series(inlineTemplate, transpile, updateWatchDist)();
  });
}

// Update watch dist directory
function updateWatchDist() {
  return gulp
    .src([libraryDist + '/**'].concat(globalExcludes))
    .pipe(changed(watchDist))
    .pipe(gulp.dest(watchDist));
}

/**
 * Tasks
 */
const buildCssSeries = gulp.series(lintCss, transpileLess);
const buildAotSeries = gulp.series(inlineTemplate, transpileAot, postTranspile);
const transpileSeries = gulp.series(inlineTemplate, transpile, postTranspile);
const copyExamplesSeries = gulp.series(copyExamples);
const copyPkgFilesSeries = gulp.series(copyPkgFiles);

const buildSeries = gulp.series(transpileSeries, buildCssSeries, copyPkgFilesSeries);
const updateWatchDistSeries = gulp.series(buildSeries, updateWatchDist);
const watchSeries = gulp.series(updateWatchDistSeries, watch);

gulp.task('build', buildSeries);
gulp.task('build-aot', buildAotSeries);
gulp.task('build-css', buildCssSeries);
gulp.task('copy-examples', copyExamplesSeries);
gulp.task('copy-pkg-files', copyPkgFilesSeries);
gulp.task('watch', watchSeries);
gulp.task('update-watch-dist', updateWatchDistSeries);

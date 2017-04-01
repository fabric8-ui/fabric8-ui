const gulp = require('gulp'),
  del = require('del'),
  changeCase = require('change-case'),
  replace = require('gulp-string-replace'),
  rename = require('gulp-rename'),
  exec = require('child_process').exec,
  argv = require('yargs')
    .usage('Usage: $0 [options]')
    .command('create', 'Create a new component')
    .example('$0 --component=example-widget --dest=src/app/')
    .alias('d', 'dest')
    .describe('d', 'The directory to place the component in.')
    .alias('c', 'component')
    .describe('c', 'The name of the component to create in snake case.')
    .demandOption(['c', 'd'])
    .argv;

function copyToDest(srcArr) {
  return gulp.src(srcArr)
    .pipe(gulp.dest(function (file) {
      return libraryDist + file.base.slice(__dirname.length); // save directly to dist
    }));
}

gulp.task('create', function () {
  let headerCase = argv.c;
  let pascalCase = changeCase.pascalCase(headerCase);
  let dest = argv.d;
  let origHeaderCase = 'starter-widget';
  let origPascalCase = changeCase.pascalCase(origHeaderCase);
  return gulp.src([`src/templates/${origHeaderCase}/**`])
    .pipe(rename(function (path) {
      path.basename = path.basename.replace(new RegExp(origHeaderCase), headerCase);
    }))
    .pipe(replace(new RegExp(origHeaderCase, "g"), headerCase))
    .pipe(replace(new RegExp(origPascalCase, "g"), pascalCase))
    .pipe(gulp.dest(`${dest}/${headerCase}`));
});

import angular from 'rollup-plugin-angular-aot';
import sass from 'node-sass';
import CleanCSS from 'clean-css';
import {minify as minifyHtml} from 'html-minifier';

const cssmin = new CleanCSS();
const htmlminOpts = {
  caseSensitive: true,
  collapseWhitespace: true,
  removeComments: true,
};


export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/ngx-widgets.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ngx.widgets',
  plugins: [
    angular({
      preprocessors: {
        template: template => minifyHtml(template, htmlminOpts),
        style: scss => {
          const css = sass.renderSync({data: scss}).css;
          return cssmin.minify(css).styles;
        }
      }
    })
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',
    '@angular/pipes': 'ng.pipes',
    'moment': 'moment',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/filter': 'Rx.Observable.prototype',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable'
  }
}
/**
 * Adapted from angular2-webpack-starter
 */
const webpack = require('webpack');
const helpers = require('./helpers');
var path = require('path');
var stringify = require('json-stringify');

/**
 * Webpack Plugins
 */
const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const TsConfigPathsPlugin = require('awesome-typescript-loader');

/*
 * Webpack Constants
 */
const METADATA = {
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  FABRIC8_BRANDING: process.env.FABRIC8_BRANDING || 'fabric8'
};

// ExtractTextPlugin
const extractCSS = new ExtractTextPlugin({
  filename: '[name].[id].css',
  allChunks: true
});

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  console.log('The options from the webpack config: ' + stringify(options, null, 2));

  var config = {
    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: https://webpack.js.org/configuration/entry-context/#entry
     */
    entry: helpers.root('index.ts'),

    devtool: 'inline-source-map',

    // require those dependencies but don't bundle them
    externals: [/^@angular\//, /^rxjs\//],

    /*
     * Options affecting the resolving of modules.
     *
     * See: https://webpack.js.org/configuration/resolve
     */
    resolve: {

      /**
       * An array that automatically resolve certain extensions.
       * Which is what enables users to leave off the extension when importing.
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
      extensions: ['.ts', '.js', '.json'],
    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {
      rules: [

        /*
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         * Replace templateUrl and stylesUrl with require()
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                declaration: false
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /*
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          use: ['json-loader']
        },

        /* HTML Linter
         * Checks all files against .htmlhintrc
         */
        {
          enforce: 'pre',
          test: /\.html$/,
          loader: 'htmlhint-loader',
          exclude: [/node_modules/],
          options: {
            configFile: './.htmlhintrc'
          }
        },

        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: ['html-loader']
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /\.component\.css$/,
          use: [
            {
              loader: 'to-string-loader'
            }, {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
                context: '/'
              }
            }
          ],
        },

        {
          test: /\.css$/,
          loader: extractCSS.extract({
            fallback: "style-loader",
            use: "css-loader?sourceMap&context=/"
          })
        }, {
          test: /\.component\.less$/,
          use: [
            {
              loader: 'to-string-loader'
            },
            {
              loader: 'css-loader',
                options: {
                  minimize: true,
                  sourceMap: true,
                  context: '/'
                }
            },
            {
                loader: 'less-loader',
                options: {
                  paths: [
                    path.resolve(__dirname, "../node_modules/patternfly/src/less"),
                    path.resolve(__dirname, "../node_modules/patternfly/node_modules")
                  ],
                  sourceMap: true
                }
            }],
          },

        /**
         *  File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          use: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: 'assets/fonts/[name].[ext]'
              }
            }
          ]
        },

        {
          test: /\.jpg$|\.png$|\.svg$|\.gif$|\.jpeg$/,
          use: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: 'assets/fonts/[name].[ext]'
              }
            }
          ]
        }
      ]
    },

    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
    new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('./src')
      ),

      /**
       * Webpack plugin to optimize a JavaScript file for faster initial load
       * by wrapping eagerly-invoked functions.
       *
       * See: https://github.com/vigneshshanmugam/optimize-js-plugin
       */
      new OptimizeJsPlugin({
        sourceMap: false
      }),

    new HtmlWebpackPlugin(),

      /**
       * Plugin: ExtractTextPlugin
       * Description: Extracts imported CSS files into external stylesheet
       *
       * See: https://github.com/webpack/extract-text-webpack-plugin
       */
      // new ExtractTextPlugin('[name].[contenthash].css'),
      new ExtractTextPlugin('[name].css'),

    new webpack.LoaderOptionsPlugin({
        options: {
          /**
           * Html loader advanced options
           *
           * See: https://github.com/webpack/html-loader#advanced-options
           */
          // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
          // htmlLoader: {
          //   minimize: true,
          //   removeAttributeQuotes: false,
          //   caseSensitive: true,
          //   customAttrSurround: [
          //     [/#/, /(?:)/],
          //     [/\*/, /(?:)/],
          //     [/\[?\(?/, /(?:)/]
          //   ],
          //   customAttrAssign: [/\)?\]?=/]
          // },

          tslintLoader: {
            emitErrors: false,
            failOnHint: false
          },
          /**
           * Sass
           * Reference: https://github.com/jtangelder/sass-loader
           * Transforms .scss files to .css
           */
          // sassLoader: {
            //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
          // }
        }
      }),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      // new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      // new CopyWebpackPlugin([{
      //   from: helpers.root('src/public')
      // }]),

      // Reference: https://github.com/johnagan/clean-webpack-plugin
      // Removes the bundle folder before the build
      new CleanWebpackPlugin(['bundles'], {
        root: helpers.root(),
        verbose: false,
        dry: false
      }),
    extractCSS,
      /*
       * StyleLintPlugin
       */
      new StyleLintPlugin({
        configFile: '.stylelintrc',
        syntax: 'less',
        context: 'src',
        files: '**/*.less',
        failOnError: true,
        quiet: false,
      })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };

  return config;
};

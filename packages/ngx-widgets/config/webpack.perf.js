/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const path = require('path');

/**
 * Webpack Plugins
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'performance';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
};

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: 'cheap-module-source-map',

  /**
   * As of Webpack 4 we need to set the mode.
   * Since this is a library and it uses gulp to build the library,
   * we only have Demo, Test, and Perf.
   */
  mode: 'development',

  /**
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: https://webpack.js.org/configuration/entry-context/#entry
   */
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.webpack.js', '.wep.js', '.js', '.ts', '.json']
  },

  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {

    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: helpers.root('dist'),

    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].bundle.js',

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[name].map',

    /** The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].chunk.js',

    library: 'ac_[name]',
    libraryTarget: 'var'
  },

  module: {
    rules: [

      /**
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular')
        ]
      },

      // {
      //   test: /\.ts$/,
      //   enforce: 'pre',
      //   use: [{
      //     loader: 'tslint-loader',
      //     options: {
      //       configFile: "tslint.json",
      //       tsConfigFile: 'tsconfig.json',
      //       formattersDirectory: 'node_modules/tslint-loader/formatters/',
      //       formatter: 'custom',
      //       emitErrors: false,
      //       failOnHint: true,
      //       resourcePath: 'src',
      //       typeCheck: true,
      //     }
      //   }],
      //   exclude: [
      //     helpers.root('node_modules')
      //   ]
      // },

      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-test.json'
            }
          },
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      /**
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        type: "javascript/auto",
        use: ['json-loader'],
        exclude: [helpers.root('src/index.html')]
      },

      /**
       * HTML Linter
       * Checks all files against .htmlhintrc
       */
      {
        enforce: 'pre',
        test: /\.html$/,
        use: {
          loader: 'htmlhint-loader',
          options: {
            configFile: './.htmlhintrc'
          }
        },
        exclude: [/node_modules/]
      },

      /**
       * Raw loader support for *.html
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.html$/,
        use: ['html-loader']
      },

      /**
       * to string and css loader support for *.css files
       * Returns file content as string
       *
       */
      {
        test: /\.css$/,
        use:
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'css-to-string-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'less-loader',
            options: {
              paths: [
                path.resolve(__dirname, "../node_modules/patternfly/dist/less"),
                path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies"),
                path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies/bootstrap"),
                path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies/font-awesome"),
              ],
              sourceMap: true
            }
          }
        ]
      },

      /**
       *  File loader for supporting fonts, for example, in CSS files.
       */
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: [
          {
            loader: "url-loader",
            query: {
              limit: 3000,
              includePaths: [
                path.resolve(__dirname, "../node_modules/patternfly/dist/fonts/")
              ],
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ]
      }, {
        test: /\.jpg$|\.png$|\.gif$|\.jpeg$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 3000,
            name: 'assets/fonts/[name].[ext]'
          }
        },
        exclude: path.resolve(__dirname, "../node_modules/patternfly/dist/fonts/")
      }
    ]
  },

  plugins: [

    /**
     * Webpack plugin and CLI utility that represents bundle content as convenient interactive zoomable treemap
     */
    new BundleAnalyzerPlugin({
      generateStatsFile: true
    }),

    /**
     * Plugin: ContextReplacementPlugin
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
     * See: https://github.com/angular/angular/issues/11580
     */
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      // /angular(\\|\/)core(\\|\/)@angular/,
      /\@angular(\\|\/)core(\\|\/)fesm5/,
      helpers.root('./src')
    ),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src')
    ),

    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'HMR': METADATA.HMR,
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR
      }
    })
  ],

  /**
   * Webpack Development Server configuration
   * Description: The webpack-dev-server is a little node.js Express server.
   * The server emits information about the compilation state to the client,
   * which reacts to those events.
   *
   * See: https://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    port: METADATA.port,
    host: METADATA.host,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    outputPath: helpers.root('dist')
  },

  /*
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
  },

  /**
   * These common plugins were removed from Webpack 3 and are now set in this object.
   */
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: { // CommonsChunkPlugin()
      chunks: 'all',
      // minChunks: Infinity
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true, //ModuleConcatenationPlugin
    nodeEnv: '8.3.0'
  }
};

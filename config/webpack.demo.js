const helpers = require('./helpers');
const path = require('path');

/**
 * Webpack Plugins
 */
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    inline: true
  },

  /**
   * As of Webpack 4 we need to set the mode.
   * Since this is a library and it uses gulp to build the library,
   * we only have Demo, Test, and Perf.
   */
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.webpack.js', '.wep.js', '.js', '.ts']
  },

  stats: {
    colors: true,
    reasons: true
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
          'ts-loader',
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

  output: {
    path: helpers.root('dist-demo'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    sourceMapFilename: '[name].map'
  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /**
     * StyleLintPlugin
     */
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      syntax: 'less',
      context: 'src',
      files: '**/*.less',
      failOnError: true,
      quiet: false,
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

    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      template: 'src/index.html'
    }),

    // // Todo: config is not loading.
    // new TsConfigPathsPlugin({
    //   configFileName: helpers.root("tsconfig-demo.json")
    // }),

  ],

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

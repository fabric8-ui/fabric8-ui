const webpack = require('webpack');
const sassLintPlugin = require('sasslint-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');
const precss = require('precss');
const autoprefixer = require('autoprefixer')

module.exports = {
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
      {
        test: /\.ts$/,
        loaders: [
          'ts-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use:[
          {
            loader:'to-string-loader'
          },
          // Commented out as causing CSS ot load twice
          /*{
            loader: 'style-loader'
          },*/
          {
            loader:'css-loader'
          },
        ]
      },
      {
        test: /\.scss$/,
        use:[
          {
            loader:'css-to-string-loader'
          },
          // Commented out as causing CSS ot load twice
          /*{
            loader: 'style-loader'
          },*/
          {
            loader:'css-loader',
            options:{sourceMap:true}
          },
          {
            loader:'sass-loader',
            options:{sourceMap:true}
          }
        ]
      },
      /* File loader for supporting images, for example, in CSS files. */
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'file-loader'
      },
    ]
  },

  plugins: [
    // new sassLintPlugin({
    //   configFile: '.sass-lint.yml',
    //   context: ['inherits from webpack'],
    //   ignoreFiles: [],
    //   ignorePlugins: [],
    //   glob: '**/*.s?(a|c)ss',
    //   quiet: false,
    //   failOnWarning: false,
    //   failOnError: false,
    //   testing: false
    // }),
    // require('postcss-import')(),
    // require('autoprefixer')(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    /**
     * Plugin: ContextReplacementPlugin
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
     * See: https://github.com/angular/angular/issues/11580
     */
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('src') // location of your src
    ),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    /*
      * Plugin: CopyWebpackPlugin
      * Description: Copy files and directories in webpack.
      *
      * Copies project static assets.
      *
      * See: https://www.npmjs.com/package/copy-webpack-plugin
      */
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }, {
      from: 'src/meta'
    }]),

  ],

  // postcss: function () {
  //     return [precss, autoprefixer({ browsers: ['last 2 versions'] })];
  // }
};

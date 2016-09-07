var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');
var precss = require('precss');
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.webpack.js', '.wep.js', '.js', '.ts']
  },

  stats: {
    colors: true,
    reasons: true
  },

  module: {
    // preLoaders: [
    //   {
    //     test: /\.ts$/,
    //     loader: 'tslint'
    //   }
    // ],
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['ts', 'angular2-template-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw!postcss'
      },
      {
        test: /\.scss$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!resolve-url!sass?sourceMap')
      },
      { 
        test: /\.scss$/,
        include: helpers.root('src', 'app'),
        loaders: ['exports-loader?module.exports.toString()', 'css', 'postcss', 'sass']
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],

  postcss: function () {
      return [precss, autoprefixer({ browsers: ['last 2 versions'] })];
  }
};

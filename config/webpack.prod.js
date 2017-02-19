var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const API_URL = process.env.API_URL || 'http://api.almighty.io/api/';
const FORGE_URL = process.env.FORGE_URL;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const extractCSS = new ExtractTextPlugin('stylesheets/[name].[hash].css');
const extractSASS = new ExtractTextPlugin('stylesheets/[name].[hash].scss');


const METADATA = webpackMerge(commonConfig.metadata, {
  API_URL: API_URL,
  ENV: ENV,
  FORGE_URL: FORGE_URL,
  PUBLIC_PATH: PUBLIC_PATH
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: METADATA.PUBLIC_PATH,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    // FIXME: https://github.com/webpack/webpack/issues/2644
    // new webpack.optimize.DedupePlugin(),
    // FIXME: webpack's --optimize-minimize option is not working
    //new webpack.optimize.UglifyJsPlugin(),
    extractCSS,
    extractSASS,
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'API_URL' : JSON.stringify(METADATA.API_URL),
        'FORGE_URL': JSON.stringify(METADATA.FORGE_URL),
        'PUBLIC_PATH' : JSON.stringify(METADATA.PUBLIC_PATH)
      }
    })
  ]
});

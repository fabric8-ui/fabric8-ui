var webpackMerge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8088/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
	//copy patternfly assets for demo app
        new CopyWebpackPlugin([
            {
                from: { glob:'./src/html/*.html'},
                to: './',
                flatten: true
            },
            {
                from: { glob: './node_modules/patternfly/dist/img/*.*'},
                to: './img',
                flatten: true
            },
            {
                from: { glob: './node_modules/patternfly/dist/fonts/*.*'},
                to: './fonts',
                flatten: true
            },
            {
                from: { glob: './node_modules/patternfly/dist/css/*.*'},
                to: './css',
                flatten: true
            }
        ]),

    	new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
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
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      // {
      //   test: /\.(css|scss)$/,
      //   loaders: ['to-string-loader', 'css-loader', 'sass-loader'],
      //   include: helpers.root('src', 'app'),
      // },
      // { test: /\.css$/,
      //   exclude: [helpers.root('src', 'app')],
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       { loader: 'css-loader', query: { modules: true, sourceMaps: true } },
      //       { loader: 'postcss-loader'  }
      //     ]
      //   })
      // },
      // {
      //   test: /\.css$/,
      //   include: [helpers.root('src', 'app')],
      //   use: [
      //     { loader: 'raw-loader' },
      //     { loader: 'postcss-loader' }
      //   ]
      // },


      {
        test: /(\.css|\.scss)$/,
        exclude: [helpers.root('src', 'app')],
        use: ExtractTextPlugin
          .extract({
            // fallback: 'style-loader',
            use: [
              // { loader: 'to-string-loader'},
              { loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMaps: true,
                  importLoaders: true,
                  // localIdentName: "[name]__[local]___[hash:base64:5]"
                }
              },
              { loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require("autoprefixer")
                    ];
                  }
                }
              },
              { loader: 'sass-loader',
                options: {
                  sourceMaps: true
                }
              }
            ]
          })
      },
      {
        test: /(\.css|\.scss)$/,
        include: [helpers.root('src', 'app')],
        use: [
          { loader: 'raw-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader', options: { sourceMaps: true } }
        ]
      }
      // {
      //   test: /\.css$/,
      //   include: helpers.root('src', 'app'),
      //   loader: 'raw-loader!postcss-loader'
      // },
      // {
      //   test: /\.scss$/,
      //   include: helpers.root('src', 'app'),
      //   loaders: ['raw-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      // }
    ]
  },

  plugins: [
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
    })
  ],

  // postcss: function () {
  //     return [precss, autoprefixer({ browsers: ['last 2 versions'] })];
  // }
};

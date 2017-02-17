/**
 * Adapted from angular2-webpack-starter
 */

const helpers = require('./config/helpers'),
  webpack = require('webpack'),
  CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlElementsPlugin = require('./config/html-elements-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
// const ngcWebpack = require('ngc-webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');


module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  entry: helpers.root('index.ts'),

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: 'bundles/ngx-widgets.js',
    library: 'ngx-widgets',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  // require those dependencies but don't bundle them
  externals: [/^\@angular\//, /^rxjs\//],

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: [helpers.root('node_modules')]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              declaration: false
            },
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.spec\.ts$/]
      },
      // copy those assets to output
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=fonts/[name].[hash].[ext]?'
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        use: 'json-loader'
      },

      {
        test: /\.css$/,
        loaders: ['to-string-loader', 'css-loader']
      },

      {
        test: /\.scss$/,
        loaders: ["css-to-string-loader", "css-loader", "sass-loader"]
      },
      // Support for CSS as raw text
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      // {
      //   test: /\.css$/,
      //   exclude: helpers.root('src', 'app'),
      //   use: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'postcss-loader']})
      // },
      // // all css required in src/app files will be merged in js files
      // {test: /\.css$/, include: helpers.root('src', 'app'), loader: 'raw-loader!postcss-loader'},
      //
      // // support for .scss files
      // // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // // all css in src/style will be bundled in an external css file
      // {
      //   test: /\.(scss|sass)$/,
      //   exclude: helpers.root('src', 'app'),
      //   use: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'postcss-loader', 'sass-loader']})
      // },
      // // all css required in src/app files will be merged in js files
      // {
      //   test: /\.(scss|sass)$/,
      //   exclude: helpers.root('src', 'style'),
      //   use: 'raw-loader!postcss-loader!sass-loader'
      // },

      // support for .html as raw text
      // todo: change the loader to something that adds a hash to images
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  },

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
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
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
        htmlLoader: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
          ],
          customAttrAssign: [/\)?\]?=/]
        },

        tslintLoader: {
          emitErrors: false,
          failOnHint: false
        },
        /**
         * Sass
         * Reference: https://github.com/jtangelder/sass-loader
         * Transforms .scss files to .css
         */
        sassLoader: {
          //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
        }
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
    })
  ]
};

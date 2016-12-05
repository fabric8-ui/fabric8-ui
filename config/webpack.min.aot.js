const ngToolsWebpack = require('@ngtools/webpack');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './src/main.browser.ts',
  output: {
    path: './dist',
    publicPath: 'dist/',
    filename: 'app.main.js'
  },
  plugins: [
    new ngToolsWebpack.AotPlugin({
      "tsConfigPath": "./tsconfig-aot.json",
      "mainPath": "src/main.browser.ts"
    })
  ],
  module: {
    loaders: [
      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: '@ngtools/webpack' }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};

const path = require('path')
const webpack = require('webpack')

module.exports = {
  // devtool: 'source-map',

  entry: './assets/js/index.js',

  output: {
    path: path.join(__dirname, './public/'),
    filename: 'app.bundle.js',
    publicPath: '/public/'
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      "$":"jquery",
      "jQuery":"jquery",
      "window.jQuery":"jquery"
    })
  ],

  resolve: {
      modulesDirectories: ['node_modules'],
      root: path.resolve(__dirname, "assets"),
      extensions: ['', '.js', '.jsx']
  },

  module: {
      loaders: [
          {
              test: [/\.jsx?$/, /\.es6$/],
              exclude: /node_modules/,
              loaders: ['react-hot','babel-loader']
          },
          {
              test: [/\.scss$/, /\.css$/],
              loaders: ['style', 'css', 'sass']
          },
          {
            test: /\.png$/,
            loader: 'url-loader',
            query: {mimetype: "image/png"}
          }
      ]
  }

}

var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    // cache: true,
    devtool: "eval",
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './assets/js/index.js',
    ],
    output: {
        path: path.resolve('./assets/bundles'),
        filename: "app.bundle.js",
        publicPath: 'http://localhost:3000/assets/bundles/',
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
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: path.join(__dirname, "assets"),
        //     manifest: require("./dll/vendor-manifest.json")
        // }),
        new BundleTracker({filename: './webpack-stats.json'}),
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(), // don't reload if there is an error
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        root: path.resolve(__dirname, "assets"),
        extensions: ['', '.js', '.jsx']
    },
}

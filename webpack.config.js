var BitBarWebpackPlugin = require('bitbar-webpack-progress-plugin');
var path = require('path')

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [{
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    serve: {},
    output: {
        filename: 'output.js',
        path: path.resolve(__dirname)
    },
    plugins: [
        new BitBarWebpackPlugin()
    ],
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    },
    devtool: 'inline-source-map',
    mode: 'development'
};
const path = require('path');

module.exports = {
    entry: {
        background: './src/background.ts',
        content: './src/content.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // This uses the entry key ('background', 'content') as the filename
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    mode: 'development',
    devtool: false,
};
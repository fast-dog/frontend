const webpack = require('webpack');

module.exports = {
    configureWebpack: {
        devServer: {
            port: 8081,
            host: 'fast-dog.local'
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery',
                jQuery: 'jquery'
            })
        ]
    }
};
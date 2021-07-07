const path = require('path');
// 项目端口
const port = 8080;
// 项目名
const name = 'IChat';
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    publicPath: './',
    //输出的文件名称
    outputDir: 'IChat',
    assetsDir: 'static',
    // lintOnSave: process.env.NODE_ENV === 'development',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        // 实验室环境需要的配置  
        disableHostCheck: true,
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            },
            extensions: ['.js', '.vue', '.json', '.ts'],
        },

    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => {
                options.limit = 999999999;
                return options
            }).end()
    }
}
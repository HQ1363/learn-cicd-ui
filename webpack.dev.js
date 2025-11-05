const {merge} =require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base");

module.exports = merge(baseWebpackConfig,{
    // 指定构建环境
    mode:"development",
    devtool: "cheap-module-eval-source-map",
    plugins:[

    ],
    // 开发环境本地启动的服务配置
    devServer: {
        contentBase: path.join(__dirname, "./dist"),
        compress: true,
        port: 8000,
        host: "localhost",
        historyApiFallback: true,
        disableHostCheck: true,
        // 完全禁用热更新和实时重载
        hot: false,
        inline: false,
        liveReload: false,
        // 不注入客户端代码（这会阻止 WebSocket 连接）
        injectClient: false,
        // 配置客户端日志级别
        clientLogLevel: 'none',
        // 不显示 overlay
        overlay: false
    }
});


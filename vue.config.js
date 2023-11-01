const path = require("path"); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}

module.exports = {
  publicPath: "./", //部署应用包的时候的基本URL
  outputDir: "dist", //打包时输出的文件目录
  lintOnSave: false,

  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("@components", resolve("./src/components"))
      .set("@assets", resolve("./src/assets"))
      .set("@views", resolve("./src/views"))
      .set("@api", resolve("./src/api"))
      .set("@store", resolve("./src/store"))
      .set("@utils", resolve("./src/utils"));
    //set第一个参数：设置的别名，第二个参数：设置的路径
  },
  devServer: {
    host:"0.0.0.0",
    port:8080,
    proxy: {
      '/api': {
        target: "https://localhost:3000",
        // target: 'http://47.111.146.85:3000',
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
      },
      '/apj': {
        target: 'https://www.nowhealth.top:9876',
        changeOrigin: true,
        pathRewrite: {'^/apj': ''},
      },
      '/pic': {
        target: 'http://132.232.18.227:8081',
        changeOrigin: true,
        pathRewrite: {'^/pic': ''},

      },
      '/wear': {
        target: 'http://open.kuanhow.com/api/',
        changeOrigin: true,
        pathRewrite: {'^/wear': ''},

      },

      '/eeg': {
        target: 'http://www.kuanhow.com:8080',
        changeOrigin: true,
        pathRewrite: {'^/eeg': ''},
      },

    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@assets/css/commonStyle.scss";@import "@assets/css/variable.scss";`
      }
    }
  }
};

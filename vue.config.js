const path = require('path');
// 导入compression-webpack-plugin
const CompressionPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
// const productionGzipExtensions = ['js', 'css']
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',

  // 输出文件目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',

  /**
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");     
    svgRule.uses.clear();     
    svgRule       
      .use("svg-sprite-loader")       
      .loader("svg-sprite-loader")       
      .options({         
        symbolId: "icon-[name]",         
        include: ["./src/icons"]       
      });  

  },

  configureWebpack: (config) => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue':'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname,'./src/components'),
        '@u': path.resolve(__dirname,'./src/utils'),
        'public': path.resolve(__dirname, './public'),
      }
    }
    plugins = [
      new CompressionPlugin({
          algorithm: 'gzip', // 使用gzip压缩
          test: /\.js$|\.css$/, // 匹配文件名
          filename: '[path][base].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
          minRatio: 1, // 压缩率小于1才会压缩
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      }),
    ]
  },

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 如发现 css.modules 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      sass: { 
        prependData: `@import "./src/styles/main.scss";`
      }
    }
  },

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},

  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: null, // 设置代理
    proxy:{
      '/devapi' : {
        //http://www.web-jshtml.cn/productapi/token
        target: "http://www.web-jshtml.cn/productapi/token", //API服务器的地址
        changeOrigin: true ,
        pathRewrite: {
            '^/devapi': ''
        },
      },
      '/uploadImgToken' : {
        target: "http://localhost:3000/index/uploadImgToken", //API服务器的地址
        changeOrigin: true ,
        pathRewrite: {
            '^/uploadImgToken': ''
        },
      }
    },
    overlay: { // 全屏模式下是否显示脚本错误
      warnings: true,
      errors: true
    },
    before: app => {
    }
  },

  /**
   * 第三方插件配置
   */
  pluginOptions: {},

 
}

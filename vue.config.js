const jsdom = require('jsdom');
const { JSDOM } = jsdom;
module.exports = {
  configureWebpack: {
    // 跨域处理
    devServer: {
      // open: process.platform === 'darwin',
      // host: 'localhost',
      port: 8080,
      // open: true, //配置自动启动浏览器
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000/', // 对应自己的接口
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.(html)$/,
          exclude: /node_modules/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        }
      ]
    }
  },
  // 以下代码是安装了预渲染的插件之后自动添加的
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      // 配置需要预渲染的页面
      renderRoutes: [
        '/',
        '/recommend',
        '/singer',
        '/rank',
        '/search',
        '/account',
        '/detail'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      postProcess: route => {
        /* 解决预渲染中移动端适配问题 */
        // 取出填充的错误代码部分
        let reg = /<meta name="viewport".*user-scalable=no">/gi;
        let res = route.html.match(reg);
        // 将错误代码替换成空字符串
        route.html = route.html.replace(res[1], '');

        /*
        * 解决预渲染的页面刷新后加载界面不会隐藏
        * 原因跟移动端适配的问题大同小异，都是因为预渲染多添加的代码
        * */
        // 1.根据字符串创建一个网页
        let html = new JSDOM(route.html);
        // 2.从创建好的网页中拿到document对象
        let dom = html.window.document;
        // 3.找到对应的元素，删除对应的元素
        let loadingEle = dom.querySelector('.container');
        dom.body.removeChild(loadingEle);
        // 4.序列化网页成字符串
        route.html = html.serialize();
        // console.log(route);
        return route;
      }
    }
  }
};

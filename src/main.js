import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
// import VConsole from 'vconsole';
import './assets/css/base.scss';
import Loading from './plugin/loading/index';
import MetaInfo from 'vue-meta-info';

Vue.use(MetaInfo);

Vue.use(Loading, {
  title: '加载中...'
});

Vue.use(VueLazyload, {
  // 可以通过配置loading来设置图片还未加载好之前的占位图片
  loading: require('./assets/images/loading.gif')

});
fastclick.attach(document.body);
Vue.config.productionTip = false;

// const vconsole = new VConsole();
// Vue.use(vconsole);
new Vue({
  router,
  store,
  render: h => h(App),
  // 以下代码是安装了预渲染的插件之后自动添加的
  mounted: () => document.dispatchEvent(new Event('x-app-rendered'))
}).$mount('#app');

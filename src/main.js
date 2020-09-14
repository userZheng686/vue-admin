import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'; 
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './router/permit'
//自定义全局组件
import "./icons/index.js"

Vue.use(VueCompositionApi);
Vue.use(ElementUI);

Vue.config.productionTip = false




// runtime 运行模式
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

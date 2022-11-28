import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import request from './utils/request'
import VueSession from 'vue-session'
import {before} from "lodash/function";
import './assets/iconfont/iconfont.css'

Vue.use(VueSession)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.request = request  //全局注册request，其他文件可通过this.request使用分装好的request实例

new Vue({
  router,
  render: h => h(App)

}).$mount('#app')



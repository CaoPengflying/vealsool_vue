import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iview';
import CommonUtil from './js/common';
import 'iview/dist/styles/iview.css';
Vue.use(iView);
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.CommonUtil = CommonUtil
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

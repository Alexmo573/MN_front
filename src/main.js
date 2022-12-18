import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Highlight from './common/js/Highlight.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.css'
import '@/assets/mock'
// 引入axios
import axios from 'axios'
// 挂载到vue原型链上
Vue.prototype.axios = axios
Vue.use(ElementUI)
Vue.use(Highlight)
Vue.config.productionTip = true
require('./assets/mock.js')

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

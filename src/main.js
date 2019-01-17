import Vue from 'vue'
import './plugins'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入v-chart组件
import VeBar from 'v-charts/lib/bar'
Vue.component('ve-bar', VeBar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
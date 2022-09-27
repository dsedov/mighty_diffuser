import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.config.productionTip = false
Vue.prototype.api_server = "http://17.185.240.235:8000/router"
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')


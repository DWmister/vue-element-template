import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import '@/styles/index.sass'
import '@/icons/components'
import '@/permission'
import http from './utils/request'
import i18n from './lang'
import { getToken } from '@/utils/auth'

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})
Vue.use(ElementUI, {
  size: getToken('size') || 'medium',
  i18n: (key: any, value: any) => i18n.t(key, value)
})

Vue.config.productionTip = false
Vue.prototype.$http = http
// Vue.use(http)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

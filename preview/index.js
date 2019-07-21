import './lib'
import Vue from 'vue'
import App from './app'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AttrComponent from './attr'
Vue.use(ElementUI)
Vue.use(AttrComponent)

new Vue(App).$mount('#app')

console.info('不要慌，"Method "$confirm" conflicts with an existing Vue instance method ..."错误完全在控制中，请忽略')

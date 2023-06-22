import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})

import uView from '@/uni_modules/uview-ui'
let mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)
Vue.use(uView)
app.$mount()
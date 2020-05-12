import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

// 开启小程序的下拉刷新enablePullDownRefresh:true
export default {
  config: {
    enablePullDownRefresh: true
  }
}

import Vue from "vue"
import App from "./App"

Vue.config.productionTip = false

// 将环境变量注入到Vue实例中
Vue.prototype.$env = process.env

App.mpType = "app"

const app = new Vue({
  ...App
})
app.$mount()

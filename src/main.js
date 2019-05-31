import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import Http from './until/Http'

Vue.use(ElementUI)
const $http = new Http()
Vue.prototype.$http = $http
let cookie = require('js-cookie')

// 监听路由
router.beforeEach((to, from, next) => {
  // 请求是否登录，如果没有登录，转接到登录页面
  if (!cookie.get('authorization') && to.path != '/login') {
    next('/login')
  }
  next()
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

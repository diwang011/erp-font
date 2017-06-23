import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import VueI18n from 'vue-i18n'
import locale  from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(ElementUI, { locale  })
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});
//Vue.use(VueI18n)            // 通过插件的形式挂载

// const i18n = new VueI18n({
//     locale: 'en-US',    // 语言标识
//     messages: {
//         'zh-CN': require('./common/lang/zh.js'),   // 中文语言包
//         'en-US': require('./common/lang/en.js')    // 英文语言包
//     }
// })
new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //i18n,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


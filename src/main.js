// import vue
import Vue from 'vue'

// import vue router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import 'bootstrap/dist/css/bootstrap.css'
import Login from './components/login/Login'
import Main from './components/main/Main'
import Edit from './components/new/Edit'
window.bus = new Vue()
const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/main',
    component: Main
  },
  {
    path: '/edit',
    component: Edit
  }
]

// create router
const router = new VueRouter({
  routes
})
window.router = router
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router
})

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Songs from '@/components/Songs'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs
    }
  ]
})

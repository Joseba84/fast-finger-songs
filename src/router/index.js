import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Songs from '@/components/Songs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/songs',
      name: 'songs',
      component: Songs
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
    
  ]
})

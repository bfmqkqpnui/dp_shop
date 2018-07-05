import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home/main/coreComponent'

import memberManager from '@/components/member/member'
import customManager from '@/components/custom/custom'
import orderManager from '@/components/order/order'
import customerPreferencesManager from '@/components/customerPreferences/customerPreferences'
import settingManager from '@/components/param/paramSettings'

import roomManager from '@/components/room/room'
import projectManager from '@/components/project/project'
import businessManager from '@/components/business/business'

import login from '@/components/login/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/back-h5',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/home/custom',
      component: home,
      meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
      },
      children: [{
        path: 'member',
        name: 'member',
        component: memberManager
      },
        {
          path: 'custom',
          name: 'custom',
          component: customManager
        },
        {
          path: 'order',
          name: 'order',
          component: orderManager
        },
        {
          path: 'customerPreferences',
          name: 'customerPreferences',
          component: customerPreferencesManager
        },
        {
          path: 'settings',
          name: 'param-settings',
          component: settingManager
        },
        {
          path: 'room',
          name: 'room',
          component: roomManager
        },
        {
          path: 'project',
          name: 'project',
          component: projectManager
        },
        {
          path: 'business',
          name: 'business',
          component: businessManager
        },]
    }
  ]
})

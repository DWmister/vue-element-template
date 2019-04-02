import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 5000)
    })
  },
  routes: [
    {
      path: '/redirect',
      component: Layout,
      meta: { hidden: true },
      children: [
        {
          path: '/redirect/:path*',
          component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: 'Dashboard',
      meta: { hidden: true },
      children: [{
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue')
      }]
    },
    {
      path: '/form',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Form',
          component: () => import(/* webpackChunkName: "form" */ '@/views/form/form.vue'),
          meta: { title: 'Form', icon: 'form' }
        }
      ]
    },
    {
      path: '/table',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'Table',
          component: () => import(/* webpackChunkName: "table" */ '@/views/table/table.vue'),
          meta: { title: 'Table', icon: 'table' }
        }
      ]
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})

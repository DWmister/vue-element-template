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
      children: [{
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
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
      path: '/upload',
      component: Layout,
      name: 'upload',
      redirect: 'noredirect',
      meta: { title: 'upload', icon: 'upload' },
      children: [
        {
          path: 'excel',
          component: () => import(/* webpackChunkName: "excel" */ '@/views/upload/excel.vue'),
          name: 'uploadExcel',
          meta: { title: 'uploadExcel', icon: 'excel' }
        },
        {
          path: 'pdf',
          component: () => import(/* webpackChunkName: "pdf" */ '@/views/upload/pdf.vue'),
          name: 'uploadPdf',
          meta: { title: 'uploadPdf', icon: 'pdf' }
        },
        {
          path: 'img',
          component: () => import(/* webpackChunkName: "img" */ '@/views/upload/img.vue'),
          name: 'uploadImg',
          meta: { title: 'uploadImg', icon: 'img' }
        }
      ]
    },
    // router-auto不能删除
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

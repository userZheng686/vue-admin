import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


// 引入布局组件
import Login from '@/views/Login'
import Layout from '@/views/Layout'


export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'login',
      hidden: true,
      meta: {
        name: "主页",
      }
    },
    {
      path: '/login',
      name: 'Login',
      hidden: true,
      meta: {
        name: "登录"
      },
      component: Login
    },
    {
      path: '/console',
      name: 'Console',
      redirect: 'index',
      meta: {
        name: "控制台",
        icon: 'console'
      },
      component: Layout,
      children: [
        {
          path: '/index',
          name: 'Index',
          meta: {
            name: "首页"
          },
          component : resolve => require(['../views/Console/index.vue'], resolve)
          // component: () => import('../views/Console/index.vue'),
        }
      ]
    },
    {
      path: '/info',
      name: 'Info',
      meta: {
        name: "信息管理",
        icon: 'info'
      },
      component: Layout,
      children: [
        {
          path: '/infoIndex',
          name: 'InfoIndex',
          meta: {
            name: "信息列表"
          },
          component : resolve => require(['../views/Info/index.vue'], resolve)
        },
        {
          path: '/infoCategory',
          name: 'InfoCategory',
          meta: {
            name: "信息分类"
          },
          component : resolve => require(['../views/Info/category.vue'], resolve)
        },
        {
          path: '/infoDetail',
          name: 'infoDetail',
          hidden: true,
          meta: {
            name: "信息详情"
          },
          component : resolve => require(['../views/Info/detail.vue'], resolve)
        }
      ]
    },
    {
      path: '/user',
      name: 'User',
      meta: {
        name: "用户管理",
        icon: 'user'
      },
      component: Layout,
      children: [
        {
          path: '/userIndex',
          name: 'UserIndex',
          meta: {
            name: "用户列表"
          },
          component : resolve => require(['../views/User/index.vue'], resolve)
        }
      ]
    },
  ]
})




import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import {
  Modal
} from 'iview'
import http from './http'

Vue.use(Router);


const router = new Router({
  mode: 'history',
  base: '/auth/bg/',
  linkActiveClass: 'current',
  routes: [{
      path: '/',
      name: 'main',
      redirect: '/index',
      component: resolve => require(['@/views/layout/layoutTmp/Vlayout.vue'], resolve),
      children: [{
        path: '/index',
        name: 'index',
        component: resolve => require(['@/views/index/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/Interface',
        name: 'Interface',
        component: resolve => require(['@/views/access/Interface/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/InterfacePool',
        name: 'InterfacePool',
        component: resolve => require(['@/views/access/InterfacePool/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/accessApp',
        name: 'accessApp',
        component: resolve => require(['@/views/access/accessApp/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/accessMenu',
        name: 'accessMenu',
        component: resolve => require(['@/views/access/menu/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/accessRole',
        name: 'accessRole',
        component: resolve => require(['@/views/access/role/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/accessBind',
        name: 'accessBind',
        component: resolve => require(['@/views/access/accessBind/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/access/bindMenu',
        name: 'bindMenu',
        component: resolve => require(['@/views/access/bindMenu/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/login/index.vue'], resolve),
      meta: {
        requireAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next();
  } else {
    if (store.state.authorization) {
      next();
    } else {
      Modal.confirm({
        content: '您还没有登录，请登录',
        onOk() {
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        },
        onCancel() {
          router.replace({
            path: '/'
          })
        }
      });
    }
  }
});

router.afterEach((to, from) => {
  // let accessUrl = to.path;
  // console.log('用户进入页面：' + accessUrl)
  // http.post(accessIn, {
  //     accessUrl: accessUrl
  // })
})

export default router;
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/@:id',
    name: 'Account',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
  },
  {
    path: '/@:id/blog',
    name: 'BlogList',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "BlogList" */ '../views/Blog/List.vue')
  },
  {
    path: '/chain',
    name: 'Chain',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "chain" */ '../views/Chain.vue')
  },
  {
    path: '/@:id/following',
    name: 'Following',
    component: () => import(/* webpackChunkName: "following" */ '../views/Follow/Following.vue')
  },
  {
    path: '/@:id/followers',
    name: 'Followers',
    component: () => import(/* webpackChunkName: "followers" */ '../views/Follow/Followers.vue')
  },
  {
    path: '/@:id/wallet',
    name: 'Wallet',
    component: () => import(/* webpackChunkName: "wallet" */ '../views/User/Wallet.vue')
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/User/Editor.vue')
  },
  {
    path: '/tag/:tag',
    name: 'Tag',
    component: () => import(/* webpackChunkName: "editor" */ '../views/Blog/Tag.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

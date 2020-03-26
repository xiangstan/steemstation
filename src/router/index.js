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
    path: '/account',
    name: 'Account',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
  },
  {
    path: '/blog',
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
    path: '/following',
    name: 'Follwing',
    component: () => import(/* webpackChunkName: "following" */ '../views/Follow/Following.vue')
  },
  {
    path: '/followers',
    name: 'Follwers',
    component: () => import(/* webpackChunkName: "followers" */ '../views/Follow/Followers.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

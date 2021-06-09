import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/public/Home";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/@:id",
    name: "Account",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "account" */ "@/views/Account")
  },
  {
    path: "/@:id/blog/:title",
    name: "BlogDetail",
    component: () => import(/* webpackChunkName: "BlogDetail" */ "@/views/blog/Detail")
  },
  {
    path: "/@:id/blog",
    name: "BlogList",
    component: () => import(/* webpackChunkName: "BlogList" */ "@/views/blog/List")
  },
  {
    path: "/@:id/following",
    name: "Following",
    component: () => import(/* webpackChunkName: "following" */ "@/views/follow/Following")
  },
  {
    path: "/@:id/followers",
    name: "Followers",
    component: () => import(/* webpackChunkName: "followers" */ "@/views/follow/Followers")
  },
  {
    path: "/@:id/wallet",
    name: "Wallet",
    component: () => import(/* webpackChunkName: "wallet" */ "@/views/user/Wallet")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import (/* webpackChunkName: "dashboard" */ "@/views/user/Dashboard")
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import(/* webpackChunkName: "editor" */ "@/views/blog/Editor")
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router

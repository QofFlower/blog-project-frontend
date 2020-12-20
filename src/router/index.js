import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Blogs from '../views/Blogs.vue'
import BlogEdit from '../views/BlogEdit.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Register from '../views/Register.vue'
// import Music from '../views/Music.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/', // 路径
    name: 'Index', // 名称
    redirect: {name: "Blogs"} //重定向到Blogs页面
  },
  
  {
    path: '/', // 路径
    name: 'Blogs', // 名称
    component: Blogs // 组件
  },

  {
    path: '/login', // 路径
    name: 'Login', // 名称
    component: Login // 组件
  },

  {
    path: '/register', // 路径
    name: 'Register', // 名称
    component: Register // 组件
  },

  {
    path: '/blog/add', // 路径
    name: 'BlogAdd', // 名称
    component: BlogEdit, // 组件
    meta:{
      requireAuth: true,
    }
  },

  {
    path: '/blog/:blogId', // blogId会被解析为传入的参数
    name: 'BlogDetail', // 名称
    component: BlogDetail // 组件
  },

  {
    path: '/blog/:blogId/edit', // blogId会被解析为传入的参数
    name: 'BlogEdit', // 名称
    component: BlogEdit // 组件
  },
  // {
  //   path: '/music',
  //   name: 'Music',
  //   component: Music
  // }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

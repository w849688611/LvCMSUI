import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Base from '@/views/Base'
import Auth from '@/views/auth/Auth'
import Admin from '@/views/auth/Admin'
import Role from '@/views/auth/Role'
import Category from '@/views/portal/Category'
import Post from '@/views/portal/Post'
import Comment from '@/views/portal/Comment'
import Single from '@/views/portal/Single'
import User from '@/views/user/User'
import UserGroup from '@/views/user/UserGroup'
import Template from '@/views/portal/Template'
import Nav from '@/views/portal/Nav'
import Slide from '@/views/portal/Slide'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/',
      name:'Base',
      component:Base,
      children:[
        {
          path:'/auth/auth',
          name:'Auth',
          component:Auth
        },
        {
          path:'/auth/admin',
          name:'Admin',
          component:Admin
        },
        {
          path:'/auth/role',
          name:'Role',
          component:Role
        },
        {
          path:'/portal/category',
          name:'Category',
          component:Category
        },
        {
          path:'/portal/post',
          name:'Post',
          component:Post
        },
        {
          path:'/portal/comment',
          name:'Comment',
          component:Comment
        },
        {
          path:'/portal/single',
          name:'Single',
          component:Single
        },
        {
          path:'/user/user',
          name:'User',
          component:User
        },
        {
          path:'/user/userGroup',
          name:'UserGroup',
          component:UserGroup
        },
        {
          path:'/portal/template',
          name:'Template',
          component:Template
        },
        {
          path:'/portal/nav',
          name:'Nav',
          component:Nav
        },
        {
          path:'/portal/slide',
          name:'Slide',
          component:Slide
        }
      ]
    }
  ]
})

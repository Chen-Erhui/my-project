import Vue from 'vue'
import Router from 'vue-router'

// 页面
// 首页
import Home from 'pages/Home/Home'
// 闪送超市
import Category from 'pages/Category/Category'
// 购物车页
import Cart from 'pages/Cart/Cart'
// 我的页
import Mine from 'pages/Mine/Mine'
// 登陆注册页
import Login from 'pages/Login/Login'
// 地址列表页
import Site from 'pages/Site/Site'
// 添加地址页
import AddSite from 'pages/Add-site/Add-site'
// 选择地区页
import SelectSite from 'pages/Select-site/Select-site'
// 编辑地址页
import EditSite from 'pages/Edit-site/Edit-site'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/category',
      component: Category,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/cart',
      component: Cart,
      meta: {
        notKeepAlive: false
      }
    },
    {
      path: '/mine',
      component: Mine,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/site',
      component: Site,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/addsite',
      component: AddSite,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/select-site',
      component: SelectSite,
      meta: {
        notKeepAlive: true
      }
    },
    {
      path: '/edit-site/:id',
      component: EditSite,
      meta: {
        notKeepAlive: true
      }
    }
  ]
})

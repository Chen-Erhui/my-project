// 获取主机地址
import api from '@/api'
import http from 'axios'

export default {
  // 设置bannar
  setBannar ({commit}) {
    let url = api.host + 'bannar'
    return http.get(url)
      .then(function (data) {
        commit('SET_BANNAR', data.data)
        return {status: true, msg: '获取bannar成功', data: data.data}
      })
  },
  // 获取所有的分类数据并设置给state中的classifys
  setClassifys ({commit}) {
    let url = api.host + 'classifys'
    return http.get(url)
      .then(function (data) {
        commit('SET_CLASSIFYS', data.data)
        return {status: true, msg: '获取分类数据成功', data: data.data}
      })
  },
  // 登录
  login ({commit}, phone) {
    // 首先验证是否有这个手机号
    let url = api.host + 'users?phone=' + phone
    return http.get(url)
      .then(function (data) {
        if (data.data.length > 0) {
          // 有数据->提取数据并保存到vuex的userInfo下
          commit('SAVE_USER', data.data[0])
          // 获取地址信息
          let getSiteApi = api.host + 'users/' + data.data[0].id + '/sites'
          http.get(getSiteApi)
            .then((data) => {
              commit('SAVE_SITES', data.data)
            })
          // 获取购物车数据
          let getCartsApi = api.host + 'users/' + data.data[0].id + '/carts'
          http.get(getCartsApi)
            .then(data => {
              // 保存购物车数据到store中
              commit('SAVE_CARTS', data.data)
            })
          // 返回登陆成功
          return {status: true, msg: '登陆成功'}
        } else {
          // 没有数据->注册
          let url = api.host + 'users'
          // 构造用户对象
          let newUser = {
            phone: phone,
            level: 'V0',
            current_score: 0,
            dif_score: '距下一等级还需 30 成长值',
            selectedSite: {}
          }
          // 将新创建的对象添加到数据库中
          return http.post(url, newUser)
            .then(function (data) {
              // 注册成功->保存到vuex的userInfo
              commit('SAVE_USER', data.data)
              return {status: true, msg: '注册成功'}
            })
        }
      })
      .catch(function () {
        // 如果有错误
        return {status: false, msg: '登录失败'}
      })
  },
  // 保存地址，并添加到该用户下的地址列表中
  addSite ({commit}, site) {
    // 首先将地址保存到数据库中
    // 拼接添加到地址列表中的路径
    let addSiteApi = api.host + 'sites'
    return http.post(addSiteApi, site)
      .then((data) => {
        if (data.data.id !== undefined) {
          site.id = data.data.id
          commit('ADD_SITE', site)
          return {status: true, msg: '添加地址成功', id: data.data.id}
        } else {
          return {status: false, msg: '添加地址失败'}
        }
      })
  },
  // 切换地址列表页中所选的地址
  changeSelectedSite (store, site) {
    // 切换数据库中的用户所选地址
    let changeSelectedSiteApi = api.host + 'users/' + store.state.userInfo.id
    return http.get(changeSelectedSiteApi)
      .then((data) => {
        // 判断是不是获取到了数据
        if (data.data.id > 0) {
          data.data.selectedSite = site
          // 更改数据库中的当前用户的SelectedSite值
          return http.put(changeSelectedSiteApi, data.data)
        }
      })
      .then((data) => {
        // 更新vuex中的userInfo
        store.commit('CHANGE_SELECTED_SITE', site)
      })
  },
  // 更新地址
  changeSite (store, site) {
    let changeSiteApi = api.host + 'sites/' + site.id
    return http.put(changeSiteApi, site)
      .then(data => {
        if (data.data.id > 0) {
          store.commit('CHANG_SITES', site)
          return {status: true, msg: '更改地址成功'}
        }
      })
  },
  // 向购物车中添加商品
  addNum (store, product) {
    // 更改的是在vuex中的商品对象数量
    product.num++
    // 首先判断数据库是否已有本商品，如果已经存在就修改数量，如果没有就添加
    let userId = store.state.userInfo.id
    /*
      product_id: 商品id
      userId: 用户id
    */
    let getProductApi = api.host + 'carts?product_id=' + product.product_id + '&userId=' + userId
    return http.get(getProductApi)
      .then(data => {
        if (data.data.length > 0) {
          // 查找到了->更新这个商品对象的数量
          let productObj = data.data[0]
          productObj.num++
          // 更新store中的carts
          store.commit('UP_PRODUCT_NUM', productObj)
          // 更新数据库中的数据
          let addNumApi = api.host + 'carts/' + productObj.id
          return http.put(addNumApi, productObj)
        } else {
          // 没有，添加-》构造对象
          product.userId = userId
          // 向store中的carts添加
          store.commit('ADD_PRODUCT_NUM', product)
          // 向数据库中添加
          let addProductApi = api.host + 'carts'
          return http.post(addProductApi, product)
        }
      })
      .then(data => {
        if (data.data.id !== undefined) {
          return {status: true, msg: '添加商品成功'}
        }
      })
  },
  // 向购物车中减少商品
  downNum (store, product) {
  },
  // 购物车数量图标动画
  changeCartActive ({commit}) {
    commit('CART_ACTIVE_TRUE')
    setTimeout(() => {
      commit('CART_ACTIVE_FALSE')
    }, 300)
  }
}

export default {
  // 获取购物车中的商品总数
  cartsLen (state) {
    let result = 0
    for (var i = 0; i < state.carts.length; i++) {
      result += state.carts[i].num
    }
    return result
  }
}

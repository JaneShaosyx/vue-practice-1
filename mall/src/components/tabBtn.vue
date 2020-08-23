<template>
  <van-tabbar v-model="navActive" active-color="red">
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="orders-o">专题</van-tabbar-item>
    <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
    <van-tabbar-item icon="shopping-cart-o" to="/cart">购物车</van-tabbar-item>
    <van-tabbar-item icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  data() {
    return {
      navActive: 0,
    };
  },
  mounted() {
    switch (this.$route.path) {
      case "/category":
        this.navActive = 2;
        break;
      case "/":
        this.navActive = 0;
        break;
      default:
        this.navActive = 0;
    }
  },
};
</script>

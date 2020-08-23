<template>
  <div id="product">
    <van-nav-bar
      title="商品"
      left-arrow
      @click-left="onClickLeft"
      class="topNav"
    />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="swipeimg" v-lazy="image.img_url" />
      </van-swipe-item>
    </van-swipe>

    <div class="info">
      <span>30天无忧退货</span>
      <span>48小时快速退款</span>
      <span>满88元免邮费</span>
    </div>

    <div class="proInfo">
      <h3 class="name">{{ info.name }}</h3>
      <p class="brief">{{ info.goods_brief }}</p>
      <p class="price">￥{{ info.retail_price }}</p>
    </div>

    <van-cell title="请选择规格数量" value="内容" is-link />
    <!-- 商品参数 -->
    <div class="proParams">
      <h3>商品参数</h3>
      <div class="proItem" v-for="(item, index) in attribute" :key="index">
        <span class="title">
          {{ item.name }}
        </span>
        <span class="value">
          {{ item.value }}
        </span>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="proDetail" v-html="info.goods_desc"></div>
    <div style="height:50px"></div>

    <!-- 导航栏 -->
    <van-goods-action>
      <van-goods-action-icon
        :info="
          $store.state.cartTotal.goodsCount == 0
            ? ''
            : $store.state.cartTotal.goodsCount
        "
        to="/cart"
        icon="cart-o"
        text="购物车"
      />
      <van-goods-action-icon icon="star-o" text="已收藏" />
      <van-goods-action-button
        @click="chooseSku"
        type="warning"
        text="加入购物车"
      />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>

    <!-- 选择商品规格 -->
    <van-sku
      v-model="showSku"
      :sku="sku"
      :goods="goods"
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    />
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import { Lazyload } from "vant";
let sku = {
  // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
  // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
  tree: [
    // {
    //   k: "颜色", // skuKeyName：规格类目名称
    //   v: [
    //     {
    //       id: "30349", // skuValueId：规格值 id
    //       name: "红色", // skuValueName：规格值名称
    //     },
    //     {
    //       id: "1215",
    //       name: "蓝色",
    //     },
    //   ],
    //   k_s: "s1", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
    // },
  ],
  // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
  list: [
    {
      id: 2259, // skuId，下单时后端需要
      price: 100, // 价格（单位分）
      s1: "2", // 规格类目 k_s 为 s1 的对应规格值 id
      s2: "3", // 规格类目 k_s 为 s2 的对应规格值 id
      stock_num: 110, // 当前 sku 组合对应的库存
    },
  ],
  price: "1.00", // 默认价格（单位元）
  stock_num: 227, // 商品总库存
  collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
  none_sku: false, // 是否无规格商品
  hide_stock: false, // 是否隐藏剩余库存
};

export default {
  data() {
    return {
      data: {},
      info: {},
      attribute: {},
      showSku: false,
      sku: sku,
      goods: {},
      messageConfig: {},
    };
  },
  computed: {
    images: function() {
      if (this.data.gallery == undefined) {
        return [];
      }
      return this.data.gallery;
    },
  },
  methods: {
    onClickLeft: function() {
      this.$router.go(-1);
    },
    onBuyClicked: function() {
      this.showSku = false;
    },
    onAddCartClicked: async function(skuData) {
      //获取选中的商品，并且提交到后端的购物车api
      this.showSku = false;
      console.log(skuData);
      let post;
      if (this.sku.none_sku == false) {
        let chooseConent =
          skuData.selectedSkuComb["s1"] + "_" + skuData.selectedSkuComb["s2"];
        let res = this.data.productList.filter((item, index) => {
          if (item.goods_specification_ids == chooseConent) {
            return true;
          }
          return false;
        });
        console.log(res);
        post = await axios.post(this.$root.api.CartAdd, {
          goodsId: res[0].goods_id,
          number: skuData.selectedNum,
          productId: res[0].id,
        });
      } else {
        post = await axios.post(this.$root.api.CartAdd, {
          goodsId: skuData.selectedSkuComb.id,
          number: skuData.selectedNum,
          productId: this.data.productList[0].id,
        });
      }
      console.log(post);
      this.$store.commit("setCartList", post.data.data.cartList);
      this.$store.commit("setCartTotal", post.data.data.cartTotal);
    },
    chooseSku: function() {
      this.showSku = true;
    },
  },
  props: ["id"],
  async created() {
    this.$store.dispatch('AjaxCart');
    let res = await axios.get(this.$root.api.GoodsDetail, {
      params: { id: this.id },
    });
    this.data = res.data.data;
    this.info = this.data.info;
    this.attribute = this.data.attribute;
    this.goods.picture = this.info.primary_pic_url;
    this.goods.title = this.info.name;
    this.sku.price = Number(this.info.retail_price);
    this.sku.stock_num = Number(this.info.goods_number);
    let tree = [];
    let productList = [];
    if (this.data.productList[0].goods_specification_ids !== "") {
      this.sku.none_sku = false;
      this.data.specificationList.forEach((item, index) => {
        let arr = [];
        item.valueList.forEach((product, i) => {
          arr.push({
            id: product.id,
            name: product.value,
          });
        });
        tree.push({ k: item.name, v: arr, k_s: "s" + item.specification_id });
      });

      this.data.productList.forEach((item, index) => {
        productList.push({
          id: item.goods_id, // skuId，下单时后端需要
          price: Number(item.retail_price) * 100, // 价格（单位分）
          s1: item.goods_specification_ids.split("_")[0], // 规格类目 k_s 为 s1 的对应规格值 id
          s2: item.goods_specification_ids.split("_")[1], // 规格类目 k_s 为 s2 的对应规格值 id
          stock_num: item.goods_number,
        });
      });
    } else {
      this.sku.none_sku = true;
    }
    this.sku.collection_id = this.info.id;
    this.sku.tree = tree;
    this.sku.list = productList;
    
    console.log(this.sku.list);
    console.log(res.data);
  },
};
</script>

<style lang="less">
#product {
  .topNav {
    .van-icon {
      color: red;
    }
  }
  .swipeimg {
    width: 100%;
  }
  .info {
    display: flex;
    justify-content: space-around;
    font-size: 12px;
    color: #999;
    height: 24px;
    line-height: 24px;
    background-color: #efefef;
    span {
      position: relative;
    }

    span::before {
      content: "";
      display: block;
      position: absolute;
      left: -10px;
      top: 8px;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      border: 1px solid red;
    }
  }
  .proInfo {
    .name {
      font-weight: 500;
      margin: 0;
      padding: 10px 0 5px;
    }
    .brief {
      font-size: 12px;
      color: #999;
      margin: 0;
      padding: 3px;
    }
    .price {
      font-size: 16px;
      color: red;
      margin: 0;
      padding: 5px;
    }
  }
  .van-cell__title {
    text-align: left;
  }
  .proParams {
    padding-bottom: 20px;
    h3 {
      padding: 10px 0;
    }
    .proItem {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      height: 24px;
      color: #999;
      font-size: 12px;
      background-color: #efefef;
      line-height: 24px;
      text-align: left;
      span.title {
        width: 40px;
        padding: 0 10px;
        border-right: 1px solid #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span.value {
        width: 260px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .proDetail {
    width: 100%;
    img {
      width: 100%;
    }
    p {
      margin: 0;
      padding: 0;
      display: flex;
    }
  }
}
</style>

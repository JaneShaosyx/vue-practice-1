<template>
  <div id="cart">
    <van-nav-bar
      title="购物车"
      left-arrow
      @click-left="onClickLeft"
      class="topNav"
    />
    <div class="info">
      <span>30天无忧退货</span>
      <span>48小时快速退款</span>
      <span>满88元免邮费</span>
    </div>
    <div class="list">
      <div class="cartItem" v-for="(item, index) in cartList" :key="index">
        <van-checkbox
          @change="checkEvent($event, item)"
          v-model="item.checked"
          checked-color="red"
        ></van-checkbox>
        <van-image
          width="70"
          height="70"
          :src="item.list_pic_url"
          fit="cover"
        />
        <div class="descrip">
          <div class="title">
            <span class="name">{{ item.goods_name }}</span
            ><span class="num"> *{{ item.number }}</span>
          </div>
          <p class="brief">{{ item.goods_specifition_name_value }}</p>
          <p class="price">￥ {{ item.retail_price }}</p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-submit-bar
        :price="cartTotal.checkedGoodsAmount * 100"
        button-text="提交订单"
        @submit="onSubmit"
      >
        <van-checkbox v-model="checkedAll" checked-color="red"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <div style="height:50px"></div>
      <tabBtn class="nav"></tabBtn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import tabBtn from "../components/tabBtn.vue";
import axios from "axios";
let mapStateObj = mapState(["cartTotal", "cartList"]);
export default {
  data() {
    return {
      checked: true,
    };
  },
  components: { tabBtn },
  computed: {
    ...mapStateObj,
    checkedAll: {
      set() {},
      get() {
        if (this.cartTotal.goodsCount == this.cartTotal.checkedGoodsCount) {
          return true;
        }
        return false;
      },
    },
  },
  methods: {
    onSubmit: function() {},
    checkEvent: async function(event, item) {
      console.log(item);
      let res = await axios.post(this.$root.api.CartChecked, {
        isChecked: Number(event),
        productIds: item.product_id,
      });
      console.log(res);
      this.$store.commit("setCartList", res.data.data.cartList);
      this.$store.commit("setCartTotal", res.data.data.cartTotal);
    },
    onClickLeft:function(){
         this.$router.go(-1);
    },
  },
  created() {
    this.$store.dispatch("AjaxCart");
  },
};
</script>

<style lang="less">
#cart {
  .topNav {
    .van-icon {
      color: red;
    }
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
  .cartItem {
    padding: 0 5px;
    display: flex;
    align-content: center;
    padding: 10px 5px;
    .van-image {
      background-color: #efefef;
    }
    .van-checkbox {
      margin: 0 5px;
    }
    .descrip {
      padding: 0 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 70px;
      .title {
        font-size: 14px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .brief {
        margin: 0;
        color: #999;
        font-size: 12px;
      }
      .price {
        margin: 0;
      }
    }
    .bottom {
      display: flex;
      align-content: center;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 100px;
      .van-submit-bar {
        display: flex;
        order: 1;
        justify-content: space-between;
      }
      .nav {
        display: flex;
        order: 2;
        justify-content: space-between;
      }
    }
  }
}
</style>

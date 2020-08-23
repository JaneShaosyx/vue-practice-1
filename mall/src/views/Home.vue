<template>
  <div class="home" id="home">
    <van-search
      v-model="searchData"
      placeholder="商品搜索 共239款好物"
      input-align="center"
    />
    <van-swipe :autoplay="3000" :width="375" :height="200">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img class="swiperimg" v-lazy="image.image_url" />
      </van-swipe-item>
    </van-swipe>

    <!-- 五个图标 -->
    <van-grid :column-num="5">
      <van-grid-item
        v-for="(item, index) in channel"
        :icon="item.icon_url"
        :text="item.name"
        :key="index"
      />
    </van-grid>
    <!-- 品牌制造商直供板块 -->
    <div class="brandlist">
      <van-panel title="品牌制造商直供">
        <van-grid :column-num="2">
          <van-grid-item v-for="(item, index) in brandList" :key="index">
            <van-image lazy-load :src="item.new_pic_url" />
            <h4 class="title">{{ item.name }}</h4>
            <p class="price">{{ item.floor_price }}元起</p>
          </van-grid-item>
        </van-grid>
      </van-panel>
    </div>
    <!-- 新品首发板块 -->
    <div class="newGoodsList">
      <van-panel title="新品上架">
        <van-grid :column-num="2">
          <van-grid-item v-for="(item, index) in newGoodsList" :key="index">
            <van-image lazy-load :src="item.list_pic_url" />
            <p class="title van-ellipsis">{{ item.name }}</p>
            <p class="price">￥{{ item.retail_price }}</p>
          </van-grid-item>
        </van-grid>
      </van-panel>
    </div>
    <!-- 人气推荐板块 -->
    <div class="hotGoodsList">
      <van-panel title="人气推荐">
        <van-card
          v-for="(item, index) in hotGoodsList"
          :key="index"
          :price="item.retail_price"
          :desc="item.goods_brief"
          :title="item.name"
          :thumb="item.list_pic_url"
        />
      </van-panel>
    </div>
    <div style="height:50px"></div>
    <tabBtn></tabBtn>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import api from "../assets/config/api";
import Vue from "vue";
import { Lazyload } from "vant";
import tabBtn from "../components/tabBtn.vue";

Vue.use(Lazyload);

export default {
  name: "Home",
  data: function() {
    return {
      searchData: "",
      data: {},
      navActive: 0,
    };
  },
  computed: {
    images: function() {
      if (typeof this.data.banner == "object") {
        return this.data.banner;
      } else {
        return [];
      }
    },
    channel: function() {
      if (typeof this.data.channel == "object") {
        return this.data.channel;
      } else {
        return [];
      }
    },
    brandList: function() {
      if (typeof this.data.brandList == "object") {
        return this.data.brandList;
      } else {
        return [];
      }
    },
    newGoodsList: function() {
      if (typeof this.data.newGoodsList == "object") {
        return this.data.newGoodsList;
      } else {
        return [];
      }
    },
    hotGoodsList: function() {
      if (typeof this.data.hotGoodsList == "object") {
        return this.data.hotGoodsList;
      } else {
        return [];
      }
    },
  },
  components: { tabBtn },
  async mounted() {
    let res = await axios.get(api.IndexUrl);
    //console.log(res.data);
    this.data = res.data.data;
  },
};
</script>

<style lang="less">
#home {
  .swiperimg {
    width: 375px;
    height: 200px;
  }
  .brandlist {
    .van-grid-item__content {
      padding: 0px;
    }
    .van-image {
      border: 1px solid white;
    }
    .title {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .price {
      position: absolute;
      top: 35px;
      left: 10px;
      font-size: 14px;
      color: #999;
    }
  }
  .newGoodsList {
    .title {
      width: 150px;
      margin-bottom: 0;
    }
    .price {
      font-size: 14px;
      color: red;
      width: 90%;
      margin-top: 0;
    }
  }

  .hotGoodsList {
    .van-card__price {
      color: red;
      text-align: left;
    }
    .van-card__content {
      justify-content: center;
      text-align: left;
    }
    .van-card__title {
      font-weight: 900;
      color: #333;
      font-size: 14px;
      padding: 5px 0;
    }
  }
}
</style>

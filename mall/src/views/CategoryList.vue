<template>
  <div id="categoryList">
    <van-nav-bar
      title="分类列表"
      left-arrow
      @click-left="onClickLeft"
      class="topNav"
    />
    <van-tabs v-model="active">
      <van-tab
        v-for="(item1, index1) in clist"
        :key="index1"
        :title="item1.name"
      >
        <h3>{{ item1.name }}</h3>
        <p>{{ item1.front_name }}</p>

        <div v-if="item1.plist">
          <van-grid :border="true" :column-num="2">
            <van-grid-item
              v-for="(item2, index2) in item1.plist.data"
              :key="index2"
              :to="'/product/' + item2.id"
            >
              <van-image :src="item2.list_pic_url" />
              <h4 class="van-ellipsis">{{ item2.name }}</h4>
              <p class="price">￥{{ item2.retail_price }}</p>
              <!-- <van-card
                :price="item2.retail_price"
                :title="item2.name"
                :thumb="item2.list_pic_url"
              /> -->
            </van-grid-item>
          </van-grid>
        </div>
      </van-tab>
    </van-tabs>
    <!-- <div style="height:50px"></div>
    <tabBtn></tabBtn> -->
  </div>
</template>

<script>
import axios from "axios";
import tabBtn from "../components/tabBtn.vue";
export default {
  props: ["id"],
  data() {
    return {
      active: 0,
      data: {},
      clist: [],
      subData: {},
    };
  },
  components: { tabBtn },
  watch: {
    active: async function(index) {
      let id = this.clist[index].id;
      let page = 1;
      this.getlist(id, page);
    },
  },
  methods: {
    getlist: async function(cid, page, size = 20) {
      let res = await axios.get(this.$root.api.GoodsList, {
        params: { categoryId: cid, page, size },
      });
      return res.data.data;
    },
    onClickLeft:function(){
         this.$router.go(-1);
    },
  },
  async created() {
    let res = await axios.get(this.$root.api.GoodsCategory, {
      params: { id: this.id },
    });
    this.data = res.data.data;
    //列表
    this.clist = this.data.brotherCategory;
    this.clist.forEach(async (item, index) => {
      item.plist = await this.getlist(item.id, 1);
      this.$forceUpdate();
    });
  },
};
</script>

<style lang="less">
#categoryList {
  .topNav {
    .van-icon {
      color: red;
    }
  }
  .van-ellipsis {
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 0;
  }
  .van-grid-item {
    overflow: hidden;
  }
  .price {
    color: red;
  }
}
</style>

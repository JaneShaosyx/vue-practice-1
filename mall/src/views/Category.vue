<template>
  <div id="category">
    <van-search
      v-model="searchData"
      placeholder="商品搜索 共239款好物"
      input-align="center"
    />
    <van-tree-select
      :items="items"
      :main-active-index.sync="active"
      height="calc(100vh-104px)"
      @click-nav="changeRight"
    >
      <template #content>
        <div class="imgbanner">
          <img width="100%" :src="bannerImg" />
        </div>

        <van-grid :column-num="3">
          <van-grid-item
            v-for="(item, index) in subCategoryList"
            :key="index"
            :icon="item.wap_banner_url"
            :text="item.name"
            :to="'/categoryList/' + item.id"
          />
        </van-grid>
      </template>
    </van-tree-select>
    <tabBtn></tabBtn>
  </div>
</template>

<script>
import tabBtn from "../components/tabBtn.vue";
import api from "../assets/config/api";
import axios from "axios";
export default {
  data() {
    return {
      data: {},
      searchData: "",
      active: 0,
      subCategoryList: [],
      bannerImg: "",
    };
  },
  methods: {
    changeRight: function(index) {
      this.active = index;
    },
  },
  computed: {
    items: function() {
      if (this.data.categoryList == undefined) {
        return [];
      } else {
        let arr = [];
        this.data.categoryList.forEach((item, index) => {
          item.text = item.name;
          arr.push(item);
        });
        return arr;
      }
    },
  },
  components: {
    tabBtn,
  },
  watch: {
    active: async function() {
      if (this.items.length !== 0) {
        let id = this.items[this.active].id;
        let res = await axios.get(api.CatalogCurrent, { params: { id } });
        this.bannerImg = this.items[this.active].img_url;
        this.subCategoryList = res.data.data.currentCategory.subCategoryList;
      } else {
        this.subCategoryList = [];
      }
    },
  },
  async created() {
    let res = await axios.get(api.CatalogList);
    this.data = res.data.data;
    this.bannerImg = this.data.currentCategory.img_url;
    if (this.items.length !== 0) {
      let id = this.items[this.active].id;
      let res = await axios.get(api.CatalogCurrent, { params: { id } });
      this.subCategoryList = res.data.data.currentCategory.subCategoryList;
    } else {
      this.subCategoryList = [];
    }
  },
};
</script>

<style lang="less">
#category {
  .imgbanner {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
  }
}
</style>

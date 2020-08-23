import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import api from "@/assets/config/api.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartTotal: {
      checkedGoodsAmount: 0,
      checkedGoodsCount: 0,
      goodsAmount: 0,
      goodsCount: 0,
    },
    cartList:[],
  },
  mutations: {
    setCartList:function(state,cartList){
      state.cartList=cartList;
    },
    setCartTotal:function(state,cartTotal){
      state.cartTotal=cartTotal;
    }
  },
  actions: {
    AjaxCart:async function(content){
      let res= await axios.get(api.CartList)
      content.commit('setCartList',res.data.data.cartList);
      content.commit('setCartTotal',res.data.data.cartTotal);
    }
  },
  modules: {},
});

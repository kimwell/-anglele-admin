import Vuex from 'vuex'
import Vue from 'vue'
import * as api from '../api.js'
import * as types from './types'
import VueLocalStorage from 'vue-ls';
import axios from 'axios'


Vue.use(VueLocalStorage);
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: undefined,
    base: '',
    authorization: Vue.ls.get('authorization'),
    loginId: Vue.ls.get('loginId'),
    pushData: {
      body: '',
      code: '',
      time: '',
      title: '',
      type: ''
    },
    userCount: {
      buyIron: 0,
      buyOrder: 0,
      sellIron: 1,
      sellOrder: 1
    },
    pbShow: false,
    pbPanel: false
  },
  getters: {
    isLogin: state => {
      return state.user != undefined
    },
    roleId: state => {
      //写死的超管id,后期修改为从state user中获取
      return state.loginId
    },
    ajaxHead: state => {
      return {
        authorization: state.authorization,
        loginId: state.loginId
      }
    },
    user: state => {
      return state.user
    },
    base: state => {
      return state.base
    },
    pushData: state => {
      return state.pushData
    },
    userCount: state => {
      return state.userCount
    },
    pbShow: state => {
      return state.pbShow
    },
    usrType: state => {
      return state.base.usrType
    },
    isSellUser: state => {
      return state.user != undefined ? state.user.isSellUser == 1 : true
    },
    pbPanel: state => {
      return state.pbPanel
    }
  },
  mutations: {
    [types.LOGIN]: (state, payload) => {
      Vue.ls.set('authorization', payload.authorization);
      Vue.ls.set('loginId', payload.loginId);
      state.authorization = payload.authorization;
      state.loginId = payload.loginId;
    },
    [types.LOGOUT]: (state) => {
      Vue.ls.remove('authorization');
      Vue.ls.remove('loginId');
      state.authorization = undefined;
      state.loginId = undefined;
      state.user = undefined;
      state.base = '';
    },
    [types.SET_USER_INFO]: (state, payload) => {
      state.user = payload.buserInfo;
      delete payload.buserInfo;
      state.base = payload;
    },
    [types.UPDATE_USER_INFO]: (state, payload) => {
      state.user = payload;
    },
    [types.UPDATE_PRO_INFO]: (state, payload) => {
      state.user.proInfo = payload;
    },
    // 消息推送commit
    [types.UPDATE_PUSH_MSG]: (state, payload) => {
      state.pushData = payload;
    },
    //订单，求购数据存储
    [types.SAVE_USER_COUNT]: (state, payload) => {
      state.userCount = payload;
    },
    // 显示隐藏发布面板
    [types.SHOW_PUBLISH]: (state) => {
      state.pbShow = true;
    },
    [types.HIDE_PUBLISH]: (state) => {
      state.pbShow = false;
    },
    // 显示闭市发布求购面板
    [types.SHOW_PANEL]: (state) => {
      state.pbPanel = true
    },
    // 关闭闭市发布求购面板
    [types.HIDE_PANEL]: (state) => {
      state.pbPanel = false
    }
  },
  actions: {
    updateUserinfo(context, payload) {
      context.commit(types.UPDATE_USER_INFO, payload);
    },
    loginOut(context) {
      context.commit(types.LOGOUT);
    },
    getUserCount(context) {
      axios.post(api.getNums).then(res => {
        if (res.code === 1000) {
          context.commit(types.SAVE_USER_COUNT, res.data);
        }
      })
    },
    showPb(context) {
      context.commit(types.SHOW_PUBLISH)
    },
    hidePb(context) {
      context.commit(types.HIDE_PUBLISH)
    },
    updeatePush(context, payload) {
      context.commit(types.UPDATE_PUSH_MSG, payload)
    },
    showPanel(context) {
      context.commit(types.SHOW_PANEL)
    },
    hidePanel(context) {
      context.commit(types.HIDE_PANEL)
    }
  }
});
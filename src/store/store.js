import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'
import VueLocalStorage from 'vue-ls';


Vue.use(VueLocalStorage);
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: undefined,
    base: '',
    authorization: Vue.ls.get('authorization'),
    pushData: {
      body: '',
      code: '',
      time: '',
      title: '',
      type: ''
    }
  },
  getters: {
    isLogin: state => {
      return state.user != undefined
    },
    ajaxHead: state => {
      return {
        authorization: state.authorization
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
    }
  },
  mutations: {
    [types.LOGIN]: (state, payload) => {
      Vue.ls.set('authorization', payload.authorization);
      state.authorization = payload.authorization;
    },
    [types.LOGOUT]: (state) => {
      Vue.ls.remove('authorization');
      state.authorization = undefined;
      state.user = undefined;
      state.base = '';
    },
    [types.SET_USER_INFO]: (state, payload) => {
      state.user = payload.loginInfo;
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
    }
  },
  actions: {
    loginOut(context) {
      context.commit(types.LOGOUT);
    }
  }
});
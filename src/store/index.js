import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 全局变量配置
export default new Vuex.Store({
  state: {
    access_token: '',
    userInfo: {},
    client_info: {
      grant_type: "password",
      scope: "ROLE_USER",
      client_id: "c1",
      client_secret: "wufang",
    }
  },
  mutations: {
    //setter
    SET_TOKEN: (state, access_token) => {
      state.access_token = access_token
      localStorage.setItem("access_token", access_token) // 持久化到本地内存
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = JSON.parse(userInfo)
      sessionStorage.setItem("userInfo", userInfo)
    },

    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("userInfo", '')
    }
  },
  getters: {
    // getter
    getUser: state => {
      return state.userInfo
    },
    getClientInfo: state => {
      return state.client_info;
    }
  },
  actions: {

  },
  modules: {
  }
})

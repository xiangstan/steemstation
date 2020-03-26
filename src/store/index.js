import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Expands: {
      blog: false,
      login: false,
      profile: false,
      sms: false,
      token: false,
      unclaimed: false
    },
    Follow: {
      Followers: false,
      Following: false
    },
    Lang: false,
    Loading: false,
    Msg: {
      alert: false,
      code: false,
      text: ""
    },
    Profile: {},
    Steem: {
      chain: "steem",
      hive: "https://api.hive.blog",
      steem: "https://api.steemit.com",
      Library: false,
      Option: "https://api.steemit.com"
    },
    SteemId: false,
    User: {
      Profile: {},
      SteemId: ""
    }
  },
  mutations: {
    // generic update function
    UpdDataObj(state, data) {
      state[data.cat] = data.value;
    },
    // update expand sections
    UpdExpand(state, data) {
      state.Expands[data.cat] = data.value;
    },
    // update folowers/following
    UpdFollow(state, data) {
      state.Follow[data.cat] = data.value;
    },
    // update steemjs library
    UpdSteemJs(state, data) {
      state.Steem[data.cat] = data.value;
    }
  },
  actions: {
  },
  modules: {
  }
})

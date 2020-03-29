import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Chain: {
      Steem: {
        CurMHisPrice: false,
        GlobalProps: false,
        RewardFund: false
      }
    },
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
      Library: false,
      Option: "https://api.steemit.com"
    },
    SteemId: false,
    Toast: [
    ],
    User: {
      Blogs: false,
      Profile: {},
      SteemId: "",
      Tokens: []
    }
  },
  mutations: {
    // remove existing item from toasts
    PopToast(state, idx) {
      state.Toast = state.Toast.filter(t => t.id !== idx);
    },
    // push new item in toast
    PushToast(state, data) {
      state.Toast.push(data);
    },
    // update chain global properties
    UpdChainProp(state, data) {
      state.Chain[data.chain][data.obj] = data.value;
    },
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
    },
    // update user textContent
    UpdUserContent(state, data) {
      state.User[data.cat] = data.value;
    }
  },
  actions: {
  },
  modules: {
  }
})

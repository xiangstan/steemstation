import { createStore } from "vuex";
import Blogs from "./module/blogs";
import Chain from "./module/chain";
import Profile from "./module/profile";
import Show from "./module/show";

export default createStore({
  state: {
    Follow: {
      Followers: [],
      Following: false
    },
    Liker: [],
    SteemId: ""
  },
  mutations: {
    // update chain global properties
    UpdChainProp(state, data) {
      state.Chain[data.chain][data.obj] = data.value;
    },
    // generic update function
    UpdDataObj(state, data) {
      state[data.cat] = data.value;
    },
    // update folowers/following
    UpdFollow(state, data) {
      state.Follow[data.cat] = data.value;
    },
    // update profile
    UpdProf(state, data) {
      state.Profile[data.cat] = data.value;
    },
    // update show sections
    UpdShow(state, data) {
      state.Show[data.cat] = data.value;
    },
  },
  actions: {
  },
  modules: {
    Blogs,
    Chain,
    Profile,
    Show
  }
})

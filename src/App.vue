<template>
  <div id="app">
    <Navigation />
    <div class="main-content" v-if="SteemId">
      <div class="container has-text-left pt-5">
        <div class="columns">
          <div class="column is-one-quarter">
            <SteemProfile :steem="steem" />
          </div>
          <div class="column">
            <router-view v-slot="{ Component }">
              <transition
                mode="out-in"
                enter-active-class="animate__animated animate__fadeIn animate__faster"
                leave-active-class="animate__animated animate__fadeOut animate__faster"
              >
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Home />
      <Login v-if="$store.state.Show.login" ref="login" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/static/Footer";
import Home from "@/views/public/Home";
import Login from "@/views/public/Login";
import SteemProfile from "@/views/user/SteemProfile";
import Navigation from "@/components/static/Navigation";
import steem from "steem";

export default {
  name: "App",
  computed: {
    SteemId() {
      return this.$store.state.SteemId;
    }
  },
  components: {
    Footer,
    Home,
    Login,
    Navigation,
    SteemProfile
  },
  data() {
    return {
      steem: steem
    }
  },
  methods: {
    Init() {
      const steemId = localStorage.getItem("steemId");
      if (steemId) {
        const that = this;
        steem.api.getAccounts([steemId], function(err, result) {
          if (err === null) {
            that.$store.commit("UpdDataObj", {cat: "SteemId", value: steemId});
            that.$store.commit("UpdProf", {cat: "steem", value: result[0]});
            that.$store.commit("UpdShow", {cat: "login", value: false});
            that.$router.push({path: "/dashboard"});
          }
        });
      }
      this.SteemGetRewardFund();
      this.SteemGlobalProperties();
    },
    /* get reward fund */
    SteemGetRewardFund() {
      const that = this;
      steem.api.getRewardFund("post", (err, result) => {
        if (err) { console.error(err); }
        else {
          that.$store.commit("UpdChainProp", {chain: "steem", obj: "RewardFund", value: result});
        }
      });
    },
    // get steem chain global properties
    SteemGlobalProperties() {
      steem.api.getDynamicGlobalProperties((err, result) => {
        this.$store.commit("UpdChainProp", {chain: "steem", obj: "GlobalProps", value: result});
      });
    }
  },
  mounted() {
    this.Init();
  },
  started() {
    steem.api.setOptions({ url: 'https://api.steem.buzz' });
  }
}
</script>

<style lang="scss">
@import "bulma";
@import "@/assets/styles/main.scss";
</style>

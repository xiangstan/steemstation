<template>
  <div id="app">
    <Navigation />
    <div class="container has-text-left is-pad-top-5">
      <div class="columns">
        <div class="column is-one-quarter">
          <Profile :show="Expands.profile" ref="profile"></Profile>
        </div>
        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
    <Login v-if="Expands.login" ref="login" />
    <Menu v-if="SteemId" ref="menu" />
    <Toast />
    <Loading />
  </div>
</template>

<script>
import {Client} from "dsteem";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import Menu from "@/components/Menu";
import Profile from "@/components/Profile";
import Navigation from "./components/Navigation";
import Toast from "@/components/Toast/Main";
var steem = require("steem");

export default {
  name: "SteemStation",
  components: {
    Loading,
    Login,
    Menu,
    Navigation,
    Profile,
    Toast
  },
  computed: {
    Msg() {
      return this.$store.state.Msg;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId() {
      return this.$store.state.SteemId;
    },
    Expands() {
      return this.$store.state.Expands;
    }
  },
  created() {
    this.Init();
  },
  data() {
    return {
      Client: Client
    }
  },
  methods: {
    /* Display alert message */
    alert: function() {
      const that = this;
      window.setTimeout(() => {
        this.$store.commit("UpdDataObj", {cat: "Msg", value: { alert: false }});
      }, 4000);
    },
    Init() {
      this.$store.commit("UpdSteemJs", { cat: "Library", value: steem });
      const steemId = localStorage.getItem("steemId");
      let page = localStorage.getItem("page");
      this.$root.SteemGlobalProperties("Steem");
      window.setTimeout(() => {
        this.$root.SteemCurMedHisPrice();
        this.$root.SteemGetRewardFund();
      }, 100);
      if (steemId) {
        this.$root.SrcAccount(steemId);
      }
      this.$root.GetLang();
    },
  },
  mounted() {
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.background-token {
  background-color: #4a4a4a;
}
.background-token.token-title {
  padding: 0.75em 1em;
}
.button-expand {
  color:#fff!important;
  text-decoration: none!important;
}
.button-expand span {
  color: #fff;
  display: inline-block;
  text-align: center;
  width: 10px;
}
.is-marg-bottom-7 {
  margin-bottom: $size7;
}
.is-pad-top-5 {
  padding-top: $size5;
}
</style>

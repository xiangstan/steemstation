<template>
  <div id="app">
    <Navigation />
    <div class="container has-text-left is-pad-top-5">
      <div class="columns">
        <div class="column is-one-quarter">
          content
        </div>
        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
    <Login v-if="Expands.login" />
    <Menu v-if="SteemId" />
  </div>
</template>

<script>
import {Client} from "dsteem";
import Login from "@/components/Login";
import Menu from "@/components/Menu";
import Navigation from "./components/Navigation";
var steem = require("steem");

export default {
  name: "SteemStation",
  components: {
    Login,
    Menu,
    Navigation
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
      const steemId = localStorage.getItem("steemId");
      let page = localStorage.getItem("page");

      if (steemId) {
        this.$store.commit("UpdDataObj", {cat: "SteemId", value: steemId});
      }
      this.$store.commit("UpdSteemJs", { cat: "Library", value: steem });
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
.is-pad-top-5 {
  padding-top: $size5;
}
</style>

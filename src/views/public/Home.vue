<template>
  <div class="has-text-left">
    <section class="parallax has-text-left">
      <div class="container parallax-container">
        <div class="parallax-title">
          <h3 class="has-text-primary is-capitalized">
            {{Message["title"]}}
          </h3>
          <h2 class="is-size-2">STEEM STATION</h2>
          <h4 class="is-size-3">
            {{Message["sub"]}}
          </h4>
        </div>
        <a class="button-parallax is-capitalized is-size-4" @click="BtnLogin">
          {{$t("login")}}
        </a>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <div class="tile box is-parent is-horizontal">
            <div class="tile is-child is-2 pt-2">
              <nav class="panel datanav">
                <a class="panel-block is-capitalized" data-tile="status" @click="SetTile">
                  {{$t("node") + $t(" ") + $t("status")}}
                </a>
                <a class="panel-block is-capitalized" data-tile="properties" @click="SetTile">
                  {{$t("chain") + $t(" ") + $t("properties")}}
                </a>
              </nav>
            </div>
            <div class="tile is-child is-10 has-text-left px-4 py-2">
              <div v-if="Tiles === 'status'">
                <p class="is-size-5 has-text-weight-bold is-capitalized">
                  {{$t("node") + $t(" ") + $t("status")}}
                </p>
                <p v-if="load.ChainProperties === 0">
                  <font-awesome-icon class="fas fa-spin" icon="spinner" />
                  {{$t("loading")}}
                </p>
                <p class="notification is-danger" v-else-if="load.ChainProperties === -1">
                  Error loading data
                </p>
                <template v-else>
                  <p v-for="(value, idx) in ChainProperties" :key="idx">
                    <strong>{{idx}}:</strong> {{value}}
                  </p>
                </template>
              </div>
              <div v-else-if="Tiles === 'properties'">
                <p class="is-size-5 has-text-weight-bold">
                  {{$t("chain") + $t(" ") + $t("properties")}}
                </p>
                <Status />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about">
    </section>

    <section class="section witness">
      <Witness :steem="steem" />
    </section>

    <section class="section links">
      <div class="container">
        <a class="link-steemit" href="https://steemit.com">
          Steemit
        </a>
        <a class="link-steemit" href="https://steemit.com">
          SteemCN
        </a>
      </div>
    </section>

    <!--<section class="section contact">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 class="is-size-5 is-marg-bt-5">STEEM STATION</h2>
            <p class="is-size-7 is-marg-bt-5">
              <template v-if="Lang.index === 'cn'">
                STEEM STATION原本是<em>@lnakuma</em>出于爱好，练习STEEM区块链编程开始的。渐渐地，形成了一个整体前端网站。
              </template>
              <template v-else>
                STEEM STATION started as a hobby work by <em>@lnakuma</em>, who has tried to learn STEEM Blockchain programming. And next thing you know, there is a whole web app.
              </template>
            </p>
            <p class="has-text-grey-light is-size-7">
              <template v-if="Lang.index === 'cn'">
                本有由<em>@lnakuma</em>创建和维护
              </template>
              <template v-else>
                This site is powered and maintained by <em>@lnakuma</em>
              </template>
               © 2020.
            </p>
          </div>
          <div class="column">
            <h2 class="is-size-5 is-marg-bt-5">{{Lang.steem.contact_us}}</h2>
            <p class="is-size-7">
              Email:
            </p>
          </div>
          <div class="column">
            <h2 class="is-size-5 is-marg-bt-5">{{Lang.steem.follow_us}}</h2>
          </div>
        </div>
      </div>
    </section> -->

  </div>
</template>

<script>
import { createToast } from "mosha-vue-toastify";
import { hasKeychain } from "@/utils/steem/keychain";
import "mosha-vue-toastify/dist/style.css";
import Status from "@/components/steem/Status";
import Witness from "@/components/steem/Witness";

const message = {
  "cn": {
    sub: "一扇进入密码流的社交媒体网络的始点",
    title: "加入STEEM"
  },
  "en": {
    sub: "An Entry point for the cryptocurrent based Social Media Network",
    title: "GET STARTED WITH STEEM"
  }
}

export default {
  name: "Home",
  components: {
    Status,
    Witness
  },
  computed: {
    Message() {
      return message[this.$i18n.locale]
    }
  },
  data() {
    return {
      ChainProperties: false,
      load: {
        ChainProperties: 0,
      },
      Tiles: "status",
      Witness: false
    }
  },
  methods: {
    // open login modal
    BtnLogin() {
      if (hasKeychain()) {
        this.$store.commit("UpdShow", {cat: "login", value: true});
      }
      else {
        createToast(
          "Please install the STEEM Keychain extension first.",
          {
            showIcon: true,
            position: "bottom-right",
            type: "warning",
            transition: "slide"
          }
        );
      }
    },
    // load STEEM Gobal Properties
    GetChainProperties() {
      const that = this;
      that.steem.api.getChainProperties((err, result) => {
        if (result) {
          that.ChainProperties = result;
          that.load.ChainProperties = 1;
        }
        else {
          that.loadChainProperties = -1;
        }
      });
    },
    SetTile(e) {
      const tile = e.currentTarget.dataset.tile;
      this.Tiles = tile;
    }
  },
  mounted() {
    this.GetChainProperties();
  },
  props: {
    steem: {type: Object}
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/colors.scss";

section {
  min-height: 1px;
  padding: 160px 0;
}
section.links, section.contact {
  padding: 40px 0;
}
.about, .links {
  background: #f7f7f7;
}
.datanav {
  border-radius: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -o-box-shadow: none;
  box-shadow: none;
}
.link-steemit {
  color: #7a7a7a;
  display: inline-block;
  font-size: 1.5rem;
  margin: 0 0.75rem;
}
.link-steemit:hover {
  color: #06d6a9;
}
.link-steemit:first-child {
  margin-left: 0;
}
.parallax {
  background-attachment: fixed;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/img/blockchain.jpg");
  color: white;
}
.parallax-container {
  padding: 20px;
}
.parallax-title {
  margin-bottom: 2rem;
}
.button-parallax {
  background-color: transparent;
  border: 1px solid $primary;
  border-radius: 6px;
  color: $primary;
  padding: 10px 20px;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  width: auto;
}
.button-parallax:hover {
  background-color: $primary;
  -webkit-box-shadow: 0 0 10px #000;
  -moz-box-shadow: 0 0 10px #000;
  box-shadow: 0 0 10px #000;
  color: #fff!important;
}
@media only screen and (min-width: 769px) {
  .datanav {
    border-right: 1px solid #ededed;
  }
}</style>

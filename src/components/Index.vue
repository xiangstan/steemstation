<template>
  <div class="has-text-left" v-if="Lang">
    <section class="parallax has-text-left">
      <div class="container parallax-container">
        <div class="parallax-title">
          <h3 class="has-text-primary is-capitalized">
            <template v-if="Lang.index === 'cn'">
              加入STEEM
            </template>
            <template v-else>
              GET STARTED WITH STEEM
            </template>
          </h3>
          <h2 class="is-size-2">STEEM STATION</h2>
          <h4 class="is-size-3">
            <template v-if="Lang.index === 'cn'">
              一扇进入密码流的社交媒体网络的始点
            </template>
            <template v-else>
              An Entry point for the cryptocurrent based Social Media Network
            </template>
          </h4>
        </div>
        <a class="button-parallax is-size-4" @click="BtnLogin">
          {{Lang.steem.login}}
        </a>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="tile is-ancestor">
          <div class="tile box is-parent is-horizontal">
            <div class="tile is-child is-2 is-pad-top-5">
              <nav class="panel datanav">
                <a class="panel-block is-fullwidth" data-tile="status" @click="SetTile">
                  {{Lang.steem.node + Lang.steem.space + Lang.steem.status}}
                </a>
                <a class="panel-block" data-tile="properties" @click="SetTile">
                  {{Lang.steem.chain + Lang.steem.space + Lang.steem.properties}}
                </a>
              </nav>
            </div>
            <div class="tile is-child is-10 has-text-left is-pad-5">
              <div v-if="Tiles === 'status'">
                <p class="is-size-5 has-text-weight-bold">
                  {{Lang.steem.node + Lang.steem.space + Lang.steem.status}}
                </p>
                <p v-if="load.ChainProperties === '0'">
                  <i aria-hidden="true" class="fas fa-spinner fa-spin"></i>
                  {{Lang.steem.load + Lang.steem.ing}}
                </p>
                <p class="notification is-danger" v-else-if="load.ChainProperties==='-1'">
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
                  {{Lang.steem.chain + Lang.steem.space + Lang.steem.properties}}
                </p>
                <Status></Status>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about">
    </section>

    <section class="section witness">
      <Witness></Witness>
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

    <section class="section contact">
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
    </section>

  </div>
</template>

<script>
import Status from "@/components/Chain/Status";
import Witness from "@/components/Public/Witness";

export default {
  name: "Index",
  components: {
    Status,
    Witness
  },
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
  },
  data() {
    return {
      ChainProperties: false,
      load: {
        ChainProperties: "0",
      },
      Tiles: "status",
      Witness: false
    }
  },
  methods: {
    // open login modal
    BtnLogin() {
      this.$store.commit("UpdExpand", {cat: "login", value: true});
    },
    // load STEEM Gobal Properties
    GetChainProperties: function() {
      const that = this;
      that.$root.SteemApiNoQry("getChainProperties", (err, result) => {
        if (result) {
          console.log(result);
          that.ChainProperties = result;
          that.load.ChainProperties = "1";
        }
        else {
          that.loadChainProperties = "-1";
        }
      });
    },
    SetTile(e) {
      const tile = e.currentTarget.dataset.tile;
      this.Tiles = tile;
      console.log(tile);
    }
  },
  mounted() {
    this.GetChainProperties();
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

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
  background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/images/blockchain.jpg");
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

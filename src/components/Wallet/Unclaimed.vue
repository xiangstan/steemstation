<template>
  <div class="list" v-if="Lang">
    <div class="list-item background-token has-text-weight-bold has-text-white token-title">
      {{Lang.token.unclaimed_tokens}} <span v-if="TokenExpand">(<em>{{tkns.length}}</em>)</span>
      <a class="button-expand is-pulled-right" @click="fetchUnclaimed">[ <span>{{TokenExpandSign}}</span> ]</a>
    </div>
    <div v-if="TokenExpand">
      <div class="list-item" v-for="(tkn,idx) in tkns" :key="idx">
        <p class="notification is-warning" v-if="tkns.length===0">
          No more unclaimed tokens
        </p>
        <div class="columns" v-else>
          <div class="column is-one-quarter has-text-weight-semibold">
            {{tkn.symbol}}
          </div>
          <div class="column is-italic">
            {{tkn.value / Math.pow(10, tkn.precision)}}
          </div>
        </div>
      </div>
      <div class="list-item" v-if="TokenExpand && tkns.length > 0">
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" id="posting-key" type="password" placeholder="Posting Key">
          </div>
          <div class="control">
            <button class="button is-info" @click="claimToken">
              <font-awesome-icon icon="coins"></font-awesome-icon>
              &nbsp;
              {{Lang.token.claim_all}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
    // logged in Account
    LoggedIn() {
      return this.$store.state.SteemId;
    },
    // SteemJs library
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId() {
      return this.$store.state.User.SteemId;
    },
    TokenExpandSign() {
      return (this.TokenExpand) ? "-" : "+";
    },
    TokenExpand() {
      return this.$store.state.Expands.unclaimed;
    }
  },
  data: function() {
    return {
      tkns: []
    }
  },
  methods: {
    /* search tokens */
    fetchUnclaimed: function(e) {
      e.preventDefault();
      const that = this;
      that.$store.commit("UpdExpand", {cat: "unclaimed", value: !that.TokenExpand });
      that.tkns = [];
      if(this.TokenExpand && that.SteemId !== false){
        that.$store.commit("UpdDataObj", { cat: "Loading", value: true });
        axios.get("https://scot-api.steem-engine.com/@" + that.SteemId).then((result) => {
          for(let tkn in result.data){
            let content=result.data[tkn];
            if(content.pending_token > 0){
              that.tkns.push({symbol: content.symbol, value: content.pending_token, precision: content.precision});
            }
          }
          that.$store.commit("UpdDataObj", { cat: "Loading", value: false });
        });
      }
      else{ console.log("Nothing to do..."); }
    },
    /* claim tokens */
    claimToken: function(e) {
      e.preventDefault();
      const elemId = document.getElementById("posting-key")
      const key = elemId.value;
      if (!this.Steem.Library) {
        this.$root.AddToast("STEEM API not load correctly", "bad");
      }
      else if(key.length < 1) {
        this.$root.AddToast("Need to provide STEEM Posting Key", "bad");
      }
      else if(this.tkns.length < 1) {
        this.$root.AddToast("You do not have any unclaimed tokens", "warn");
      }
      else {
        that.$store.commit("UpdDataObj", { cat: "Loading", value: true });
        let json = [];
        let msg = "You have claimed ";
        const that = this;
        for(let tkn in this.tkns){
          json.push({ symbol: this.tkns[tkn].symbol });
          msg += "<strong style='margin-left:3px'><em>"+this.tkns[tkn].symbol+"</em></strong>";
          if(tkn < (this.tkns.length - 1)) { msg += ","; }
        }
        msg += "!";
        that.Steem.Library.broadcast.customJson(key, [], [that.SteemId], "scot_claim_token", JSON.stringify(json), (err, result) => {
          if (err !== null) {
            this.$parent.alert({
              alert: true,
              code: false,
              text: err
            });
          }
          else {
            elemId.value = "";
            this.$toasted.show(msg, {
              action: {
                text: "CLOSE",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              },
              duration: 10000,
              position: "top-right",
              theme: "bubble",
            });
            this.$store.commit("setLoading", false);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
</style>

<template>
  <div v-if="Lang && CheckProfile">
    <!-- STEEM Info -->
    <div class="message">
      <div class="message-header">
        {{Lang.steem.steem + Lang.steem.space + Lang.steem.wallet}}
      </div>
      <div class="message-body">
        <div class="content">
          <p><strong>{{Lang.steem[page.toLowerCase()]}}:</strong> {{Profile.balance}}</p>
          <!-- <p><strong>Steem Power:</strong> {{profile.balance}}</p> -->
          <p><strong>{{Lang.steem[page.toLowerCase()]}} Dollars:</strong> {{Profile.sbd_balance}}</p>
          <p><strong>{{Lang.profile.savings}}:</strong> {{Profile.savings_balance}}</p>
          <div class="line-break"></div>
          <p v-if="ChainMedianPrice">
            <strong>{{Lang.profile.steem_price}}:</strong> ${{ChainMedianPrice}}
          </p>
          <p v-if="ChainRecentClaim">
            <strong>Recent Claims:</strong> {{CommaSeparated(ChainRecentClaim / 1e9)}} B
          </p>
        </div>
      </div>
    </div>
    <!-- Tokens -->
    <Tokens></Tokens>
    <!-- Unclaimed -->
    <Unclaimed></Unclaimed>
    <!-- <button class="button" @click="Test">Test</button> -->
    <!-- End -->
  </div>
</template>

<script>
import Tokens from "@/components/Wallet/Tokens";
import Unclaimed from "@/components/Wallet/Unclaimed";

export default {
  components: {
    Tokens,
    Unclaimed
  },
  computed: {
    /* dynamic global properties */
    ChainGlobalProps() {
      return this.$store.state.Chain[this.page].GlobalProps;
    },
    /* dynmanic median price */
    ChainMedianPrice() {
      let temp = this.$store.state.Chain[this.page].CurMHisPrice;
      if (temp) {
        return parseFloat(temp.base.split(" ")[0]) / parseFloat(temp.quote.split(" ")[0]);
      }
      else { return false; }
    },
    /* recent claim */
    ChainRecentClaim() {
      if (this.ChainRewardFund) { return this.ChainRewardFund.recent_claims; }
      else { return false; }
    },
    /* steem reward fund */
    ChainRewardFund() {
      return this.$store.state.Chain[this.page].RewardFund;
    },
    // check if profile object is empty
    CheckProfile() {
      return (Object.keys(this.Profile).length > 0 && this.Profile.constructor === Object) ? true : false;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    Profile() { return this.$store.state.User.Profile; },
    // SteemJs library
    Steem() {
      return this.$store.state.Steem;
    },
    TokenExpands: function() { return this.$store.state.Expands; },
  },
  methods: {
    guidGenerator() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    CommaSeparated: function(value) {
      return parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    Test() {
      this.$root.AddToast(this.guidGenerator(), "good");
    }
  },
  props:{
    page: {type: String, default: "Steem"},
  }
};
</script>

<style scoped>
.message {
  -webkit-box-shadow: 0 0.5em 1em -0.125em rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.02);
  box-shadow: 0 0.5em 1em -0.125em rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.02);
}
.line-break {
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 1em;
}
</style>

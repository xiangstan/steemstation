<template>
  <div v-if="CheckProfile">
    <!-- STEEM Info -->
    <div class="message">
      <div class="message-header is-capitalized">
        STEEM{{$t(" ") + $t("wallet")}}
      </div>
      <div class="message-body">
        <div class="content">
          <p><strong>STEEM:</strong> {{Profile.balance}}</p>
          <!-- <p><strong>Steem Power:</strong> {{profile.balance}}</p> -->
          <p><strong>STEEM Dollars:</strong> {{Profile.sbd_balance}}</p>
          <p><strong>{{$t("savings")}}:</strong> {{Profile.savings_balance}}</p>
          <div class="line-break"></div>
          <p v-if="ChainMedianPrice">
            <strong>{{$t("steem_price")}}:</strong> ${{ChainMedianPrice}}
          </p>
          <p v-if="ChainRecentClaim">
            <strong>Recent Claims:</strong> {{CommaSeparated(ChainRecentClaim / 1e9)}} B
          </p>
        </div>
      </div>
    </div>
    <!-- End -->
  </div>
</template>

<script>
export default {
  computed: {
    /* dynamic global properties */
    ChainGlobalProps() {
      return this.$store.state.Chain.steem.GlobalProps;
    },
    /* dynmanic median price */
    ChainMedianPrice() {
      let temp = this.$store.state.Chain.steem.CurMHisPrice;
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
      return this.$store.state.Chain.steem.RewardFund;
    },
    // check if profile object is empty
    CheckProfile() {
      return (Object.keys(this.Profile).length > 0 && this.Profile.constructor === Object) ? true : false;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    Profile() { return this.$store.state.Profile.steem; },
    // SteemJs library
    Steem() {
      return this.$store.state.Steem;
    },
    TokenExpands() {
      return this.$store.state.Show;
    },
    User() {
      return this.$store.state.Profile.steem.name;
    }
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
  mounted() {
    const steemId = this.$route.params.id;
    if (typeof steemId !== "undefined") {
      if (steemId !== this.SteemId) {
        const that = this;
        that.steem.api.getAccounts([steemId], function(err, result) {
          if (err === null) {
            that.$store.commit("UpdProf", {cat: "steem", value: result[0]});
          }
        });
      }
    }
  },
  props: {
    steem: {type: Object}
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

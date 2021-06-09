<template>
  <div>
    <div v-if="CheckProfile">
      <!-- User Info -->
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-96x96">
                <img class="profile-image" :src="metadata.profile_image" :alt="Profile.name" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">
                {{metadata.name}}
                <span class="likr" v-if="likr">
                  <img src="/img/clap.png" />
                </span>
              </p>
              <p class="subtitle is-6 is-italic">@{{Profile.name}}</p>
              <p v-if="metadata.location">
                <font-awesome-icon class="icon-space" icon="map-marker-alt" />
                {{metadata.location}}
              </p>
            </div>
          </div>
          <div class="content">
            <p>{{metadata.about}}</p>
            <div class="is-6 field">
              <div class="social-media">
                <span class="icon-website" v-if="metadata.website">
                  <font-awesome-icon class="icon-space" :icon="['fab', 'chrome']" />
                  <a class="social-link" :href="metadata.website" target="_blank">{{metadata.website}}</a>
                </span>
                <span class="icon-linkedin" v-if="metadata.linkedin">
                  <font-awesome-icon class="fa-fw" :icon="['fab', 'fa-linkedin']" />
                  <a class="social-link" :href="'https://www.linkedin.com/in/' + metadata.linkedin" target="_blank">{{metadata.linkedin}}</a>
                </span>
                <span class="icon-facebook" v-if="metadata.facebook">
                  <font-awesome-icon class="icon-space" icon="map-marker-alt" /> {{metadata.facebook}}
                </span>
                <span v-if="metadata.youtube">
                  <i class="fab fa-youtube fa-fw"></i> {{metadata.youtube}}
                </span>
                <span v-if="metadata.instagram">
                  <font-awesome-icon class="fa-fw" :icon="['fab', 'fa-instagram']" /> {{metadata.instagram}}
                </span>
                <span class="icon-github" v-if="metadata.github">
                  <font-awesome-icon class="fa-fw" :icon="['fab', 'fa-github']" />
                  <a class="social-link" :href="'https://github.com/' + metadata.github" target="_blank">{{metadata.github}}</a>
                </span>
              </div>
            </div>
            <p>
              <font-awesome-icon class="icon-space" icon="clock" />
              {{$t("joined")}}:
              {{AccountCreated}}
            </p>
          </div>
        </div>
      </div>
      <!-- STEEM Info -->
      <div class="card">
        <div class="card-content">
          <div class="content">
            <p v-if="ChainGlobalProps">
              <strong>{{$t("steem_power")}}: </strong>
              <template v-if="ChainGlobalProps && ChainPower">
                {{CommaSeparated(CalcChainPower.toFixed(2))}}
                (<em>{{CommaSeparated(ChainPower.own)}} {{delegatedpower}}</em>)
              </template>
              <template v-else>
                <font-awesome-icon aria-hidden="true" class="fas fa-spin" icon=" fa-spinner" /> Loading...
              </template>
            </p>
            <p>
              <strong>{{$t("voting") + $t(" ") + $t("power")}}:</strong> {{ChainVotePower}}%
            </p>
            <p>
              <strong>{{$t("downvote") + $t(" ") + $t("power")}}:</strong> {{ChainDownPower}}%
            </p>
            <!-- <p>
              <strong>Upvote:</strong> ${{upvote}}
            </p> -->
          </div>
        </div>
      </div>
      <!-- End -->
    </div>
    <p class="notification is-danger" v-else>
      Provided account does not exist
    </p>
  </div>
</template>

<script>
import { cvtTime } from "@/utils/date";

export default {
  name: "SteemProfile",
  computed: {
    // convert Profile.created to local time
    AccountCreated() {
      return cvtTime(this.Profile.created) || "";
    },
    CalcChainPower() {
      return parseFloat(this.ChainPower.own) + this.CalcDelegated(this.ChainPower, true);
    },
    /* dynamic global properties */
    ChainGlobalProps() {
      return this.$store.state.Chain.steem.GlobalProps;
    },
    /* steem user self steem power */
    ChainPower() {
      /* https://steemit.com/utopian-io/@stoodkev/steemjs-for-dummies-2-calculate-the-user-s-steem-power */
      if (this.ChainGlobalProps) {
        return {
          own: parseFloat(this.steem.formatter.vestToSteem(this.Profile.vesting_shares, this.ChainGlobalProps.total_vesting_shares, this.ChainGlobalProps.total_vesting_fund_steem).toFixed(2)),
          delegated: parseFloat(this.steem.formatter.vestToSteem(
            this.Profile.delegated_vesting_shares,
            this.ChainGlobalProps.total_vesting_shares,
            this.ChainGlobalProps.total_vesting_fund_steem
          ).toFixed(2)),
          received: parseFloat(this.steem.formatter.vestToSteem(
            this.Profile.received_vesting_shares,
            this.ChainGlobalProps.total_vesting_shares,
            this.ChainGlobalProps.total_vesting_fund_steem
          ).toFixed(2))
        };
      }
      else { return false; }
    },
    // user down vote power
    ChainDownPower() {
      const sec = (new Date - new Date(this.Profile.downvote_manabar.last_update_time * 1000)) / 1000;
      const mana = this.Profile.downvote_manabar.current_mana / (this.Profile.voting_manabar.current_mana / (this.Profile.voting_power / 100) / 4);
      return Math.min((mana * 100 + (10000 * sec / 432000)) / 100, 100).toFixed(2);
    },
    /* user voting power */
    ChainVotePower() {
      /* https://steemit.com/utopian-io/@stoodkev/steem-js-for-dummies-1-how-to-calculate-the-current-voting-power */
      const sec = (new Date - new Date(this.Profile.last_vote_time + "Z")) / 1000;
      return Math.min((this.Profile.voting_power + (10000 * sec / 432000)) / 100, 100).toFixed(2);
    },
    /* steem reward fund */
    ChainRewardFund() {
      return this.$store.state.Chain.steem.RewardFund;
    },
    // check if profile object is empty
    CheckProfile() {
      return (Object.keys(this.Profile).length > 0 && this.Profile.constructor === Object) ? true : false;
    },
    /* steem user delegated power */
    delegatedpower() {
      return this.CalcDelegated(this.ChainPower, false);
    },
    likr() {
      const location = this.metadata.location;
      if(typeof location !=="undefined" && location !== "") {
        const loc = this.metadata.location.split(":");
        if( loc[0] === "likerid" ) { return loc[1]; }
        else { return false; }
      }
      else { return false; }
    },
    Lang() {
      return this.$store.state.Lang;
    },
    metadata() {
      if (this.Profile) {
        const temp = JSON.parse(this.Profile.json_metadata)
        return temp.profile;
      }
      else {
        return false;
      }
    },
    Profile() { return this.$store.state.Profile.steem; },
    /* check if to show vote power section box */
    ShowMoney() {
      const flag = {
        hive: true,
        splinterlands: false,
        steem: true
      }
      return flag[this.page] || false;
    },
  },
  methods: {
    CalcDelegated: function(value, status = false) {
      if(this.ChainPower){
        let received = parseFloat(this.ChainPower.received);
        let delegated = parseFloat(this.ChainPower.delegated);
        if (!status) {
          let sign = (received > delegated)? "+" : "-";
          return sign + " " + this.CommaSeparated(Math.abs(received - delegated));
        }
        else { return (received - delegated); }
      }
      else{ return false; }
    },
    CommaSeparated: function(value) {
      return parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  props: {
    steem: {type: Object}
  }
};
</script>

<style scoped>
.card{
  margin-bottom:1.25rem;
}
.card .content {
  overflow:hidden;
}
.profile-image {
  border-radius: 50%;
  border:5px solid #fff;
  box-shadow: 0px 0px 6px #444;
  height: 100%;
  width: 100%;
}
.icon-space {
  margin-right: 3px;
}
.icon-facebook {
  color:#3b5998;
}
.icon-github {
  color:#333;
}
.icon-linkedin {
  color:#0077b5;
}
.icon-website {
  color:#ea4335;
}
.likr {
  background-color: #28646e;
  -webkit-border: 3px solid #50e3c2;
  -moz-border: 3px solid #50e3c2;
  border: 3px solid #50e3c2;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  display: inline-block;
  height: 32px;
  padding: 0.374rem;
  position: relative;
  vertical-align: middle;
  width: 32px;
}
.likr img {
  display: block;
  margin: auto;
  padding-top: 2px;
  width: 90%;
}
.line-break {
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 1em;
}
.social-media span {
  display:block;
  width:100%;
}
.social-media .social-link{
  color:#4a4a4a!important;
}
</style>

<template>
  <div class="container has-text-left" v-if="Following">
    <p class="is-italic" v-if="Following.length < 1">
      {{$t("nothing_to") + $t(" ") + $t("load")}}
    </p>
    <div class="message">
      <div class="message-header">
        {{$t("following")}}
      </div>
      <div class="message-body">
        <p class="follow-item" v-for="(user, idx) in Following" :key="idx">
          <strong>{{user.following}}</strong>
          <span class="liker-hand" v-if="isLiker(user.following)">
            <img src="/img/clap.png" />
          </span>
          <span class="is-pulled-right">
            <router-link class="follow-icon" :title="$t('wallet')" :to ="{name: 'Wallet', params: {id: user.following}}">
              <font-awesome-icon icon="wallet" />
            </router-link>
            <router-link class="follow-icon" :title="$t('blog')" :to ="{name: 'BlogList', params: {id: user.following}}">
              <font-awesome-icon icon="book-open" />
            </router-link>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { isLikers } from "@/utils/likers.js";

export default {
  name: "Following",
  computed: {
    Following() {
      return this.$store.state.Follow.Following;
    },
    Likers() {
      return this.$store.state.Liker;
    },
    SteemId() {
      return this.$store.state.SteemId;
    },
    User() {
      return this.$store.state.Profile.steem.name;
    }
  },
  methods: {
    GetFollow(steemId, start = 0, limit = 1000) {
      const that = this;
      that.steem.api.getFollowing(steemId, start, "blog", limit, (err, result) => {
        if (err) {
          that.$store.commit("UpdFollow", [
            { "follower": '<p class="notification is-danger">Error: '+ err +'</p>' }
          ]);
        }
        else{
          that.$store.commit("UpdFollow", { cat: "Following", value: result });
        }
      });
    },
    // check if the selected steemid is a likeCoin registered account
    isLiker(steemId) {
      return (isLikers(steemId, this.Likers)) ? true : false;
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
      this.GetFollow(steemId);
//      this.$root.GetLiker();
    }
  },
  props: {
    steem: {type: Object}
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/follow.scss";
</style>

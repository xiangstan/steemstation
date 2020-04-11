<template>
  <div class="container has-text-left" v-if="Following">
    <p class="is-italic" v-if="Following.length < 1">
      {{Lang.follow.nothing_to + Lang.steem.load}}
    </p>
    <div class="message">
      <div class="message-header">
        {{Lang.follow.following}}
      </div>
      <div class="message-body">
        <p class="follow-item" v-for="(user, idx) in Following" :key="idx">
          <strong>{{user.following}}</strong>
          <span class="liker-hand" v-if="isLiker(user.following)">
            <img src="@/assets/images/clap.png" />
          </span>
          <span class="is-pulled-right">
            <router-link class="follow-icon" :title="Lang.steem.wallet" :to ="{name: 'Wallet', params: {id: user.following}}">
              <font-awesome-icon icon="wallet"></font-awesome-icon>
            </router-link>
            <router-link class="follow-icon" :title="Lang.steem.blog" :to ="{name: 'BlogList', params: {id: user.following}}">
              <font-awesome-icon icon="book-open"></font-awesome-icon>
            </router-link>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import MngLikers from "@/Func/Likers.js";

export default {
  name: "Following",
  computed: {
    Following() { return this.$store.state.Follow.Following; },
    Lang() { return this.$store.state.Lang; },
    Likers() {
      return this.$store.state.Liker;
    },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId: function() { return this.$store.state.SteemId; },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  data() {
    return {
      MngLikers: new MngLikers()
    }
  },
  methods: {
    // initial data pull
    Init(steemId) {
      this.$store.commit("UpdDataObj", { cat: "Loading", value: true });
      this.GetFollow(steemId);
    },
    GetFollow(steemId, start = 0, limit = 1000) {
      const that = this;
      window.setTimeout(function() {
        that.Steem.Library.api.getFollowing(that.SteemId, start, "blog", limit, (err, result) => {
          if (err) {
            that.$store.commit("UpdFollow", [
              { "follower": '<p class="notification is-danger">Error: '+ err +'</p>' }
            ]);
          }
          else{
            that.$store.commit("UpdFollow", { cat: "Following", value: result });
          }
          that.$store.commit("UpdDataObj", { cat: "Loading", value: false });
        });
      }, 100);
    },
    // check if the selected steemid is a likeCoin registered account
    isLiker(steemId) {
      return (this.MngLikers.isLiker(steemId, this.Likers)) ? true : false;
    }
  },
  mounted() {
    const steemId = this.$route.params.id;
    if (typeof steemId !== "undefined") {
      if (steemId !== this.User.SteemId) {
        this.$root.SrcAccount(steemId);
      }
      this.Init(steemId);
      this.$root.GetLiker();
    }
  }
};
</script>

<style scoped>
.follow-item {
  border-bottom: none;
  padding: 1.0rem 0.5rem;
}
.follow-item:hover {
  background-color: #fff;
}
.follow-icon {
  color: rgba(0, 0, 0, 0.6);
}
.follow-icon:not(:last-child) {
  margin: 0 20px;
}
</style>

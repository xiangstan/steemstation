<template>
  <div class="container has-text-left">
    <p class="is-italic" v-if="Followers.length < 1">
      {{$t("nothing_to") + $t(" ") + $t("load")}}
    </p>
    <div class="message">
      <div class="message-header">
        {{$t("follower")}}
      </div>
      <div class="message-body">
        <p class="follow-item" v-for="(user, idx) in Followers" :key="idx">
          <strong>{{user.follower}}</strong>
          <span class="is-pulled-right">
            <router-link class="follow-icon" :title="$t('wallet')" :to ="{name: 'Wallet', params: {id: user.follower}}">
              <font-awesome-icon icon="wallet" />
            </router-link>
            <router-link class="follow-icon" :title="$t('blog')" :to ="{name: 'BlogList', params: {id: user.follower}}">
              <font-awesome-icon icon="book-open" />
            </router-link>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
module.exports={
  computed: {
    Followers() {
      return this.$store.state.Follow.Followers;
    },
    SteemId() {
      return this.$store.state.SteemId;
    },
    User() {
      return this.$store.state.Profile.steem.name;
    }
  },
  methods: {
    GetFollow(steemId) {
      const that = this;
      that.steem.api.getFollowers(steemId, 0, "blog", 1000, (err, result) => {
        if (err) {
          that.$store.commit("UpdFollow", [
            { "follower": '<p class="notification is-danger">Error: '+ err +'</p>' }
          ]);
        }
        else {
          that.$store.commit("UpdFollow", { cat: "Followers", value: result });
        }
      });
    },
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

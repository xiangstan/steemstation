<template>
  <div class="container has-text-left" v-if="Followers">
      <p class="is-italic" v-if="Followers.length < 1">
        {{Lang.follow.nothing_to + Lang.steem.load}}
      </p>
      <div v-else>
        <h2 class="has-text-weight-bold is-size-3 is-capitalized">
          {{Lang.steem.your + Lang.steem.space + Lang.follow.follower}}
        </h2>
        <p v-for="(user, idx) in Followers" :key="idx">
          <a>{{user.follower}}</a>
        </p>
      </div>
  </div>
</template>

<script>
module.exports={
  computed: {
    Followers: function() { return this.$store.state.Follow.Followers; },
    Lang: function() { return this.$store.state.Lang; },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId: function() { return this.$store.state.SteemId; },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  methods: {
    GetFollow() {
      const that = this;
      window.setTimeout(function() {
        that.Steem.Library.api.getFollowers(that.SteemId, 0, "blog", 1000, (err, result) => {
          if (err) {
            that.$store.commit("UpdFollow", [
              { "follower": '<p class="notification is-danger">Error: '+ err +'</p>' }
            ]);
          }
          else{
            that.$store.commit("UpdFollow", { cat: "Followers", value: result });
          }
          that.$store.commit("UpdDataObj", { cat: "Loading", value: false });
        });
      }, 100);
    },
    // initial data pull
    Init() {
      this.$store.commit("UpdDataObj", { cat: "Loading", value: true });
      this.GetFollow();
    }
  },
  mounted() {
    this.Init();
  }
};
</script>

<style scoped>
</style>

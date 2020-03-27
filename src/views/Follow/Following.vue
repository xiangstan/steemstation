<template>
  <div class="container has-text-left" v-if="Following">
      <p class="is-italic" v-if="Following.length < 1">
        {{Lang.follow.nothing_to + Lang.steem.load}}
      </p>
      <div v-else>
        <h2 class="has-text-weight-bold is-size-3 is-capitalized">
          {{Lang.follow.following}}
        </h2>
        <p v-for="(user, idx) in Following" :key="idx">
          <a>{{user.following}}</a>
        </p>
      </div>
  </div>
</template>

<script>
module.exports={
  computed: {
    Following() { return this.$store.state.Follow.Following; },
    Lang() { return this.$store.state.Lang; },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId: function() { return this.$store.state.SteemId; },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  methods: {
    GetFollow(start = 0, limit = 1000) {
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

<template>
  <div class="field has-addons" v-if="Lang">
    <div class="control is-expanded">
      <input class="input" :placeholder="page.toUpperCase() + ' ID'" v-model="user" />
    </div>
    <div class="control">
      <a class="button is-info" data-method="main" @click="searchId">
        <font-awesome-icon class="fa-fw" icon="search"></font-awesome-icon>
        {{Lang.profile.search}}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    Expands() { return this.$store.state.Expands; },
    Lang() { return this.$store.state.Lang; },
    SteemId() { return this.$store.state.SteemId; }
  },
  data() {
    return {
      user: "",
      token: false
    };
  },
  methods: {
    searchId: function(e) {
      const steemId = this.user;
      for(let obj in this.Expands) {
        this.$store.commit("UpdExpand", {cat: obj, value: false});
      }
      //this.$store.commit("updFollowList", []);
      //this.$store.commit("setLoading", true);
      this.$root.$children[0].SrcAccount(steemId);
      //this.$parent.searchAccount(steemId);
    },
  },
  mounted() {
    this.user = this.SteemId || "";
  },
  props: {
    steem: {type: Object},
    page: {type: String, default: "steem"}
  }
};
</script>

<style scoped>
</style>

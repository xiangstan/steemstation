<template>
  <div v-if="Lang">
    <div class="message">
      <div class="message-header">
        {{Lang.steem.blog}}
      </div>
      <div class="message-body">
        <BriefEntry class="blog-entry is-relative" v-for="(blog, idx) in Blogs" :blog="blog" :key="idx"></BriefEntry>
      </div>
    </div>
  </div>
</template>

<script>
import BriefEntry from "@/views/Blog/BriefEntry";

export default {
  name: "BlogList",
  components: {
    BriefEntry
  },
  computed: {
    Blogs() {
      return this.$store.state.User.Blogs;
    },
    Lang() { return this.$store.state.Lang; },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId() { return this.$store.state.SteemId; },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  data() {
    return {
      url: "https://steemit.com"
    }
  },
  methods: {
    // fetch blog entries
    fetchBlog(steemId) {
      const that = this;
      that.$root.SteemApiQry("getDiscussionsByBlog", {tag: steemId, limit: 10}, function(error, result) {
        if (error === null) {
          that.$store.commit("UpdUserContent", {cat: "Blogs", value: result});
          that.$store.commit("UpdDataObj", { cat: "Loading", value: false });
        }
      });
    },
  },
  mounted() {
    const steemId = this.$route.params.id;
    if (typeof steemId !== "undefined") {
      if (steemId !== this.User.SteemId) {
        this.$root.SrcAccount(steemId);
      }
      this.fetchBlog(steemId);
    }
  }
}
</script>

<style scoped>
.blog-entry:not(:last-child) {
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 1rem;
  padding: 1em 0;
}
</style>

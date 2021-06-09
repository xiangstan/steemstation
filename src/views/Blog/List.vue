<template>
  <div>
    <div class="message">
      <div class="message-header">
        {{$t("blog")}}
      </div>
      <div class="message-body">
        <BriefEntry class="blog-entry is-relative" v-for="(blog, idx) in Blogs" :blog="blog" :user="User" :key="idx" />
      </div>
    </div>
  </div>
</template>

<script>
import BriefEntry from "@/views/blog/Brief";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

export default {
  name: "BlogList",
  components: {
    BriefEntry
  },
  computed: {
    Blogs() {
      return this.$store.state.Blogs;
    },
    SteemId() {
      return this.$store.state.SteemId;
    },
    User() {
      return this.$store.state.Profile.steem.name;
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
      this.steem.api.getDiscussionsByBlog({tag: steemId, limit: 10}, (err, result) => {
        if (err === null) {
          that.$store.commit("UpdDataObj", {cat: "Blogs", value: result});
        }
        else {
          createToast(
            err,
            {
              showIcon: true,
              position: "bottom-right",
              type: "bad",
              transition: "slide"
            }
          );
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
      this.fetchBlog(steemId);
    }
  },
  props: {
    steem: {type: Object}
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

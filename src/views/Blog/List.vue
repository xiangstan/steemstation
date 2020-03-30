<template>
  <div v-if="Lang">
    <div class="message">
      <div class="message-header">
        {{Lang.steem.blog}}
      </div>
      <div class="message-body">
        <div class="blog-entry is-relative" v-for="(blog, idx) in Blogs" :key="idx">
          <div>
            <h3 class="has-text-weight-bold is-size-4 is-marg-bottom-7">
              <a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{blog.title}}</a>
            </h3>
            <h4 class="is-marg-bottom-7">
              <strong>{{blog.author}}</strong> in <span class="blog-tag">{{blog.category}}</span> &#9830; {{CvtTime(blog.last_update)}}
            </h4>
            <div class="is-marg-bottom-7">
              <a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{GetBrief(blog.body)}}...</a>
            </div>
            <p>
              <font-awesome-icon icon="comment-alt"></font-awesome-icon> {{blog.children}}
              <span class="is-pulled-right">${{blog.pending_payout_value.split(" ")[0]}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogList",
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
    // call $root.CvtTime(time)
    CvtTime(time) {
      return this.$root.CvtTime(time);
    },
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
    /* create a brief description of blog content */
    GetBrief(data) {
      let temp = "";
      let div = document.createElement("div");
      div.innerHTML = data;
      temp = div.textContent || div.innerText || "";
      temp = temp.substring(0, 50);
      return temp;
    },
    GetUrl() {
      const opt = {
        steem: "https://steem.buzz",
        hive: "http://hive.log"
      };
      return opt[this.page];
    }
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
.blog-tag {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding: 5px;
}
.is-decoration-none {
  text-decoration: none!important
}
</style>

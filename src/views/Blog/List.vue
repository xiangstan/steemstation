<template>
  <div v-if="Lang">
    <div class="message">
      <div class="message-header">
        {{Lang.steem.blog}}
      </div>
      <div class="message-body">
        <div v-for="(blog,idx) in Blogs" :key="idx">
          <h3 class="has-text-weight-bold is-size-4"><a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{blog.title}}</a></h3>
          <h4><strong>{{blog.author}}</strong> in {{blog.category}} {{blog.last_update}}</h4>
          <div>
            <a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{GetBrief(blog.body)}}...</a>
          </div>
          <div class="line-break" v-if="idx<(Blogs.length-1)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    Lang() { return this.$store.state.Lang; },
    Steem() {
      return this.$store.state.Steem;
    },
    SteemId() { return this.$store.state.SteemId; },
    Blogs() {
      return this.$store.state.User.Blogs;
    },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  methods: {
    fetchBlog() {
      const that = this;
      that.$root.SteemApiQry("getDiscussionsByBlog", {tag: that.SteemId, limit: 10}, function(error, result) {
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
    this.fetchBlog();
  }
}
</script>

<style scoped>
.line-break {
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 1em;
  margin-top: 2em;
}
.is-decoration-none {
  text-decoration: none!important
}
</style>

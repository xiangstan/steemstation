<template>
  <div>
    <h3 class="has-text-weight-bold is-size-5 is-marg-bottom-7">
      <a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{blog.title}}</a>
    </h3>
    <h4 class="is-size-7 is-marg-bottom-7">
      <strong>{{blog.author}}</strong> in <span class="blog-tag">{{blog.category}}</span> &#9830; {{CvtTime(blog.last_update)}}
    </h4>
    <div class="is-size-6 is-marg-bottom-7">
      <a class="is-decoration-none" :href="GetUrl()+blog.url" target="_blank">{{GetBrief(blog.body)}}...</a>
    </div>
    <p>
      <span class="icon-section">
        <a data-vote="10000" @click="Vote">
          <font-awesome-icon class="vote-icon vote-icon-up" icon="chevron-circle-up"></font-awesome-icon>
        </a> &nbsp;
        <a data-vote="-10000" @click="Vote">
          <font-awesome-icon class="vote-icon vote-icon-down" icon="chevron-circle-down"></font-awesome-icon>
        </a>
      </span>
      <font-awesome-icon icon="comment-alt"></font-awesome-icon> {{blog.children}}
      <span class="is-pulled-right">${{blog.pending_payout_value.split(" ")[0]}}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "BriefEntry",
  computed: {
    // check if steem_keychain extension is installed
    HasKeychain() {
      return (window.steem_keychain) ? true : false;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    LoggedIn() { return this.$store.state.SteemId; },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  methods: {
    // call $root.CvtTime(time)
    CvtTime(time) {
      return this.$root.CvtTime(time);
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
    },
    // vote up / down
    Vote(e) {
      const that = this;
      let value = e.currentTarget.dataset.vote;
      if (that.HasKeychain) {
        // account, permlink, author, weight, callback, rpc
        console.log(that.LoggedIn, that.blog.permlink, that.blog.author, value)
        window.steem_keychain.requestVote(that.LoggedIn, that.blog.permlink, that.blog.author, value, (r) => {
          console.log("I am here!")
          console.log(r);
          if (r.success) {
            //console.log(r);
            //that.Init();
          }
        });
      }
      else {
        this.$root.AddToast(this.Lang.errmsg.no_keychain, "bad");
      }
    }
  },
  props: {
    blog: { type: Object }
  }
}
</script>

<style scoped>
.blog-tag {
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding: 5px;
}
.is-decoration-none {
  text-decoration: none!important
}
.icon-section {
  display: inline-block;
  margin-right: 1rem;
}
.vote-icon {
  color: #aaa;
  -webkit-transition:all 500ms ease-in-out;
  -moz-transition:all 500ms ease-in-out;
  -ms-transition:all 500ms ease-in-out;
  transition:all 500ms ease-in-out;
}
.vote-icon-up:hover {
  color: #19d160
}
.vote-icon-down:hover {
  color: #FF3860
}
</style>

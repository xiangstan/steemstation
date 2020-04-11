<template>
  <div>
    <h3 class="has-text-weight-bold is-size-5 is-marg-bottom-7">
      <router-link class="is-decoration-none" :to="'/@' + User + '/blog/' + blog.permlink">
        {{blog.title}}
      </router-link>
    </h3>
    <h4 class="is-size-7 is-marg-bottom-7">
      <strong>{{blog.author}}</strong> in <span class="blog-tag">{{blog.category}}</span> &#9830; {{CvtTime(blog.last_update)}}
    </h4>
    <div class="is-size-6 is-marg-bottom-7">
      <router-link class="is-decoration-none" :to="'/@' + User + '/blog/' + blog.permlink">
        {{GetBrief(blog.body)}}...
      </router-link>
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
      <span class="liker-hand" v-if="isLiker(blog.author)">
        <img src="@/assets/images/clap.png" />
      </span>
      <span class="is-pulled-right">${{blog.pending_payout_value.split(" ")[0]}}</span>
    </p>
  </div>
</template>

<script>
import MngLikers from "@/Func/Likers.js";

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
    Likers() {
      return this.$store.state.Liker;
    },
    LoggedIn() { return this.$store.state.SteemId; },
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
    // check if the selected steemid is a likeCoin registered account
    isLiker(steemId) {
      return (this.MngLikers.isLiker(steemId, this.Likers)) ? true : false;
    },
    // vote up / down
    Vote(e) {
      const that = this;
      let value = e.currentTarget.dataset.vote;
      if (that.HasKeychain) {
        // account, permlink, author, weight, callback, rpc
        window.steem_keychain.requestVote(that.LoggedIn, that.blog.permlink, that.blog.author, value, (r) => {
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

<style lang="scss" scoped>
@import "@/scss/main.scss";

.is-decoration-none {
  text-decoration: none!important
}
</style>

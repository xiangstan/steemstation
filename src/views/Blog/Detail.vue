<template>
  <div v-if="Lang">
    <div class="card" v-if="blog">
      <div class="card-content">
        <h3 class="has-text-weight-bold is-size-5 is-marg-bottom-7">
          {{blog.title}}
        </h3>
        <div class="card blog-author">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure>
                  sdfsd
                </figure>
              </div>
              <div class="media-content">
                <p>
                  {{blog.author}} ({{Reputation}})
                  <span class="blog-tag">{{blog.category}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Post Content -->
        <div v-html="Converter.makeHtml(blog.body)"></div>
        <!-- Tags -->
        <hr />
        <p class="is-pad-tp-5">
          <a class="blog-tag-link" v-for="(tag, idx) in metadata.tags" :key="idx">
            <span class="blog-tag" v-if="tag.length > 0">
              {{tag}}
            </span>
          </a>
        </p>
        <p class="is-pad-tp-5">
          <span class="icon-section">
            <a data-vote="10000" @click="Vote">
              <font-awesome-icon class="vote-icon vote-icon-up" icon="chevron-circle-up"></font-awesome-icon>
            </a> &nbsp;
            <a data-vote="-10000" @click="Vote">
              <font-awesome-icon class="vote-icon vote-icon-down" icon="chevron-circle-down"></font-awesome-icon>
            </a> &nbsp;
            <a class="has-text-dark" @click="ShowVotes = !ShowVotes">{{blog.active_votes.length}}</a>
          </span>
          <span class="is-marg-hr-7">
            <font-awesome-icon icon="comment-alt"></font-awesome-icon> {{blog.children}}
          </span>
          <a class="has-text-dark is-marg-hr-7">
            <font-awesome-icon icon="retweet"></font-awesome-icon>
          </a>
          <span class="is-pulled-right">${{blog.pending_payout_value.split(" ")[0]}}</span>
        </p>
        <div class="is-pad-5" v-if="ShowVotes && blog">
          <div class="box">
            <h4 class="is-size-5 is-marg-bt-5">{{Lang.profile.voting}}</h4>
            <div class="columns is-multiline">
              <div class="column is-3" v-for="(vt, idx) in blog.active_votes" :key="idx">
                <div class="blog-tag is-size-7">
                  <strong>{{vt.voter}}</strong> <em class="is-pulled-right">{{vt.percent / 10000}}%</em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <!-- Comments -->
        <div v-if="replies">
          <Replies v-for="(reply, idx) in replies" :cmt="reply" :key="idx"></Replies>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="notification is-warning">
        Something went wrong.
      </p>
    </div>
  </div>
</template>

<script>
import {CalcReputation} from "@/Func/SteemFunc.js";
import Replies from "@/views/Blog/Replies";
import showdown from "showdown";

export default {
  name: "BlogDetail",
  components: {
    Replies
  },
  computed: {
    // check if steem_keychain extension is installed
    HasKeychain() {
      return (window.steem_keychain) ? true : false;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    LoggedIn() {
      return this.$store.state.SteemId;
    },
    // blog meta data
    metadata() {
      if (this.blog) {
        const temp = JSON.parse(this.blog.json_metadata)
        return temp;
      }
      else {
        return false;
      }
    },
    // calculate author reputation
    Reputation() {
      if (this.blog && typeof this.blog.author_reputation !== "undefined" ) {
        return CalcReputation(this.blog.author_reputation);
      }
      else { return 0; }
    },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  data() {
    return {
      blog: false,
      Converter: new showdown.Converter(),
      replies: false,
      ShowVotes: false
    }
  },
  methods: {
    // fetch blog entries
    Init(steemId, permlink) {
      this.GetBlog(steemId, permlink);
      this.GetReplies(steemId, permlink);
    },
    GetBlog(steemId, permlink) {
      const that = this;
      that.$root.Steem.Library.api.getContent(steemId, permlink, (error, result) => {
        if (result) {
          console.log(result);
          this.blog = result;
        }
      });
    },
    // get blog's replies
    GetReplies(steemId, permlink) {
      const that = this;
      that.$root.Steem.Library.api.getContentReplies(steemId, permlink, (error, result) => {
        if (result) {
          this.replies = result;
        }
      });
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
  mounted() {
    const steemId = this.$route.params.id;
    const title = this.$route.params.title;
    if (typeof steemId !== "undefined" && typeof title !== "undefined") {
      this.Init(steemId, title);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.blog-author {
  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}
.blog-tag {
  margin-right: 0.5rem;
}
.blog-tag-link {
  color: #4a4a4a;
}
</style>

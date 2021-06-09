<template>
  <div>
    <div class="card" v-if="blog">
      <div class="card-content">
        <h3 class="has-text-weight-bold is-size-5 mb-1">
          {{blog.title}}
        </h3>
        <div class="card blog-author">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure>

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
        <div class="content" v-html="Converter(blog.body)"></div>
        <!-- Tags -->
        <hr />
        <div v-if="isLiker">
          <iframe :src="'https://button.like.co/in/embed/' + GetLikerId + '/button?referrer=' + BlogUrl" frameborder="0" allowfullscreen="" scrolling="no"></iframe>
        </div>
        <p class="pt-3">
          <a class="blog-tag-link" v-for="(tag, idx) in metadata.tags" :key="idx">
            <span class="blog-tag" v-if="tag.length > 0">
              {{tag}}
            </span>
          </a>
        </p>
        <p class="pt-3">
          <span class="icon-section">
            <a data-vote="10000" @click="Vote">
              <font-awesome-icon class="vote-icon vote-icon-up" icon="chevron-circle-up" />
            </a> &nbsp;
            <a data-vote="-10000" @click="Vote">
              <font-awesome-icon class="vote-icon vote-icon-down" icon="chevron-circle-down" />
            </a> &nbsp;
            <a class="has-text-dark" @click="ShowVotes = !ShowVotes">{{blog.active_votes.length}}</a>
          </span>
          <span class="mx-1">
            <font-awesome-icon icon="comment-alt" /> {{blog.children}}
          </span>
          <a class="has-text-dark mx-1">
            <font-awesome-icon icon="retweet" />
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
import { CalcReputation } from "@/utils/steem/action.js";
import { isLikers } from "@/utils/likers.js";
import Replies from "./Replies";
import showdown from "showdown";
const convert = new showdown.Converter();

export default {
  name: "BlogDetail",
  components: {
    Replies
  },
  computed: {
    // get blog's url
    BlogUrl() {
      return window.location.href;
    },
    GetLikerId() {
      let temp = this.LikerId();
      return temp;
    },
    // check if steem_keychain extension is installed
    HasKeychain() {
      return (window.steem_keychain) ? true : false;
    },
    // check if the selected steemid is a likeCoin registered account
    isLiker() {
      if (!this.Likers) {
        return false;
      }
      else {
        return (isLikers(this.blog.author, this.Likers)) ? true : false;
      }
    },
    Likers() {
      return this.$store.state.Liker;
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
      return this.$store.state.Profile.steem.name;
    },
    UserMetaData() {
      if (this.UserProfile) {
        const temp = JSON.parse(this.UserProfile.json_metadata)
        return temp.profile;
      }
      else {
        return false;
      }
    },
  },
  data() {
    return {
      blog: false,
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
    // convert plain mardown to readable text
    Converter(data) {
      return convert.makeHtml(data)
    },
    GetBlog(steemId, permlink) {
      const that = this;
      that.steem.api.getContent(steemId, permlink, (error, result) => {
        if (result) {
          this.blog = result;
        }
      });
    },
    // get blog's replies
    GetReplies(steemId, permlink) {
      const that = this;
      that.steem.api.getContentReplies(steemId, permlink, (error, result) => {
        if (result) {
          this.replies = result;
        }
      });
    },
    LikerId() {
      const profile = this.$store.state.Profile.steem;
      const metadata = JSON.parse(profile.json_metadata)
      const location = metadata.profile.location;
      const loc = location.split(":");
      return loc[1];
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
  },
  props: {
    steem: {type: Object}
  }
}
</script>

<style lang="scss" scoped>
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
  display: inline-block;
  margin-bottom: 0.5rem;
}
.likecoin-button {
  bottom: 20px;
  position: fixed;
  right: 20px;
  height: 240px;
  width: 500px;
  overflow: hidden;
  z-index: 2000
}
.likecoin-button.elem-hide {
  display: none;
}
.likecoin-button > div {
  padding-top: 49.48454%;
}
.likecoin-button > iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -ms-zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.75);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.75);
  -webkit-transform-origin: 0 0;
}
</style>

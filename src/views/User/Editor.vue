<template>
  <div v-if="Lang">
    <template v-if="LoggedIn">
      <div class="field">
        <label class="label is-size-5">{{Lang.post.title}}</label>
        <div class="control">
          <input class="input" type="text" v-model="form.title" />
        </div>
      </div>
      <div class="field">
        <label class="label is-size-5">{{Lang.post.content}}</label>
        <div class="control">
          <vue-simplemde v-model="form.content" ref="markdownEditor" />
        </div>
      </div>
      <div class="field">
        <label class="label is-size-5">{{Lang.post.tag}}</label>
        <div class="control">
          <input class="input" type="text" v-model="form.tag" />
        </div>
      </div>
      <div class="field">
        <label class="label is-size-5">{{Lang.post.reward}}</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="form.reward">
              <option value="0">
                {{Lang.post.decline}}
              </option>
              <option value="50">
                50% SBD / 50% SP
              </option>
              <option value="100">
                Power Up 100%
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <button class="button" @click="Submit">{{Lang.post.post}}</button>
      </div>
    </template>
    <p class="notification is-danger" v-else>
      <template v-if="Lang.index==='cn'">请先登陆，再撰写文章。</template>
      <template v-else>Please log in first before write your post.</template>
    </p>
  </div>
</template>

<script>
import VueSimplemde from "vue-simplemde"

export default {
  name: "Editor",
  components: {
    VueSimplemde
  },
  computed: {
    // check if steem_keychain extension is installed
    HasKeychain() {
      return (window.steem_keychain) ? true : false;
    },
    Lang() {
      return this.$store.state.Lang;
    },
    // logged in Account
    LoggedIn() {
      return this.$store.state.SteemId;
    }
  },
  data() {
    return {
      form: {}
    }
  },
  methods: {
    // initialize form data
    Init() {
      this.form = {
        title: "",
        content: "",
        reward: 50,
        tag: ""
      }
    },
    // get comment_options
    GetCmtOpt() {
      return {
        "author": this.LoggedIn,
        "permlink": this.GetTitle(),
        "max_accepted_payout": "100000.000 SBD",
        "percent_steem_dollars": this.form.reward,
        "allow_votes": true,
        "allow_curation_rewards": true,
        "extensions":[
          [
            0,
            {
              "beneficiaries": [{"account": this.LoggedIn, "weight": 1000}]
            }
          ]
        ]
      }
    },
    // get json_medata
    GetJsonMd() {
      return JSON.stringify({ tags: this.TagList() });
    },
    // get post Title
    GetTitle() {
      let title = this.form.title.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-/, "").replace(/-+$/, "").toLowerCase();
          //title = title.replace(/(.)(?=.*\1)/g, "");
      if (title.length < 3) {
        title = this.RandomPermLink();
      }
      return title;
    },
    RandomPermLink() {
      return Math.random().toString(36).substring(2);
    },
    // submit posting
    Submit() {
      const that = this;
      if (this.HasKeychain) {
        if (this.Validate()) {
          const CommentOptions = this.GetCmtOpt();
          const tags = this.TagList();
          // account, title, body, parent_perm, parent_account, json_metadata, permlink, comment_options, callback, rpc
          //console.log(this.LoggedIn, this.form.title, this.form.content, tags[0], "", this.GetJsonMd(), CommentOptions.permlink, CommentOptions);
          window.steem_keychain.requestPost(this.LoggedIn, this.form.title, this.form.content, tags[0], "", this.GetJsonMd(), CommentOptions.permlink, JSON.stringify(CommentOptions), (r) => {
            console.log("I am here!")
            console.log(r);
            if (r.success) {
              console.log(r);
              that.Init();
            }
          });
        }
        else {
          this.$root.AddToast(this.Lang.errmsg.empty_post, "bad");
        }
      }
      else {
        this.$root.AddToast(this.Lang.errmsg.no_keychain, "bad");
      }
    },
    // split tags into array
    TagList() {
      return this.form.tag.split(" ");
    },
    // validate form data
    Validate() {
      let valid = true;
      for(let field in this.form) {
        if (this.form[field] === "" || !this.form[field]) {
          valid = false;
        }
      }
      return valid;
    }
  },
  mounted() {
    this.Init();
  }
};
</script>

<style scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>

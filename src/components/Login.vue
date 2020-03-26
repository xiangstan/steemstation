<template>
  <div class="modal modal-large is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left has-text-weight-bold is-capitalized">
          LOG IN
          <font-awesome-icon class="is-pulled-right" icon="times-circle"></font-awesome-icon>
        </p>
      </header>
      <section class="login-form">
        <div class="field">
          <label class="label is-sr-only">Email address</label>
          <div class="control">
            <input class="input" placeholder="Email Address or Account Name" type="text" v-model="form.account" />
          </div>
        </div>
        <p class="notification is-danger" v-if="errmsg.length > 0">
          {{errmsg}}
        </p>
        <div v-if="HasKeychain">
          <button class="button is-info is-pulled-right" @click="Login">
            <font-awesome-icon class="font-icon fa-fw" icon="key" />
            Log In with Keychain
          </button>
        </div>
        <div v-else>
          <p class="notification is-warning">
            Please use Keychain
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  computed: {
    HasKeychain() { return (window.steem_keychain) ? true : false; }
  },
  data() {
    return {
      errmsg: "",
      form: {},
    };
  },
  methods: {
    // log into the app
    Login(e) {
      e.preventDefault();
      this.errmsg = "";
      let account = this.form.account;
      if (typeof account === "undefined" || account.trim() === null) {
        this.errmsg = "Account name or key is missing";
      }
      else{
        account = this.Sanitize(account);
        if (this.HasKeychain) {
          account = account.trim();
          //window.steem_keychain.requestVerifyKey(account.trim(), Date.now(), "Posting", (r) => {
          window.steem_keychain.requestSignBuffer(account, account+Date.now(), "Posting", (r) => {
            if (r.success) {
              this.$root.SrcAccount(account, "login");
            }
          });
        }
        else {
          console.log("No KeyChain")
        }
      }
    },
    LoginPass(steemId, callback) {
      let key = this.form.password;
      if (key && key.startsWith("STM")) {
        if (callback)
            callback({
                success: false,
                error: "This appears to be a public key. You must use your private posting key to log in."
            });
        return
      }
      if (key && !this.Steem.auth.isWif(steemId)) {
        key = this.Steem.auth.getPrivateKeys(steemId, key, ["posting"]).posting
        console.log(key)
      }
    },
    Sanitize(steemId) {
      return steemId.toLowerCase().trim();
    }
  },
  props: {
    Steem: {type: Object}
  }
}
</script>

<style scoped>
.login-form {
  padding: 20px;
}
.modal-card {
  background-color: #fff;
}
</style>

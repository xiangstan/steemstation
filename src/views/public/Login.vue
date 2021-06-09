<template>
  <div class="modal modal-large is-active">
    <div class="modal-background"></div>
    <div class="modal-card has-text-left">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-weight-bold is-uppercase">
          {{$t("login")}}
          <a class="has-text-dark has-text-weight-normal">
            <font-awesome-icon class="is-pulled-right" icon="times-circle" @click="Close" />
          </a>
        </p>
      </header>
      <section class="login-form">
        <div class="field">
          <label class="label is-sr-only">Email address</label>
          <div class="control">
            <input class="input" placeholder="Account Name" type="text" v-model="form.account" />
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
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import steem from "steem";

export default {
  name: "Login",
  computed: {
    HasKeychain() {
      return (window.steem_keychain) ? true : false;
    }
  },
  data() {
    return {
      errmsg: "",
      form: {},
    };
  },
  methods: {
    // close log in window
    Close() {
      this.$store.commit("UpdShow", {cat: "login", value: false});
    },
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
          const that = this;
          account = account.trim();
          //window.steem_keychain.requestVerifyKey(account.trim(), Date.now(), "Posting", (r) => {
          window.steem_keychain.requestSignBuffer(account, account + Date.now(), "Posting", (r) => {
            if (r.success) {
              localStorage.setItem("steemId", account);
              that.$store.commit("UpdDataObj", {cat: "SteemId", value: account});
              that.SearchSteemAccount(account);
            }
          });
        }
        else {
          console.log("No KeyChain")
        }
      }
    },
    Sanitize(steemId) {
      return steemId.toLowerCase().trim();
    },
    // search Account
    SearchSteemAccount(account) {
      if (account === "") {
        createToast(
          "Need a STEEM ID",
          {
            showIcon: true,
            position: "bottom-right",
            type: "warning",
            transition: "slide"
          }
        );
      }
      else {
        const that = this;
        steem.api.getAccounts([account], function(err, result) {
          if (err === null) {
            console.log(result[0]);
            localStorage.setItem("steemId", account);
            that.$store.commit("UpdProf", {cat: "steem", value: result[0]});
            that.$store.commit("UpdShow", {cat: "login", value: false});
          }
          else {
            that.$store.commit("UpdDataObj", {cat: "Msg", value: {
              alert: true,
              code: false,
              text: err
            }});
          }
        });
      }
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

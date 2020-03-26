import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookOpen, faEdit, faKey, faLanguage, faSearch, faTh, faTimesCircle, faUserCircle, faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./../node_modules/bulma/css/bulma.min.css";

library.add(faBookOpen, faEdit, faKey, faLanguage, faSearch, faTh, faTimesCircle, faUserCircle, faUserFriends, faUserPlus)

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  computed: {
    Steem() {
      return this.$store.state.Steem;
    }
  },
  methods: {
    /* get Initial language pack */
    GetLang: function(lang = false) {
      if (!lang) {
        lang = localStorage.getItem("lang");
        if ( lang === null ) {
          lang = "en";
        }
      }
      localStorage.setItem("lang", lang);
      axios.get("./lang/" + lang + ".json")
        .then((result) => {
          this.$store.commit("UpdDataObj", { cat: "Lang", value: result.data });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // search user account
    SrcAccount(steemId, method) {
      const that = this;
      if (steemId === "") {
        this.$store.commit("UpdDataObj", {cat: "Msg", value: {
          alert: true,
          code: false,
          text: "Need a STEEM ID"
        }});
      }
      else {
        that.Steem.Library.api.getAccounts([steemId], function(err, result) {
          if (err === null) {
            if (method === "login" || localStorage.getItem("steemId")) {
              localStorage.setItem("steemId", steemId);
              that.$store.commit("UpdDataObj", {cat: "SteemId", value: steemId});
              that.$store.commit("UpdDataObj", {cat: "Profile", value: result[0]});
              that.$store.commit("UpdExpand", {cat: "login", value: false});
            }
            that.$store.commit("UpdUserContent", {cat: "SteemId", value: steemId});
            that.$store.commit("UpdUserContent", {cat: "Profile", value: result[0]});
            that.$store.commit("UpdExpand", {cat: "profile", value: true});
          }
          else{
            this.$store.commit("UpdDataObj", {cat: "Msg", value: {
              alert: true,
              code: false,
              text: err
            }});
          }
        });
      }
    },
    /* generic steem.api call with query parameter */
    SteemApiQry: function(api, query, callback) {
      this.Steem.Library.api[api](query, function(err, result) { callback(err, result); });
    }
  },
  render: h => h(App)
}).$mount('#app')

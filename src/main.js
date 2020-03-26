import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faKey, faLanguage, faSearch, faTh, faTimesCircle, faUserCircle, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./../node_modules/bulma/css/bulma.min.css";

library.add(faEdit, faKey, faLanguage, faSearch, faTh, faTimesCircle, faUserCircle, faUserFriends)

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
      console.log(lang)
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
    SrcAccount(steemId) {
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
            localStorage.setItem("steemId", steemId);
            that.$store.commit("UpdDataObj", {cat: "SteemId", value: steemId});
            that.profile = result[0];
            that.$store.commit("UpdDataObj", {cat: "Profile", value: result[0]});
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
    }
  },
  render: h => h(App)
}).$mount('#app')

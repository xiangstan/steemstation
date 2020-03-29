import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import ssc from "sscjs";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookOpen, faCheckCircle, faCommentAlt, faEdit, faKey, faLanguage, faSearch, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./../node_modules/bulma/css/bulma.min.css";

library.add(faBookOpen, faCheckCircle, faCommentAlt, faEdit, faKey, faLanguage, faSearch, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet)

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
  data() {
    return {
      ssc: new ssc("https://api.steem-engine.com/rpc/")
    }
  },
  methods: {
    AddToast(message, status, delay = 3000) {
      let toast = {
        delay: delay,
        id: new Date().getTime(),
        message: message,
        status: status
      };
      this.$store.commit("PushToast", toast);
    },
    // convert time to local timezone
    CvtTime(time) {
      const temp = new Date(time +".000Z");
      return temp.getFullYear() + "-" + ("0" + (temp.getMonth() + 1)).slice(-2) + "-" + ("0" + temp.getDate()).slice(-2) + " " + temp.getHours() + ":" + temp.getMinutes();
    },
    /* get Initial language pack */
    GetLang(lang = false) {
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
    /* Steem Engine Query */
    SscQuery(contract, table, query, limit = 1000, offset = 0) {
      return new Promise((resolve, reject) => {
        this.ssc.find(
          contract,
          table,
          query,
          limit,
          offset,
          [],
          (err, result) => {
            resolve(result);
          }
        );
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
    /* generic steem.api call without query parameter */
    SteemApiNoQry(api, callback) {
      this.Steem.Library.api[api]((err, result) => { callback(err, result); });
    },
    /* generic steem.api call with query parameter */
    SteemApiQry(api, query, callback) {
      this.Steem.Library.api[api](query, function(err, result) { callback(err, result); });
    },
    // get steem chain global properties
    SteemGlobalProperties() {
      const that = this;
      that.SteemApiNoQry("getDynamicGlobalProperties", (err, result) => {
        if (err === null) {
          that.$store.commit("UpdChainProp", {chain: "Steem", obj: "GlobalProps", value: result});
        }
      });
      //that.Steem.Library.api.getDynamicGlobalProperties((err, result) => {
    },
    /* current median history price */
    SteemCurMedHisPrice() {
      const that = this;
      that.SteemApiNoQry("getCurrentMedianHistoryPrice", (err, result) => {
        if (err) { console.error(err); }
        else {
          that.$store.commit("UpdChainProp", {chain: "Steem", obj: "CurMHisPrice", value: result});
        }
      });
    },
    /* get reward fund */
    SteemGetRewardFund() {
      const that = this;
      that.SteemApiQry("getRewardFund", "post", (err, result) => {
        if (err) { console.error(err); }
        else {
          that.$store.commit("UpdChainProp", {chain: "Steem", obj: "RewardFund", value: result});
        }
      });
    }
  },
  render: h => h(App)
}).$mount('#app')

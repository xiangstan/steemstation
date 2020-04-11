import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import ssc from "sscjs";
import MngDates from "@/Func/MngDates.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookOpen, faCheckCircle, faChevronCircleDown, faChevronCircleUp, faClock, faCoins, faCommentAlt, faEdit, faExclamationTriangle, faKey, faLanguage, faMapMarkerAlt, faRetweet, faSearch, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faChrome } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./../node_modules/bulma/css/bulma.min.css";

library.add(faBookOpen, faCheckCircle, faChevronCircleDown, faChevronCircleUp, faChrome, faClock, faCoins, faCommentAlt, faEdit, faExclamationTriangle, faKey, faLanguage, faMapMarkerAlt, faRetweet, faSearch, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet)

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
      MngDates: new MngDates(),
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
      return temp.getFullYear() + "-" + ("0" + (temp.getMonth() + 1)).slice(-2) + "-" + ("0" + temp.getDate()).slice(-2) + " " + ("0" + temp.getHours()).slice(-2) + ":" + ("0" + temp.getMinutes()).slice(-2);
    },
    GetLiker() {
      const RightNow = this.MngDates.Today();
      const LikerCheck = this.$store.state.Expands.likers;
      if (!LikerCheck || RightNow > LikerCheck) {
        this.GetFollowing("cn-likers");
      }
    },
    // get following
    GetFollowing(steemId, start = 0, limit = 1000) {
      const that = this;
      that.Steem.Library.api.getFollowing(steemId, start, "blog", limit, (err, result) => {
        if (result && result.length > 0) {
          result.forEach(following => {
            that.$store.commit("AddLiker", following.following);
          });
          //that.GetFollowing(steemId, result[result.length - 1].following, limit);
        }
      });
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
            if (method === "login" && localStorage.getItem("steemId")) {
              //localStorage.setItem("steemId", steemId);
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

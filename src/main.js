import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueNear from "vue-near";
// font awesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBookOpen, faChevronCircleDown, faChevronCircleUp, faClock, faCommentAlt, faDollarSign, faEdit, faKey, faLanguage, faMapMarkerAlt, faRetweet, faSearch, faSpinner, faSync, faTachometerAlt, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faChrome } from '@fortawesome/free-brands-svg-icons';

library.add(faBookOpen, faChrome, faChevronCircleDown, faChevronCircleUp, faClock, faCommentAlt, faDollarSign, faEdit, faKey, faLanguage, faMapMarkerAlt, faRetweet, faSearch, faSpinner, faSync, faTachometerAlt, faTh, faTimes, faTimesCircle, faUserCircle, faUserFriends, faUserPlus, faWallet);
dom.watch();

// multilanguage
import { createI18n } from "vue-i18n";
import { languages, defaultLocale } from "@/i18n/index.js"
const messages = Object.assign(languages)
const i18n = new createI18n({
  locale: defaultLocale,
  messages
});

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(store).use(i18n).use(router);
console.log(process.env.NODE_ENV);
app.use(VueNear, {
  // Needs the environment for the correct RPC to use
  //env: process.env.NODE_ENV || 'development',
  env: "development",
})

app.mount("#app");

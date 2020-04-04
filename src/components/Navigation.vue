<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </router-link>
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" class="navbar-menu" v-if="Lang">
        <div class="navbar-end">
          <div class="navbar-item" v-if="SteemId">
            <p class="control has-icons-left">
              <input class="input" type="text" v-model="srcData" @keyup.enter="Search" />
              <span class="icon is-small is-left">
                <font-awesome-icon icon="search"></font-awesome-icon>
              </span>
            </p>
          </div>
          <div class="navbar-item">
            <template v-if="SteemId">
              <router-link class="navbar-item" to="/editor">
                <font-awesome-icon icon="edit"></font-awesome-icon>
              </router-link>
              <div class="navbar-item" v-if="ProfileImg">
                <img class="navbar-image" :src="ProfileImg" />
              </div>
            </template>
            <div class="buttons" v-if="!SteemId">
              <a class="button is-light" @click="Login">
                {{Lang.steem.login}}
              </a>
            </div>
          </div>
          <Language></Language>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Language from "@/components/Language";

export default {
  name: 'Navigation',
  components: {
    Language
  },
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
    SteemId() {
      return this.$store.state.SteemId;
    },
    ProfileImg() {
      if (typeof this.$store.state.Profile !== "undefined") {
        const json = this.$store.state.Profile.json_metadata;
        if (typeof json !== "undefined") {
          const temp = JSON.parse(json);
          return temp.profile.profile_image;
        }
        else { return false; }
      }
      return false;
    }
  },
  data () {
    return {
      isOpen: false,
      srcData: "",
    }
  },
  methods: {
    // open login modal
    Login() {
      this.$store.commit("UpdExpand", {cat: "login", value: true});
    },
    // search bar
    Search() {
      let srcType = this.srcData[0];
      let srcTerm = this.srcData.slice(1);
      const srcMsg = {
        cn: "请用@（STEEM ID）或者#（Tag）开始搜索的讯息",
        en: "Please start your search with @ (STEEM ID) or # (Tag)"
      };
      const srcMethod = {
        "@": () => {
          this.$root.SrcAccount(srcTerm);
          this.$router.push("/@" + srcTerm);
          return;
        },
        "#": () => {
          this.$root.AddToast("功能尚未开放，Under development", "warn");
          //this.$router.push("/tag/" + srcTerm);
          return;
        }
      };
      if (typeof srcMethod[srcType] !== "function") {
        this.$root.AddToast(srcMsg[this.Lang.index], "bad");
      }
      else {
        srcMethod[srcType]()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-image {
  border-radius: 50%;
  box-shadow: 0px 0px 3px #444;
  height: 32px;
  width: 32px;
}

</style>

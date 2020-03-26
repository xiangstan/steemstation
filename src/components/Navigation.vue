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
        <div class="navbar-start">
          <router-link class="navbar-item" to="/chain">
            {{Lang.steem.chain}}
          </router-link>
          <router-link class="navbar-item" to="/steem">
            {{Lang.steem.steem}}
          </router-link>
          <router-link class="navbar-item" to="/hive">
            {{Lang.steem.hive}}
          </router-link>
        </div>
        <div class="navbar-end">
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
                Log in
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
        const temp = JSON.parse(this.$store.state.Profile.json_metadata);
        return temp.profile.profile_image;
      }
      return false;

    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    // open login modal
    Login() {
      this.$store.commit("UpdExpand", {cat: "login", value: true});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-image{
  border-radius: 50%;
  box-shadow: 0px 0px 3px #444;
  height: 32px;
  width: 32px;
}

</style>

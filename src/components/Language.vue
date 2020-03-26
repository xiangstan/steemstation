<template>
  <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link is-arrowless">
        <font-awesome-icon class="is-size-3" icon="language"></font-awesome-icon>
      </a>
      <div class="navbar-dropdown is-right">
        <a class="navbar-item">
          <a data-lang="en" @click="Select">English</a>
        </a>
        <a class="navbar-item">
          <a data-lang="cn" @click="Select">中文</a>
        </a>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    Select(e) {
      const lang = e.currentTarget.dataset.lang;
      this.Show = false;
      console.log(lang)
      this.$root.GetLang(lang);
    }
  },
  mounted() {
    console.log(this.$root)
  }
};
</script>

<style scoped>
</style>

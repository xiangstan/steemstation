<template>
  <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link is-arrowless">
        <font-awesome-icon class="is-size-3" icon="language" />
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
//import { getLang } from "@/utils/language";

export default {
  methods: {
    Select(e) {
      const lang = e.currentTarget.dataset.lang;
      localStorage.setItem("lang", lang);
      this.$i18n.locale = lang;
    }
  },
  mounted() {
    const lang = localStorage.getItem("lang");
    this.$i18n.locale = lang;
  }
};
</script>

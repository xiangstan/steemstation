<template>
  <div class="load-fullscreen" v-if="loading && Lang">
    <div class="load-dialog">
      <i aria-hidden="true" class="fas fa-spinner fa-spin"></i>
      {{Lang.steem.load + Lang.steem.ing}}
    </div>
  </div>
</template>

<script>
module.exports = {
  computed: {
    loading: function() { return this.$store.state.Loading; },
    Lang: function() { return this.$store.state.Lang; }
  }
}
</script>

<style scoped>
.load-fullscreen {
  background-color: rgba(0,0,0,0.1);
  display: block;
  height: 100%;
  left: 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}
.load-dialog {
  bottom: 0;
  display: block;
  font-weight: bold;
  left: 0;
  padding: 20px;
  position: fixed;
  margin: auto;
  text-align: left;
  width: 100%;
  z-index: 1001;
}
</style>

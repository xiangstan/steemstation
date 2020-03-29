<template>
  <div class="toast-container">
    <div class="toast-list">
      <ToastItem v-for="(item, idx) in toasts" :key="idx" :item="item"></ToastItem>
    </div>
  </div>
</template>

<script>
import ToastItem from "@/components/Toast/Item";

export default {
  name: "ToastMain",
  components: {
    ToastItem
  },
  computed: {
    toasts() {
      return this.$store.state.Toast;
    }
  }
}
</script>

<style scoped>
.toast-container {
  bottom: 0;
  position: fixed;
  right: 10px;
}
.toast-list {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -moz-flex;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;
  float: right;
  list-style: none;
  margin: 0;
  padding: 0;
  -ms-box-orient: horizontal;
}
</style>

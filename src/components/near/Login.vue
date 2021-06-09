<template>
  <div>
    <button class="button is-info" @click="Login">Login Near</button>
  </div>
</template>

<script>
export default {
  name: "NearWalletLogin",
  methods: {
    Login() {
      this.$near.loginAccount();
    }
  }
}
</script>

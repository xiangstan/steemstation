<template>
  <div>
    <p class="notification is-warning" v-if="nearId.length < 1">
      You are not connected to your Near Wallet.
      <a class="button is-info" @click="Login">Login Near</a>
    </p>
    <p class="notification is-success" v-else>
      You are connected to your Near Wallet <strong>{{nearId}}</strong>.
    </p>
  </div>
</template>

<script>
export default {
  name: "NearWalletLogin",
  computed: {
    nearId() {
      return this.$near.user.accountId;
    }
  },
  methods: {
    Login() {
      this.$near.loginAccount();
    }
  }
}
</script>

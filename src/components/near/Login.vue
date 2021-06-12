<template>
  <div>
    <p class="notification is-warning" v-if="typeof nearId !== 'undefined'">
      You are not connected to your Near Wallet, please
      <a class="is-warning" @click="Login">Login</a> your Near Account.
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

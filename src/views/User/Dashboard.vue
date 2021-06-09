<template>
  <div>
    <NearWalletLogin />
  </div>
</template>

<script>
import NearWalletLogin from "@/components/near/Login";

export default {
  name: "Dashboard",
  components: {
    NearWalletLogin
  },
  computed: {
    Profile() {
      return this.$store.state.Profile.steem;
    }
  }
}
</script>

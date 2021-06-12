<template>
  <div class="box" v-if="this.Profile && !loading">
    <div class="content">
      <h3 class="has-text-weight-bold is-size-4">
        Near{{$t(" ") + $t("wallet")}}
        <a class="has-text-black" @click="Refresh">
          <font-awesome-icon aria-hidden="true" class="fas" icon="sync" />
        </a>
      </h3>
      <p class="has-text-weight-semibold">
        {{Profile.accountId}}
      </p>
      <p>
        <font-awesome-icon class="icon-space" icon="dollar-sign" />
        {{(Profile.balance / (Math.pow(10, 24))).toFixed(5)}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NearProfile",
  computed: {
    Profile() {
      return this.$store.state.Profile.near
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    Refresh() {
      this.loading = true;
      this.$nextTick(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.$store.commit("UpdProf", {cat: "near", value: this.$near.user});
    console.log(this.$near)
  }
}
</script>

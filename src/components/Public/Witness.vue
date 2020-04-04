<template>
  <div class="container has-text-left" v-if="Witness">
    <h2 class="has-text-centered is-size-3">{{Lang.steem.witness + Lang.steem.space + Lang.steem.list}}</h2>
    <div class="list witness-list">
      <div class="list-item has-text-weight-bold">
        <div class="columns">
          <div class="column">
            {{Lang.steem.ranking}}
          </div>
          <div class="column">
            {{Lang.steem.witness}}
          </div>
          <div class="column">
            {{Lang.steem.votes}}
          </div>
          <div class="column">
            {{Lang.steem.blocks_missed}}
          </div>
          <div class="column">
            {{Lang.steem.last_block}}
          </div>
          <div class="column">
            {{Lang.steem.price_feed}}
          </div>
          <div class="column">
            {{Lang.steem.version}}
          </div>
        </div>
      </div>
      <div class="list-item" :class="cssWitness(wit.signing_key)" v-for="(wit, idx) in Witness" :key="idx">
        <div class="columns">
          <div class="column">
            {{idx + 1}}
          </div>
          <div class="column">
            {{wit.owner}}
          </div>
          <div class="column">
            {{parseInt(wit.votes / 100000000000)}}
          </div>
          <div class="column">
            {{wit.total_missed}}
          </div>
          <div class="column">
            {{wit.last_confirmed_block_num}}
          </div>
          <div class="column">
            {{wit.sbd_exchange_rate.base}}
          </div>
          <div class="column">
            {{wit.running_version}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Witness",
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
    Steem() {
      return this.$store.state.Steem;
    }
  },
  data() {
    return {
      Witness: false
    }
  },
  methods: {
    cssWitness(key) {
      let isEnabled = (key && key != 'STM1111111111111111111111111111111114T1Anm');
      let trClass = (isEnabled ? "" : "has-text-grey-light is-strike-through");
      return trClass
    },
    GetWitness() {
      const that = this;
      that.Steem.Library.api.getWitnessesByVote(null, 50, function(err, result) {
        if (result) {
          that.Witness = result;
        }
        else {
          console.error(err)
        }
      });
    }
  },
  mounted() {
    this.GetWitness();
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.list-item:nth-child(odd) {
  background: #f5f5f5
}
.witness-list {
  font-size: 0.8rem;
  margin: 0 auto;
  width: 70%;
}
</style>

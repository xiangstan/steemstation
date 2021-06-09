<template>
  <div class="container has-text-left" v-if="Witness">
    <div class="content">
      <h2 class="has-text-centered is-size-3">{{$t("witness") + $t(" ") + $t("list")}}</h2>
      <div class="list witness-list">
        <div class="list-item has-text-weight-bold">
          <div class="columns">
            <div class="column">
              {{$t("ranking")}}
            </div>
            <div class="column">
              {{$t("witness")}}
            </div>
            <div class="column">
              {{$t("votes")}}
            </div>
            <div class="column">
              {{$t("blocks_missed")}}
            </div>
            <div class="column">
              {{$t("last_block")}}
            </div>
            <div class="column">
              {{$t("price_feed")}}
            </div>
            <div class="column">
              {{$t("version")}}
            </div>
          </div>
        </div>
        <div class="list-item" :class="cssWitness(wit.signing_key)" v-for="(wit, idx) in Witness" :key="idx">
          <div class="columns">
            <div class="column">
              {{idx + 1}}
            </div>
            <div class="column">
              <a :href="'https://steemd.com/@' + wit.owner" target="_blank">{{wit.owner}}</a>
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
  </div>
</template>

<script>
export default {
  name: "Witness",
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
      that.steem.api.getWitnessesByVote(null, 50, function(err, result) {
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
  },
  props: {
    steem: {type: Object}
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  display: block;
  padding: 0.5em 1em;
}
.list-item:nth-child(odd) {
  background: #f5f5f5
}
.list-item:not(:last-child) {
  border-bottom: 1px solid #dbdbdb;
}
.list-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.witness-list {
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 0 auto;
  width: 70%;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}
</style>

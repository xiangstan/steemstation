<template>
  <div class="panel is-size-7">
    <p class="panel-heading">
      {{cmt.author}} ({{Reputation}}) &#9830; {{CvtTime(cmt.last_update)}}
    </p>
    <div class="panel-block is-pad-5">
      <div class="content" v-html="Converter.makeHtml(cmt.body)"></div>
    </div>
    <p class="panel-block has-background-white-bis">
      <span class="icon-section">
        <a data-vote="10000" @click="Vote">
          <font-awesome-icon class="vote-icon vote-icon-up" icon="chevron-circle-up"></font-awesome-icon>
        </a> &nbsp;
        <a data-vote="-10000" @click="Vote">
          <font-awesome-icon class="vote-icon vote-icon-down" icon="chevron-circle-down"></font-awesome-icon>
        </a> &nbsp;
        <a class="has-text-dark" @click="ShowVotes = !ShowVotes">{{cmt.active_votes.length}}</a>
      </span>
      <span>${{cmt.pending_payout_value.split(" ")[0]}}</span>
      <span class="liker-hand" v-if="isLiker(cmt.author)">
        <img src="@/assets/images/clap.png" />
      </span>
    </p>
  </div>
</template>

<script>
import {CalcReputation} from "@/Func/SteemFunc.js";
import MngLikers from "@/Func/Likers.js";
import showdown from "showdown";

export default {
  name: "Replies",
  computed: {
    Likers() {
      return this.$store.state.Liker;
    },
    Reputation() {
      if (this.cmt && typeof this.cmt.author_reputation !== "undefined" ) {
        return CalcReputation(this.cmt.author_reputation);
      }
      else { return 0; }
    },
  },
  data() {
    return {
      Converter: new showdown.Converter(),
      MngLikers: new MngLikers()
    }
  },
  methods: {
    // call $root.CvtTime(time)
    CvtTime(time) {
      return this.$root.CvtTime(time);
    },
    // check if the selected steemid is a likeCoin registered account
    isLiker(steemId) {
      return (this.MngLikers.isLiker(steemId, this.Likers)) ? true : false;
    },
    Vote() {}
  },
  props: {
    cmt: {type: Object}
  }
}
</script>

<style lang="scss" scoped>
</style>

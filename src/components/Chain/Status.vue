<template>
  <div class="message">
    <div class="message-header is-size-6">
      {{Lang.steem.node + Lang.steem.space + Lang.steem.status}}
    </div>
    <div class="message-body">
      <div class="columns is-multiline is-size-7">
        <div class="column is-4" v-for="(node, idx) in nodes" :key="idx">
          <div :class="'node-status notification is-' + node.css">
            <p>
              <strong class="is-size-6">{{node.name}}</strong>
              <br />
              <em><a :href="node.url" target="_blank" :title="node.name">{{node.url}}</a></em>
            </p>
            <p>
              {{Lang.steem.ping}}: {{node.ping}} <em>ms</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Status",
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
  },
  data() {
    return {
      nodes: [
        {css: "", name: "STEEM API", status: "", url: "https://api.steemit.com"},
        {css: "", name: "JUSTYY", status: "", url: "https://api.justyy.com"},
        {css: "", name: "61BTS S2", status: "", url: "https://s2.61bts.com"},
        {css: "", name: "BTS TW API", status: "", url: "https://api.steem.bts.tw"},
        {css: "", name: "Minnowsupport", status: "", url: "https://steemd.minnowsupportproject.org"},
        {css: "", name: "61bts STEEM", status: "", url: "https://steem.61bts.com"},
        {css: "", name: "STEEMD Dev", status: "", url: "https://steemd.steemitdev.com"},
        {css: "", name: "STEEMITDEV API", status: "", url: "https://api.steemitdev.com"},
        {css: "", name: "Privex", status: "", url: "https://steemd.privex.io"},
        {css: "", name: "BTS TW", status: "", url: "https://steem.bts.tw"}
      ]
    }
  },
  methods: {
    Init() {
      for(let i = 0; i < this.nodes.length; i++) {
        let start = Date.now();
        axios.get(this.nodes[i].url, {
          params: {
            timestamp: start
          }
        })
          .then((result) => {
            if (result.status === 200) {
              this.nodes[i].status = "OK";
              this.nodes[i].css = "success";
            }
            else {
              this.nodes[i].css = "warning";
            }
            let end = Date.now() - start;
            this.nodes[i].ping = end;
          })
          .catch((error) => {
            this.nodes[i].css = "danger";
            this.nodes[i].status = error.message;
            console.error(error);
          });
      }
    }
  },
  mounted() {
    console.log(axios);
    this.Init();
  },
  props: {
    detail: {type: Boolean}
  }
}
</script>

<style scoped>
.node-status.notification {
  padding: 0.5rem 0.75rem;
}
.node-status.notification p {
  overflow: hidden;
}
</style>

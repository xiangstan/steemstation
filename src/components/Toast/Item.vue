<template>
  <div class="toast-item is-relative">
    <transition name="toast">
      <div class="toast-message card">
        <div class="card-content has-text-light" :class="background">
          <div class="media">
            <div class="media-left">
              <font-awesome-icon :icon="icon"></font-awesome-icon>
            </div>
            <div class="media-content">
              {{item.message}}
            </div>
          </div>
        </div>
        <a class="toast-close" @click="Remove">
          <font-awesome-icon icon="times"></font-awesome-icon>
        </a>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ToastItem",
  computed: {
    background() {
      const color = {
        true: "success",
        false: "danger"
      };
      return "has-background-" + color[this.item.status]
    },
    icon() {
      const icon = {
        true: "check",
        false: "times"
      };
      return icon[this.item.status] + "-circle" || "check-circle";
    }
  },
  methods: {
    Remove() {
      console.log(this.item.id)
      this.$store.commit("PopToast", this.item.id);
    }
  },
  mounted() {
    window.setTimeout(this.Remove, this.item.delay);
  },
  props: {
    item: { type: Object }
  }
}
</script>

<style lang="scss" scoped>
$width: 400px;
/**
 * transition
**/
.toast-enter-active,
.toast-leave {
  opacity: 1;
}
.toast-enter,
.toast-leave-active {
  opacity: 0;
}
.toast-leave-active {
  position: absolute;
}
.toast-enter {
  transform: translateY(20px);
}
.toast-leave {
  transform: translateY(-100%) translateY(20px);
}
.toast-close {
  color: #fff;
  font-size: 16px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.toast-item {
  color: white;
  font-weight: bold;
  font-size: 1.0rem;
  text-align: center;
  line-height: 30px;
  margin: 5px;
  max-width: $width;
  padding: 2px 15px 2px 5px;
  width: auto;
}
.toast-message {
  transition: 400ms cubic-bezier(0.17, 0.67, 0.17, 0.98);
  transition-property: opacity, transform;
}
.toast-message .media-left {
  font-size: 1.6rem;
}
</style>

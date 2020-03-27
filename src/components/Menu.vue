<template>
  <header class="header" v-if="Lang">
    <nav class="is-relative">
      <ul class="header-navbar">
        <li class="header-item">
          <a class="header__link">
            <transition name="slide-fade">
              <!-- Header Navigation Menu Icons -->
              <button class="header-button" key="on" v-if="show" @click="show = !show">
                <font-awesome-icon class="a-fw header-icon" icon="times-circle"></font-awesome-icon>
              </button>
              <button class="header-button" key="off" v-else @click="show = !show">
                <font-awesome-icon class="fa-fw header-icon" icon="th"></font-awesome-icon>
              </button>
            </transition>
          </a>
          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div class="dropdownmenu" v-bind:class="{ active: show }" v-if="show">
              <ul class="">
                <li class="">
                  <router-link class="dropdownmenu-link" :title="Lang.steem.account" :to="{name: 'Account', params: {id: User}}">
                    <font-awesome-icon icon="user-circle"></font-awesome-icon>
                    <span class="dropdownmenu-text">{{Lang.steem.account}}</span>
                  </router-link>
                </li>
                <li class="dropdownmenu-item">
                  <router-link class="dropdownmenu-link" :title="Lang.steem.blog" :to ="{name: 'BlogList', params: {id: User}}">
                    <font-awesome-icon icon="book-open"></font-awesome-icon>
                    <div class="dropdownmenu-text">{{Lang.steem.blog}}</div>
                  </router-link>
                </li>
                <li class="">
                  <router-link class="dropdownmenu-link" :title="Lang.follow.follower" :to ="{name: 'Followers', params: {id: User}}">
                    <font-awesome-icon icon="user-friends"></font-awesome-icon>
                    <div class="dropdownmenu-text">{{Lang.follow.follower}}</div>
                  </router-link>
                </li>
                <li class="">
                  <router-link class="dropdownmenu-link" :title="Lang.follow.following" :to ="{name: 'Following', params: {id: User}}">
                    <font-awesome-icon icon="user-plus"></font-awesome-icon>
                    <div class="dropdownmenu-text">{{Lang.follow.following}}</div>
                  </router-link>
                </li>
                <!-- Dropdown Menu Separator -->
                <hr>
              </ul>
            </div>
          </transition>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Menu",
  computed: {
    Lang() {
      return this.$store.state.Lang;
    },
    User() {
      return this.$store.state.User.SteemId;
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  -webkit-transition: all 1s;
  transition: all 1s;
}
.dropdown-enter, .dropdown-leave-to {
  opacity: 0;
  -webkit-transform: translateY(30px);
          transform: translateY(30px);
}
.dropdownmenu {
  background-clip: padding-box;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 12px;
  height: 25rem;
  min-width: 250px;
  margin-top: 1rem;
  overflow-y: auto;
  padding: 2rem 1rem 2rem 0rem;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 5000;
}
.dropdownmenu-link {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
          align-items: center;
  -webkit-box-pack: start;
          justify-content: flex-start;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  padding: 0.8rem 0 0.8rem 2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0 50px 50px 0;
}
.dropdownmenu-text {
  font-weight: 300;
  margin-left: 1rem;
  margin-right: 1rem;
}
.header {
  position: fixed;
  right: 15px;
  top: 60px;
}
.header-button {
  top: 0;
  right: 0;
  position: absolute;
  margin: 0;
  padding: 0;
  color: gray;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: transparent;
}
.header-button:focus {
  outline: 0;
}
.header-navbar {
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: flex-end;
}
.header-icon {
  width: 1.25rem;
  height: 1.25rem;
}
.header-item {
  padding: 1rem;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  -webkit-transition: all 0.6s;
  transition: all 0.6s;
}
.slide-fade-enter,
.slide-fade-leave-active {
  opacity: 0;
}
.slide-fade-enter {
  -webkit-transform: translateX(31px);
          transform: translateX(31px);
}
.slide-fade-leave-active {
  -webkit-transform: translateX(-31px);
          transform: translateX(-31px);
}
@media only screen and (min-width: 1024px) {
  .header {
    right: 40px;
  }
}
</style>

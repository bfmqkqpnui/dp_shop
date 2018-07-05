<template>
  <div id="container">
    <TopBar></TopBar>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import TopBar from '../head/headComponent.vue'

  export default {
    name: "container",
    components: {
      TopBar
    }
  }
</script>

<style scoped>

</style>

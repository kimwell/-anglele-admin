<template>
  <div class="layout">
    <layoutHeader></layoutHeader>
    <div class="wrapper">
      <layoutAside></layoutAside>
      <div class="layout-content">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import layoutHeader from '../layoutHeader/index'
  import layoutAside from '../layoutAside/index.vue'
  export default {
    components: {
      layoutHeader,
      layoutAside
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .wrapper {
    min-width: 1200px;
    margin: 50px 0 0;
    overflow: hidden;
    .layout-content {
      position: absolute;
      left: 150px;
      right: 0;
      top: 50px;
      bottom: 0;
      padding: 15px;
      min-width: 1000px;
      margin: 0;
      background: #ebf1f5;
      z-index: 999;
    }
  }
</style>
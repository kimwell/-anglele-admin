<template>
  <div class="wrapper">
    <layoutAside></layoutAside>
    <div class="layout-content">content</div>
  </div>
</template>

<script>
  import layoutAside from './layoutAside/index'
  export default {
    components: {
      layoutAside
    },
    data() {
      return {}
    },
    methods: {},
    created() {}
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
      min-width: 1000px;
      margin: 0;
      overflow: auto;
      background: #ebf1f5;
    }
  }
</style>
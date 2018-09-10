<template>
  <div class="layout">
    <layoutHeader></layoutHeader>
    <router-view/>
  </div>
</template>

<script>
  import layoutHeader from '../layoutHeader/index'
  export default {
    components: {
      layoutHeader
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  
</style>
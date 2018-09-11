<template>
  <div class="layout-aside">
    <menuTree :treeData="menu" v-model="currentRoute"></menuTree>
  </div>
</template>

<script>
  import menu from '@/utils/menu.js'
  import menuTree from '@/components/menuTree/tree'
  export default {
    components: {
      menuTree
    },
    data() {
      return {
        menu: menu,
        currentRoute:{}
      }
    },
    methods: {
     
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .layout-aside {
    position: fixed;
    z-index: 200;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 150px;
    padding: 30px 0 0;
    background: #31354B;
  }
</style>
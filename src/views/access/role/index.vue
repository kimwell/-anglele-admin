<template>
  <div>sfsd
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      getList(){
        this.$http.post(this.$api.roleList,{name: ''}).then(res =>{
          console.log(res)
        })
      },
      save(){
        this.$http.post(this.$api.roleSave,{id: '',name:'超管',code:'100',status: 1}).then(res =>{
          console.log(res)
        })
      }
    },
    created(){
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
  
</style>
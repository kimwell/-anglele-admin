<template>
  <li :class="model.expand ? 'on':''">
    <a @click='Func(model,$event)' :title="model.title">
      <i v-if="model.children.length > 0" class="arrow"></i>
      <i v-else class="iconfont" :class="model.icon"></i>
      <span class="node-name">{{model.title}}</span>
    </a>
    <div :style="{height: model.expand ? model.children.length * 40 +'px':'0px'}">
      <ul>
        <ztree-item v-for="(item,i) in model.children" :key='i' :model="item" :trees='trees'></ztree-item>
      </ul>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'ztree-item',
    props: {
      value: Object,
      model: Object,
      trees: {
        type: Array
      }
    },
    data() {
      return {}
    },
    methods: {
      Func(m, e) {
        if (m.children.length > 0) {
          // 查找点击的子节点
          if (m.expand) {
            m.expand = !m.expand;
          } else {
            var recurFunc = (data,list) => {
              data.forEach((i) => {
                if (i.title == m.title) {
                  i.expand = true;
                } else {
                  i.expand = false;
                }
                if (i.children) {
                  recurFunc(i.children, i);
                }
              })
            }
            recurFunc(this.trees, this.trees);
          }
        } else {
          this.$router.push({path: m.url})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  
</style>
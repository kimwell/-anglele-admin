<template>
  <div class="menu-box">
    <ul>
      <ztree-item v-for="(item,i) in treeData" :key='i' v-model="value" :model="item" :trees='treeData'></ztree-item>
    </ul>
  </div>
</template>

<script>
  import ztreeItem from './treeItem.vue'
  export default {
    components: {
      ztreeItem
    },
    props: {
      value: Object,
      treeData: {
        type: Array
      }
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less'>
  .menu-box {
    overflow: hidden;
    ul {
      width: 150px;
      li {
        a {
          display: block;
          background: rgba(63, 69, 91, .4);
          color: #adb3c4;
          &:hover {
            background: #4bd3b7;
            span {
              color: #fff
            }
            i {
              &.after {
                border-color: transparent transparent transparent #fff;
              }
            }
          }
          i {
            display: inline-block;
            width: 50px;
            height: 40px;
            color: #adb3c4;
            text-align: center;
            line-height: 40px;
            vertical-align: top;
            &.arrow {
              &:after {
                content: '';
                display: inline-block;
                margin: 0 -4px 0 0;
                border: 4px solid #adb3c4;
                border-color: transparent transparent transparent #adb3c4;
                vertical-align: middle;
              }
            }
          }
          span {
            display: inline-block;
            width: 100px;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
            white-space: nowrap;
            box-sizing: border-box;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        div {
          height: 0;
          overflow: hidden;
          transition: height 0.2s;
          -moz-transition: height 0.2s;
          -ms-transition: height 0.2s;
          -o-transition: height 0.2s;
          -webkit-transition: height 0.2s;
        }
        &.on {
          a {
            i {
              &:after {
                transform: rotate(90deg);
              }
            }
          }
        }
      }
      li {
        a {
          &:hover {
            background: rgb(38, 41, 50, .6);
            i {
              color: #fff;
            }
          }
          i {
            color: #7f87ab;
            font-family: "iconfont" !important;
            font-size: 14px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
      }
    }
  }
</style>
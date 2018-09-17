<template>
  <div class="layout-aside">
    <div class="menu-box">
      <ul>
        <li v-for="(item,index) in base.menu" :key="index" class="on">
          <a :title="item.title">
            <i class="arrow"></i>
            <span class="node-name">{{item.title}}</span>
          </a>
          <div :style="{height: item.children.length * 40 +'px'}">
            <ul>
              <li v-for="(sub,i) in item.children" :key="i">
                <router-link :to="sub.url" :title="sub.title">
                  <i class="iconfont" :class="sub.icon"></i>
                  <span class="node-name">{{sub.title}}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  export default {
    data() {
      return {
        menu: [],
        currentRoute: {}
      }
    },
    computed: {
      ...mapGetters(['base']),
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
            &.current {
              background: rgb(38, 41, 50, .6);
              color: #fff;
              i {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
</style>
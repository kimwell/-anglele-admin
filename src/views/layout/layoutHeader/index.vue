<template>
  <div class="layout-header">
    <a class="logo" href="/bg/index">
      <img :src="userInfo ? userInfo.avatar:''">
    </a>
    <ul>
      <li class="hasChild">
        <Dropdown @on-click="onClick">
          <a href="javascript:void(0)">
                      {{userInfo ? userInfo.userName : ''}}
                      <Icon type="ios-arrow-down"></Icon>
                  </a>
          <DropdownMenu slot="list">
            <DropdownItem name="logOut">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
    </ul>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  export default {
    data() {
      return {}
    },
    computed: {
      userInfo() {
        return this.$store.state.base.loginInfo;
      }
    },
    methods: {
      ...mapActions(['loginOut']),
      onClick(data) {
        if (data === 'logOut') {
          this.loginOut();
          window.location.href = '/bg/login';
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .layout-header {
    position: fixed;
    z-index: 300;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1200px;
    height: 50px;
    background: #2d303b;
    .logo {
      float: left;
      width: 150px;
      height: 50px;
      text-align: center;
      margin: 0;
      padding: 0;
      &:after {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
      img {
        max-width: 120px;
        max-height: 26px;
        vertical-align: middle;
      }
    }
    ul {
      text-align: right;
      padding-right: 20px;
      li {
        list-style: none;
        display: inline-block;
        position: relative;
        a {
          display: inline-block;
          height: 50px;
          padding: 0 24px;
          color: #fff;
          font-size: 14px;
          line-height: 50px;
          &:hover {
            background: rgb(22, 22, 27, .7);
            color: #fff;
          }
        }
      }
    }
  }
</style>
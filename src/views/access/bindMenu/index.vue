<template>
  <div class="page-inner">
    <Row>
      <Col span="6">
      <!-- 角色管理 -->
      <Card :bordered="false" class="role-list" dis-hover title="角色管理">
        <div class="role-inner">
          <div class="role-inner-list" v-for="(item,index) in roleList" :key="index" @click="selectRole(item,index)" :class="item.selected ? 'selected':''">
            {{item.name}}
            <Tag :color="item.status === 1 ? 'primary':'error'" style="margin-left:5px;">{{item.status === 1 ? '正常':'禁用'}}</Tag>
          </div>
        </div>
      </Card>
      </Col>
      <Col span="18">
      <!-- 接口管理 -->
      <div class="role-api">
        <Card class="role-api-card" :bordered="false" dis-hover title="绑定菜单">
          <Button type="primary" slot="extra" :disabled="!btnDis" @click="saveBindMneu">绑定菜单</Button>
          <Tree :data="menuList" ref="menuTree" @on-check-change="checkHandle" expand="true" show-checkbox></Tree>
        </Card>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleList: [], // 角色列表,
        dataApi: {
          roleId: '',
          menuIds: []
        },
        bindList: [],
        menuList: []
      }
    },
    computed: {
      hasRoleId() {
        return this.dataApi.roleId != '';
      },
      hasMenu() {
        return this.dataApi.menuIds.length > 0
      },
      btnDis() {
        return this.dataApi.roleId != '' && this.dataApi.menuIds.length > 0
      }
    },
    methods: {
      //  角色列表
      getRoleList() {
        this.$http.post(this.$api.roleList, {
          name: ''
        }).then(res => {
          if (res.code === 1000) {
            res.data.forEach(el => {
              el.selected = false;
            })
            this.roleList = res.data;
          }
        })
      },
      getMenuList() {
        this.$http.post(this.$api.findMenuList).then(res => {
          if (res.code === 1000) {
            this.menuList = res.data;
          }
        })
      },
      getRoleMenu(data) {
        this.$http.post(this.$api.findMenu, {
          roleId: data
        }).then(res => {
          if (res.code === 1000) {
            this.bindList = res.data;
            this.setActiveMenu();
            this.dataApi.menuIds = this.$refs.menuTree.getCheckedNodes()
          }
        })
      },
      // 选中角色
      selectRole(item, i) {
        if (!item.selected) {
          this.roleList.map(el => {
            el.selected = false;
          })
          this.roleList[i].selected = true;
          this.dataApi.roleId = item.id;
          this.getRoleMenu(item.id)
        }
      },
      //  选择菜单
      checkHandle(data) {
        this.dataApi.menuIds = data;
      },
      //  设置已选中的菜单
      setActiveMenu() {
        let _this = this;
        var menuFun = data => {
          data.map(i => {
            _this.$set(i, "checked", false);
            _this.$set(i, "indeterminate", false);
            var subFun = sub => {
              sub.map(s => {
                if (i.id !== s.pId) {
                  if (i.id === s.id) {
                    _this.$set(i, "checked", true);
                  }
                } else {
                  _this.$set(i, "checked", false);
                }
                if (s.children.length) {
                  subFun(s.children)
                }
              })
            }
            subFun(_this.bindList)
            if (i.children.length) {
              menuFun(i.children);
            }
          });
        };
        menuFun(_this.menuList);
      },
      //  保存
      saveBindMneu() {
        this.$Modal.confirm({
          title: "绑定提示！",
          content: "确定绑定角色菜单？",
          onOk: () => {
            let params = this.$clearData(this.dataApi);
            params.menuIds = JSON.stringify(params.menuIds);
            this.$http.post(this.$api.editMenu, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success("绑定成功");
              } else {
                this.$Message.error(res.message);
              }
            });
          }
        });
      }
    },
    created() {
      this.getRoleList();
      this.getMenuList();
    }
  }
</script>

<style lang='less' scoped>
  .page-inner {
    .role-list {
      padding: 5px;
      height: calc(100vh - 65px);
      overflow-y: auto;
      margin-right: 10px;
      .role-inner {
        margin: 0 -16px;
        .role-inner-list {
          padding: 0 10px;
          line-height: 36px;
          &.selected {
            color: #2d8cf0;
            background-color: #ebf1f5
          }
          cursor: pointer;
          .iconfont {
            float: right;
            margin: 0 5px;
          }
          &:hover {
            background-color: #ebf1f5
          }
        }
      }
    }
    .role-api {
      height: calc(100vh - 65px);
      overflow-y: auto;
      .role-api-card {
        margin-bottom: 10px;
        .iconfont {
          font-size: 14px;
          cursor: pointer;
          &.checkAll {
            color: #2d8cf0;
          }
        }
      }
      .typeBtn {
        width: 100%;
        display: inline-block;
        margin-bottom: 0;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        line-height: 1.5;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding: 5px 15px 6px;
        font-size: 12px;
        border-radius: 4px;
        transition: color .2s linear, background-color .2s linear, border .2s linear, box-shadow .2s linear;
        color: #515a6e;
        background-color: #fff;
        border-color: #dcdee2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          border-color: #2d8cf0;
        }
        &.type-0 {
          color: #fff;
          background-color: #2d8cf0;
          border-color: #2d8cf0;
        }
        &.type-1 {
          color: #fff;
          background-color: #2db7f5;
          border-color: #2db7f5;
        }
        &.type-2 {
          color: #fff;
          background-color: #19be6b;
          border-color: #19be6b;
        }
        &.type-3 {
          color: #fff;
          background-color: #f90;
          border-color: #f90;
        }
        &.type-4 {
          color: #fff;
          background-color: #c16bd6;
          border-color: #c16bd6;
        }
      }
    }
  }
</style>
<template>
  <div class="page-inner">
    <Row>
      <Col span="6">
      <!-- 角色管理 -->
      <Card :bordered="false" class="role-list" dis-hover title="角色管理">
        <Button icon="md-add" type="primary" slot="extra" title="新增角色" @click="openPanel(false)"></Button>
        <div class="role-inner">
          <div class="role-inner-list" v-for="(item,index) in roleList" :key="index" @click="selectRole(item,index)" :class="item.selected ? 'selected':''">
            <span class="iconfont icon-bianji" @click.stop="openPanel(true,item)"></span><span class="iconfont icon-tuanduicankaoxian-" @click.stop="delRole(item)"></span>{{item.name}}
            <Tag :color="item.status === 1 ? 'primary':'error'" style="margin-left:5px;">{{item.status === 1 ? '正常':'禁用'}}</Tag>
          </div>
        </div>
      </Card>
      </Col>
      <Col span="18">
      <!-- 接口管理 -->
      <div class="role-api">
        <Card v-for="(item,index) in apiList" :key="index" class="role-api-card" :bordered="false" dis-hover :title="item.tag">
          <div slot="extra">
            <span class="iconfont" @click="checkAll(index)" :class="item.isCheckAll ? 'icon-yduifuxuankuangxuanzhong checkAll':'icon-yduifuxuankuang'">全选</span>
          </div>
          <Row :gutter="24">
            <Col span="4" v-for="(sub,i) in item.list" :key="i">
            <div @click="checkItem(item,sub,i)" :class="sub.isCheck ? `type-${sub.permissionFun}` :''" class="typeBtn">{{sub.name}}</div>
            </Col>
          </Row>
        </Card>
      </div>
      </Col>
    </Row>
    <!-- 添加编辑角色 -->
    <Modal :title="isEdit ? '编辑角色':'新增角色'" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="角色名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="角色代码：" prop="code">
          <Input v-model="dataApi.code" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="角色状态：">
          <RadioGroup v-model="dataApi.status">
            <Radio v-for="(item,index) in [{value: 1,name:'正常'},{value: 0,name:'禁用'}]" :label="item.value" :key="index">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('formModel')" :loading="loading">保存</Button>
        <Button @click="reset('formModel')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleList: [], // 角色列表
        apiList: [], // 所有接口列表
        roleBindApi: [], // 角色已绑定接口列表
        apiData: {
          tag: '',
          name: '',
          permissionFun: '',
          updateUser: '',
          endTime: '',
          startTime: ''
        },
        isEdit: false,
        show: false,
        dataApi: {
          id: '',
          name: '',
          code: '',
          status: 1
        },
        rule: {
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        editRole: {},
        roleApi: {
          roleId: '',
          permissionIds: []
        }
      }
    },
    computed: {
      hasRoleId() {
        return this.roleApi.roleId != '';
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
      // api列表
      getApiList() {
        this.$http.post(this.$api.findPermissionListWithTag, this.apiData).then(res => {
          if (res.code === 1000) {
            res.data.forEach(el => {
              el.isCheckAll = false;
              el.list.forEach(sub => {
                sub.isCheck = false;
              })
            })
            this.apiList = res.data;
          }
        })
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editRole = item || {};
          this.dataApi = {
            id: item.id,
            name: item.name,
            code: item.code,
            status: item.status
          }
        } else {
          this.dataApi = {
            id: '',
            name: '',
            code: '',
            status: 1
          }
        }
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            if (this.isEdit) {
              params.id = this.editRole.id;
            }
            this.$http.post(this.$api.roleSave, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getRoleList();
              } else {
                this.$Message.error(res.message);
              }
              this.show = false;
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      reset(name) {
        this.show = false;
        this.dataApi = {
          id: '',
          name: '',
          code: '',
          status: 1
        };
        this.$refs[name].resetFields();
      },
      // 选中角色
      selectRole(item, i) {
        if (!item.selected) {
          this.roleList.map(el => {
            el.selected = false;
          })
          this.roleList[i].selected = true;
          this.roleApi.roleId = item.id;
          this.roleBindApi = [];
          this.getRoleApi(item.id)
        }
      },
      // 获取角色绑定接口列表
      getRoleApi(id) {
        this.$http.post(this.$api.findPermission, {
          roleId: id
        }).then(res => {
          if (res.code === 1000) {
            this.roleBindApi = res.data;
            //  设置已选中
            this.setCheck();
          }
        })
      },
      // 全选
      checkAll(i) {
        let isAll = this.apiList[i].isCheckAll;
        this.roleApi.permissionIds = [];
        this.apiList[i].list.map(el => {
          this.roleApi.permissionIds.push(el.id);
        })
        this.saveApi(!isAll)
      },
      // 单个接口绑定、取消绑定
      checkItem(item, sub, i) {
        this.roleApi.permissionIds = [];
        this.roleApi.permissionIds.push(sub.id)
        sub.isCheck = !sub.isCheck;
        this.saveApi(sub.isCheck)
      },
      //  当前角色已选中的
      setCheck() {
        if (this.roleBindApi.length > 0) {
          this.resetCheck();
          this.roleBindApi.map(el => {
            el.data.map(sub => {
              this.apiList.map(aEl => {
                if (el.id === aEl.id && el.data.length === aEl.list.length) {
                  aEl.isCheckAll = true;
                }
                aEl.list.map(aSub => {
                  if (sub.id === aSub.id) {
                    aSub.isCheck = true;
                  }
                })
              })
            })
          })
        } else {
          this.resetCheck();
        }
      },
      //  清除所有选中接口
      resetCheck() {
        this.apiList.map(el => {
          el.isCheckAll = false;
          el.list.map(sub => {
            sub.isCheck = false;
          })
        })
      },
      // 保存、编辑角色绑定接口
      saveApi(isCheck) {
        let urlApi = isCheck ? this.$api.addPermission : this.$api.delRolePermission
        if (this.hasRoleId) {
          let params = this.$clearData(this.roleApi)
          params.permissionIds = JSON.stringify(params.permissionIds)
          this.$http.post(urlApi, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success(isCheck ? '添加成功!' : '删除成功!')
              this.getRoleApi(this.roleApi.roleId);
            } else {
              this.$Message.error(res.message)
            }
          })
        } else {
          this.$Message.error('请选择角色')
        }
      },
      /// 删除角色
      delRole(item) {
        let params = {
          id: item.id,
          name: '',
          code: '',
          status: 9
        }
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.roleSave, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功!');
                this.getRoleList();
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
    },
    created() {
      this.getRoleList();
      this.getApiList();
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
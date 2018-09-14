<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="角色绑定">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增角色</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="角色名称：">
          <Input type="text" v-model="pageApi.userName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="账号：">
          <Input type="text" v-model="pageApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="性别：">
          <Select v-model="pageApi.sex" :clearable="true" style="width: 160px;">
              <Option v-for="(item,index) in [{id:'0',name:'女'},{id:'1',name:'男'},{id:'2',name:'未知'}]" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">用户名称</Col>
            <Col class-name="col" span="4">账号</Col>
            <Col class-name="col" span="4">状态</Col>
            <Col class-name="col" span="8">角色</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="4">{{item.userName}}</Col>
            <Col class-name="col" span="4">{{item.phone}}</Col>
            <Col class-name="col" span="4">
            <Button type="primary" ghost @click="changeStatus(item)">{{item.status === 1 ? '正常':'禁用'}}</Button>
            </Col>
            <Col class-name="col" span="8">
            <Tag v-for="(sub,index) in item.roles" :key="index" color="primary">{{sub.name}}</Tag>
            </Col>
            <Col class-name="col" span="4">
            <Button type="warning" size="small" @click="openPanel(true,item)">编辑</Button>
            <Button type="warning" size="small" @click="delUser(item)" style="margin: 0 10px;">删除</Button>
            <Button type="warning" size="small" @click="modifyPsd(item)">修改账号</Button>
            </Col>
          </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <div class="paging">
          <Page class="page-count" size="small" show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="编辑接口" width="600" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="用户名：" prop="userName">
          <Input v-model="dataApi.userName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="真实姓名：">
          <Input v-model="dataApi.realName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="手机号：" prop="phone">
          <Input v-model="dataApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="密码：" prop="password">
          <Input v-model="dataApi.password" :disabled="isEdit" type="password" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：">
          <RadioGroup v-model="dataApi.status">
            <Radio v-for="(item,index) in [{value: 1,name:'正常'},{value: 0,name:'禁用'}]" :label="item.value" :key="index">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="设置角色：" prop="roleIds">
          <Select v-model="dataApi.roleIds" multiple :clearable="true" style="width: 100%;">
                  <Option v-for="(item,index) in roleList" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
        </FormItem>
        <FormItem label="性别：">
          <RadioGroup v-model="dataApi.sex">
            <Radio v-for="(item,index) in [{value: 2,name:'未知'},{value: 0,name:'女'},{value: 1,name:'男'}]" :label="item.value" :key="index">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="头像：">
          <uploadBtn single v-model="dataApi.avatar"></uploadBtn>
        </FormItem>
        <FormItem label="生日：">
          <DatePicker type="date" placeholder="选择生日" v-model="dataApi.birth"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('formModel')" :loading="loading">保存</Button>
        <Button @click="reset('formModel')">取消</Button>
      </div>
    </Modal>
    <Modal title="修改账号" width="600" v-model="psdShow" :mask-closable="false">
      <Form ref="formPsd" :model="psdApi" :rules="psdRule" :label-width="100">
        <FormItem label="账号：" prop="phone">
          <Input v-model="psdApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="新密码：" prop="newPassword">
          <Input v-model="psdApi.newPassword" type="password" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="确认新密码：" prop="newPasswordAgain">
          <Input v-model="psdApi.newPasswordAgain" type="password" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitPsd('formPsd')" :loading="loading">保存</Button>
        <Button @click="resetPsd('formPsd')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import uploadBtn from '@/components/uploadBtn'
  import treeItemVue from '../../../components/menuTree/treeItem.vue';
  export default {
    components: {
      uploadBtn
    },
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          userName: '',
          phone: '',
          sex: ''
        },
        list: [],
        totalCount: 0,
        roleList: [],
        show: false,
        isEdit: false,
        editItem: {},
        dataApi: {
          userName: '',
          phone: '',
          password: '',
          status: 1,
          sex: 2,
          avatar: '',
          birth: '',
          realName: '',
          roleIds: ''
        },
        rule: {
          userName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          roleIds: [{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'array'
          }]
        },
        psdRule: {
          phone: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          newPassword: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          newPasswordAgain: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        psdShow: false,
        psdApi: {
          id: '',
          phone: '',
          newPassword: '',
          newPasswordAgain: ''
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    computed: {
      pageFilter() {
        return {
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize,
          userName: this.pageApi.userName,
          phone: this.pageApi.phone,
          sex: this.pageApi.sex
        }
      }
    },
    methods: {
      getList(params) {
        this.$http.post(this.$api.findBaseUserList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 角色列表
      getRoleList() {
        this.$http.post(this.$api.roleList, {
          name: ''
        }).then(res => {
          if (res.code === 1000) {
            this.roleList = res.data;
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          userName: '',
          phone: '',
          sex: ''
        }
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            userName: item.userName,
            phone: item.phone,
            password: item.password,
            status: item.status,
            sex: item.sex,
            avatar: item.avatar,
            birth: item.birth,
            realName: item.realName,
            roleIds: []
          }
          if (item.roles.length > 0) {
            item.roles.map(el => {
              this.dataApi.roleIds.push(el.id);
            })
          }
        } else {
          this.resetDataApi();
        };
        this.show = true;
      },
      resetDataApi() {
        this.dataApi = {
          userName: '',
          phone: '',
          password: '',
          status: 1,
          sex: 2,
          avatar: '',
          birth: '',
          realName: '',
          roleIds: ''
        }
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            params.birth = params.birth != '' ? params.birth.getTime() : '';
            params.roleIds = JSON.stringify(params.roleIds);
            if (this.isEdit) {
              params.id = this.editItem.id;
            }else{
              params.password = this.$md5(params.password)
            }
            let urlApi = this.isEdit ? this.$api.updateBaseUser : this.$api.saveBaseUser;
            this.$http.post(urlApi, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getList(this.pageFilter);
                this.show = false;
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      delUser(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.modifyBaseUser, {
              id: item.id,
              status: 9
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功!');
                this.getList(this.pageFilter);
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      reset(name) {
        this.show = false;
        this.resetDataApi();
        this.$refs[name].resetFields();
      },
      // 更改状态
      changeStatus(item) {
        this.$Modal.confirm({
          title: '更改状态',
          content: '确认更改状态,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.modifyBaseUser, {
              id: item.id,
              status: item.status === 1 ? 0 : 1
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功!');
                this.getList(this.pageFilter);
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      modifyPsd(item) {
        this.psdShow = true;
        this.psdApi = {
          id: item.id,
          phone: item.phone,
          newPassword: '',
          newPasswordAgain: ''
        }
      },
      /// 修改密码
      submitPsd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.psdApi);
            params.newPassword = this.$md5(params.newPassword);
            params.newPasswordAgain = this.$md5(params.newPasswordAgain);
            this.$http.post(this.$api.updatePhone, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('修改成功')
                this.psdShow = false;
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      /// 取消修改密码
      resetPsd(name) {
        this.psdShow = false;
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getRoleList();
    }
  }
</script>

<style lang='less' scoped>
  .page-inner {
    .extra-button {
      margin-top: -4px;
    }
    .card-contnet {
      position: relative;
      .table-contnet {
        line-height: 40px;
        text-align: center;
        border-top: 1px solid #e8eaec;
        border-left: 1px solid #e8eaec;
        .head {
          background-color: #f8f8f9;
        }
        .title {
          text-align: left;
        }
        .col {
          height: 40px;
          padding: 0 5px;
          border-right: 1px solid #e8eaec;
          border-bottom: 1px solid #e8eaec;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .paging {
        padding: 30px 0;
        text-align: right;
      }
    }
  }
</style>
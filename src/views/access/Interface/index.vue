<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="接口管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增接口分组</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="分组名称：">
          <Input type="text" v-model="pageApi.tag" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="接口名称：">
          <Input type="text" v-model="pageApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="最近更新人：">
          <Input type="text" v-model="pageApi.updateUser" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="接口类型：">
          <Select v-model="pageApi.permissionFun" :clearable="true" style="width: 160px;">
                <Option v-for="(item,index) in [{id:'0',name:'未标识'},{id:'1',name:'新增'},{id:'2',name:'删除'},{id:'3',name:'更新'},{id:'4',name:'查询'}]" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
        </FormItem>
        <FormItem label="最近更新时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dateValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">接口名称</Col>
            <Col class-name="col" span="4">接口地址</Col>
            <Col class-name="col" span="4">接口类型</Col>
            <Col class-name="col" span="4">最近更新人</Col>
            <Col class-name="col" span="4">最近更新时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(sub,index) in list" :key="index">
            <Row class="title">
              <Col class-name="col" span="20">分组名称：{{sub.tag}}</Col>
              <Col class-name="col" span="4" style="text-align: center;">
              <Button type="primary" size="small" @click="openPanel(true,sub)" style="margin:0 10px;">编辑</Button>
              <Button type="primary" size="small" @click="delTag(sub)">删除</Button>
              </Col>
            </Row>
            <Row v-for="(item,i) in sub.list" :key="i">
              <Col class-name="col" span="4">{{item.name}}</Col>
              <Col class-name="col" span="4">{{item.path}}</Col>
              <Col class-name="col" span="4">{{item.permissionFun | types}}</Col>
              <Col class-name="col" span="4">{{item.updateUser}}</Col>
              <Col class-name="col" span="4">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="4">
              <Button type="error" size="small" @click="removeGroup(item)" style="margin:0 10px;">移至接口池</Button>
              </Col>
            </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
      </div>
    </Card>
    <Modal :title="isEdit ? '编辑分组名称':'新增分组名称'" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="分组名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
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
        pageApi: {
          tag: '',
          name: '',
          permissionFun: '',
          updateUser: '',
          endTime: '',
          startTime: ''
        },
        dateValue: ['', ''],
        isEdit: false,
        show: false,
        list: [],
        dataApi: {
          name: ''
        },
        editItem: {},
        loading: false,
        rule: {
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    filters: {
      types(val) {
        return ['未标识', '新增', '删除', '更新', '查询'][val]
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
          tag: this.pageApi.tag,
          name: this.pageApi.name,
          permissionFun: this.pageApi.permissionFun,
          updateUser: this.pageApi.updateUser,
          startTime: this.dateValue[0] != '' ? this.dateValue[0].getTime() : '',
          endTime: this.dateValue[1] != '' ? this.dateValue[1].getTime() : '',
        }
      }
    },
    methods: {
      resetFilter() {
        Object.keys(this.pageApi).forEach(key => {
          this.pageApi[key] = '';
          console.log(this.pageApi)
        })
        this.dateValue = ['', ''];
      },
      getList(params) {
        this.$http.post(this.$api.findPermissionListWithTag, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        })
      },
      // 新增、编辑
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        this.show = true;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi.name = item.tag;
        } else {
          this.dataApi.name = '';
        }
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            if (this.isEdit) {
              params.id = this.editItem.id;
            }
            let postApi = this.isEdit ? this.$api.updateTags : this.$api.saveTagsList;
            this.$http.post(postApi, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '保存成功')
                this.getList(this.pageFilter);
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
      // 移至接口池
      removeGroup(item) {
        this.$Modal.confirm({
          title: '移至接口池？',
          content: '接口将移出所有分组，转移至接口池,确定是否继续？',
          onOk: () => {
            this.$http.post(this.$api.removeTags, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('移除成功!');
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
        this.dataApi.name = '';
        this.$refs[name].resetFields();
      },
      // 删除分组
      delTag(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delTags, {
              id: item.id
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
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less'>
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
    }
  }
</style>
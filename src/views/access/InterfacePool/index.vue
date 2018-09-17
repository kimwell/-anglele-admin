<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="接口池管理">
      <Button type="primary" slot="extra" class="extra-button" @click="syncPermission">同步接口</Button>
      <Button type="primary" slot="extra" class="extra-button"  @click="multipleBind" style="margin-left: 10px;">批量绑定</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="接口名称：">
          <Input type="text" v-model="pageApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="接口地址：">
          <Input type="text" v-model="pageApi.path" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="接口类型：">
          <Select v-model="pageApi.permissionFun" :clearable="true" style="width: 160px;">
                        <Option v-for="(item,index) in [{id:'0',name:'未标识'},{id:'1',name:'新增'},{id:'2',name:'删除'},{id:'3',name:'更新'},{id:'4',name:'查询'}]" :value="item.id" :key="index">{{ item.name }}</Option>
                      </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="2">
            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
            </Col>
            <Col class-name="col" span="3">接口名称</Col>
            <Col class-name="col" span="3">接口地址</Col>
            <Col class-name="col" span="3">接口类型</Col>
            <Col class-name="col" span="3">资源访问类型</Col>
            <Col class-name="col" span="3">最近更新人</Col>
            <Col class-name="col" span="3">最近更新时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <CheckboxGroup v-model="multipleApi.ids" @on-change="checkAllGroupChange">
              <Col class-name="col" span="2">
              <Checkbox :label="item.id"><label></label></Checkbox>
              </Col>
              <Col class-name="col" span="3">{{item.name}}</Col>
              <Col class-name="col" span="3">{{item.path}}</Col>
              <Col class-name="col" span="3">{{item.permissionFun | types}}</Col>
              <Col class-name="col" span="3">{{item.permissionType === 1 ? '不需要登录':'需要登录'}}</Col>
              <Col class-name="col" span="3">{{item.updateUser}}</Col>
              <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="4" class="options">
              <Button type="primary" size="small" @click="openPanel(item)">编辑</Button>
              <Button type="primary" size="small" @click="changeGroup(item)" style="margin:0 10px;">添加分组</Button>
              <!-- <Button type="error" size="small" @click="delTag(item)">删除</Button> -->
              </Col>
            </CheckboxGroup>
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
        <FormItem label="接口名称：" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="接口地址：" prop="path">
          <Input v-model="dataApi.path" disabled placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="资源访问：">
          <RadioGroup v-model="dataApi.permissionType">
            <Radio v-for="(item,index) in [{value: 1,name:'不需要登录'},{value: 2,name:'需要登录'}]" :label="item.value" :key="index">
              <span>{{item.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="接口类型：">
          <RadioGroup v-model="dataApi.permissionFun">
            <Radio v-for="(item,index) in [{id:0,name:'未标识'},{id:1,name:'新增'},{id:2,name:'删除'},{id:3,name:'更新'},{id:4,name:'查询'}]" :key="index" :label="item.id">
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
    <Modal title="添加分组" width="600" v-model="tagShow" :mask-closable="false">
      <Form ref="formModel2" :model="tagApi" :rules="tagRule" :label-width="100">
        <FormItem label="接口名称：">
          {{tagItem.name}}
        </FormItem>
        <FormItem label="接口地址：">
          {{tagItem.path}}
        </FormItem>
        <FormItem label="接口分组：" prop="tags">
          <Select v-model="tagApi.tags" multiple :clearable="true" style="width: 100%;">
              <Option v-for="(item,index) in tagList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveGroup('formModel2')" :loading="loading">保存</Button>
        <Button @click="resetGroup('formModel2')">取消</Button>
      </div>
    </Modal>
    <Modal title="选择分组" width="600" v-model="multipleShow" :mask-closable="false">
      <Form ref="formModel3" :model="multipleApi" :rules="multipRule" :label-width="100">
        <FormItem label="接口分组：" prop="tags">
          <Select v-model="multipleApi.tags" multiple :clearable="true" style="width: 100%;">
              <Option v-for="(item,index) in tagList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveMultiple('formModel3')" :loading="loading">保存</Button>
        <Button @click="resetMultiple('formModel3')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          path: '',
          permissionFun: ''
        },
        list: [],
        totalCount: 0,
        isEdit: false,
        dataApi: {
          id: '',
          path: '',
          name: '',
          permissionType: 2,
          permissionFun: 1
        },
        multipleApi: {
          ids: [],
          tags: []
        },
        indeterminate: false,
        checkAll: false,
        multipleShow: false,
        show: false,
        loading: false,
        multipRule: {
          tags: [{
            required: true,
            message: '分组不能为空',
            trigger: 'change',
            type: 'array'
          }]
        },
        rule: {
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          path: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }]
        },
        tagRule: {
          tags: [{
            required: true,
            message: '分组不能为空',
            trigger: 'change',
            type: 'array'
          }]
        },
        tagList: [],
        tagShow: false,
        tagItem: {},
        tagApi: {
          id: '',
          tags: []
        },
        loading: false
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.pageApi.currentPage = 1;
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
          name: this.pageApi.name,
          path: this.pageApi.path,
          permissionFun: this.pageApi.permissionFun
        }
      }
    },
    filters: {
      types(val) {
        return ['未标识', '新增', '删除', '更新', '查询'][val]
      }
    },
    methods: {
      //  全选
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          this.list.map(el => {
            this.multipleApi.ids.push(el.id)
          })
        } else {
          this.multipleApi.ids = [];
        }
      },
      checkAllGroupChange(data) {
        if (data.length === this.list.length) {
          this.indeterminate = false;
          this.checkAll = true;
        } else if (data.length > 0) {
          this.indeterminate = true;
          this.checkAll = false;
        } else {
          this.indeterminate = false;
          this.checkAll = false;
        }
      },
      multipleBind() {
        let ok = this.multipleApi.ids.length > 0;
        if (ok) {
          this.multipleShow = true;
        } else {
          this.$Message.error('请选择接口')
        }
      },
      //  保存完成重置选择数据
      resetMultipleApi() {
        this.checkAll = false;
        this.indeterminate = false;
        this.multipleApi = {
          ids: [],
          tags: []
        }
      },
      // 批量保存
      saveMultiple(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.multipleApi);
            params.ids = JSON.stringify(params.ids);
            params.tags = params.tags.toString();
            this.$http.post(this.$api.addAllPermissionTags, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('绑定成功')
                this.getList(this.pageFilter);
                this.multipleShow = false;
                this.resetMultipleApi();
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
      // 重置批量
      resetMultiple(name) {
        this.multipleShow = false;
        this.multipleApi.tags = [];
        this.$refs[name].resetFields();
      },
      // 同步接口
      syncPermission() {
        this.loading = true;
        this.$http.post(this.$api.syncPermission).then(res => {
          if (res.code === 1000) {
            this.$Message.success('同步成功');
          } else {
            this.$Message.error(res.message);
          }
          this.loading = false;
        })
      },
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      getList(params) {
        this.$http.post(this.$api.findPermissionListWithOutTag, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      getTagList() {
        this.$http.post(this.$api.findTagsList).then(res => {
          if (res.code == 1000) {
            this.tagList = res.data;
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          pageIndex: 1,
          pageSize: 10,
          name: '',
          path: '',
          permissionFun: ''
        }
      },
      //  编辑接口
      openPanel(item) {
        this.dataApi = {
          id: item.id,
          path: item.path,
          name: item.name,
          permissionType: item.permissionType,
          permissionFun: item.permissionFun
        }
        this.show = true;
      },
      // 保存接口
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            this.$http.post(this.$api.updatePermission, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('编辑成功')
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
      reset(name) {
        this.show = false;
        this.$refs[name].resetFields();
      },
      // 删除接口
      delTag(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delPermission, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList(this.pageFilter);
                this.$Message.success('删除成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      },
      changeGroup(item) {
        this.tagShow = true;
        this.tagItem = item || {};
      },
      // 保存分组
      saveGroup(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.tagApi);
            params.id = this.tagItem.id;
            params.tags = params.tags.toString();
            this.$http.post(this.$api.addPermissionTags, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('编辑成功')
                this.getList(this.pageFilter);
                this.resetGroup('formModel2');
              } else {
                this.$Message.error(res.message);
              }
              this.tagShow = false;
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      resetGroup(name) {
        this.tagShow = false;
        this.tagApi = {
          id: '',
          tags: []
        }
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getList(this.pageFilter);
      this.getTagList();
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
      .paging {
        padding: 30px 0;
        text-align: right;
      }
    }
  }
</style>
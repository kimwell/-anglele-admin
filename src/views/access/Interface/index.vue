<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="接口管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openGroup(false)">新增接口分组</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="分组名称：">
          <Select v-model="pageApi.tag" style="width: 160px;">
            <Option v-for="(item,index) in tagList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
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
            <Col class-name="col" span="7">接口地址</Col>
            <Col class-name="col" span="3">接口类型</Col>
            <Col class-name="col" span="3">最近更新人</Col>
            <Col class-name="col" span="3">最近更新时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(sub,index) in list" :key="index">
            <Row class="title">
              <Col class-name="col" span="20">
                <Icon style="cursor: pointer;" :type="sub.showChild ? 'ios-arrow-down':'ios-arrow-forward'" size="24" @click="toggleChild(sub,index)"/>
                分组名称：{{sub.tag}}
              </Col>
              <Col class-name="col" span="4" style="text-align: center;">
              <Button type="primary" size="small" @click="openGroup(true,sub)" style="margin:0 10px;">编辑</Button>
              <Button type="primary" size="small" @click="delTag(sub)">删除</Button>
              </Col>
            </Row>
            <Row v-for="(item,i) in sub.list" :key="i" v-show="sub.showChild">
              <Col class-name="col" span="4">{{item.name}}</Col>
              <Col class-name="col" span="7">{{item.path}}</Col>
              <Col class-name="col" span="3">{{item.permissionFun | types}}</Col>
              <Col class-name="col" span="3">{{item.updateUser}}</Col>
              <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="4">
              <Button type="primary" size="small" @click="openPanel(item)">编辑</Button>
              <Button type="primary" size="small" @click="changeGroup(item)" style="margin:0 10px;">添加分组</Button>
              <Button type="error" size="small" @click="removeGroup(item)">移至接口池</Button>
              </Col>
            </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
      </div>
    </Card>
    <Modal :title="isEdit ? '编辑分组名称':'新增分组名称'" width="500" v-model="groupShow" :mask-closable="false">
      <Form ref="formGroup" :model="groupApi" :rules="ruleGroup" :label-width="100">
        <FormItem label="分组名称：" prop="name">
          <Input v-model="groupApi.name" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitGroup('formGroup')" :loading="loading">保存</Button>
        <Button @click="resetGroup('formGroup')">取消</Button>
      </div>
    </Modal>
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
        groupShow: false,
        list: [],
        groupApi: {
          name: ''
        },
        editItem: {},
        loading: false,
        ruleGroup: {
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }]
        },
        dataApi: {
          id: '',
          path: '',
          name: '',
          permissionType: 2,
          permissionFun: 1
        },
        show: false,
        loading: false,
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
          }],
        },
        tagList: [],
        tagShow: false,
        tagItem: {},
        tagApi: {
          id: '',
          tags: []
        },
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
      toggleChild(item,i){
        this.list[i].showChild = !this.list[i].showChild;
      },
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
            res.data.map(el => {
              el.showChild = true;
            })
            this.list = res.data;
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
      // 新增、编辑
      openGroup(isEdit, item) {
        this.isEdit = isEdit;
        this.groupShow = true;
        if (isEdit) {
          this.editItem = item || {};
          this.groupApi.name = item.tag;
        } else {
          this.groupApi.name = '';
        }
        this.groupShow = true;
      },
      submitGroup(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.groupApi);
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
              this.groupShow = false;
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
      resetGroup(name) {
        this.show = false;
        this.groupApi.name = '';
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
      changeGroup(item) {
        this.tagShow = true;
        this.tagItem = item || {};
        this.tagApi.tags = item.tags.split(',');
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
    }
  }
</style>
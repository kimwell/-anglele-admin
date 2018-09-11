<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="应用管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel">新增应用</Button>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">应用名称</Col>
            <Col class-name="col" span="4">应用代码</Col>
            <Col class-name="col" span="4">状态</Col>
            <Col class-name="col" span="4">最近更新人</Col>
            <Col class-name="col" span="4">最近更新时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="index">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="4">{{item.code}}</Col>
            <Col class-name="col" span="4">{{item.status === 1 ? '正常':'禁用'}}</Col>
            <Col class-name="col" span="4">{{item.updateUser}}</Col>
            <Col class-name="col" span="4">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="4">
            <Button type="error" size="small" @click="delApp(item)">删除</Button>
            </Col>
          </Row>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
      </div>
      <Modal title="新增应用" width="500" v-model="show" :mask-closable="false">
        <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
          <FormItem label="应用名称：" prop="name">
            <Input v-model="dataApi.name" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="应用代码：" prop="code">
            <Input v-model="dataApi.code" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="应用状态：">
            <RadioGroup v-model="dataApi.status">
              <Radio v-for="(item,index) in [{value: 1,name:'正常'},{value: 2,name:'禁用'}]" :label="item.value">
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
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        show: false,
        dataApi: {
          name: '',
          code: '',
          status: 1
        },
        rule: {
          name: [{
            required: true,
            message: '应用名称不能为空',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '应用代码不能为空',
            trigger: 'blur'
          }],
        },
        loading: false
      }
    },
    methods: {
      getList() {
        this.$http.post(this.$api.findApplicationList).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        })
      },
      openPanel() {
        this.show = true;
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            this.$http.post(this.$api.saveApplication, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('保存成功')
                this.getList();
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
        this.dataApi.name = '';
        this.dataApi.code = '';
        this.show = false;
        this.$refs[name].resetFields();
      },
      // 删除
      delApp(item) {
        this.$Modal.confirm({
          title: '删除确认',
          content: '此操作将无法撤销,是否继续？',
          onOk: () => {
            this.$http.post(this.$api.delApplication, {
              id: item.id
            }).then(res => {
              if (res.code === 1000) {
                this.getList();
                this.$Message.success('删除成功!');
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        })
      }
    },
    created() {
      this.getList();
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
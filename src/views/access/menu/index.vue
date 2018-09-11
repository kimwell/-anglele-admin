<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="菜单管理">
      <Button type="primary" slot="extra" class="extra-button" @click="openPanel(false)">新增菜单</Button>
      <menuZtree :list.sync='list' :func="nodeClick" :is-open='false'></menuZtree>
    </Card>
    <!-- 添加修改面板 -->
    <Modal v-model="show" :title="isEdit ? '编辑菜单':'新增菜单'" :closable="false">
      <Form :label-width="110" ref="menuEdit" :model="dataApi" :rules="ruleValidate">
        <FormItem label="菜单名称：" prop="title">
          <Input v-model="dataApi.title" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单地址：">
          <Input v-model="dataApi.url" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单类型：">
          <RadioGroup v-model="dataApi.iconType">
            <Radio :label="1"><span>iconfont</span></Radio>
            <Radio :label="2"><span>图片</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单图标：">
          <Input v-model="dataApi.icon" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="应用代码：" prop="appCode">
          <Select v-model="dataApi.appCode" :clearable="true" style="width: 160px;">
                              <Option v-for="(item,index) in appList" :value="item.code" :key="index">{{ item.name }}</Option>
                            </Select>
        </FormItem>
        <FormItem label="打开方式：" prop="openType">
          <RadioGroup v-model="dataApi.openType">
            <Radio :label="1"><span>内部打开</span></Radio>
            <Radio :label="2"><span>外部打开</span></Radio>
            <Radio :label="3"><span>执行js</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单状态：" prop="status">
          <RadioGroup v-model="dataApi.status">
            <Radio :label="1"><span>正常</span></Radio>
            <Radio :label="2"><span>禁用</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序号：" prop="sortIndex">
          <Input v-model="dataApi.sortIndex" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addNode('menuEdit')" :loading="loading">保存</Button>
        <Button @click="resetNode('menuEdit')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import menuZtree from "@/components/menuZtree/ztree";
  export default {
    components: {
      menuZtree
    },
    data() {
      return {
        dataApi: {
          title: '',
          url: '',
          icon: '',
          iconType: 1,
          openType: 1,
          appCode: '',
          status: 1,
          pId: '',
          sortIndex: ''
        },
        list: [],
        isEdit: false,
        show: false,
        loading: false,
        ruleValidate: {
          title: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          appCode: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          openType: [{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'number'
          }],
          status: [{
            required: true,
            message: '不能为空',
            trigger: 'change',
            type: 'number'
          }],
          sortIndex: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        appList: [],
        editItem: {}
      }
    },
    methods: {
      getList() {
        this.$http.post(this.$api.findMenuList).then(res => {
          if (res.code === 1000) {
            this.list = res.data;
          }
        })
      },
      nodeClick(m, p, d, o) {
        if (o == 1) {
          //  新增
          this.openPanel(false, m)
        } else if (o == 2) {
          // 编辑
          this.openPanel(true, m)
        } else if (o == 3) {
          // 删除
          let params = {
            id: m.id
          };
          this.$Modal.confirm({
            title: "删除提示！",
            content: "删除后无法撤销，是否继续？",
            onOk: () => {
              this.$http.post(this.$api.delMenu, params).then(res => {
                if (res.code === 1000) {
                  this.$Message.success("删除成功");
                  this.getList();
                } else {
                  this.$Message.error(res.message);
                }
              });
            }
          });
        }
      },
      addNode(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            if (this.isEdit) {
              params.id = this.editItem.id;
            }
            let postApi = this.isEdit ? this.$api.updateMenu : this.$api.saveMenu;
            this.$http.post(postApi, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '新增成功')
                this.getList();
                this.reset('menuEdit')
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
        this.dataApi = {
          title: '',
          url: '',
          icon: '',
          iconType: 1,
          openType: 1,
          appCode: '',
          status: 1,
          pId: '',
          sortIndex: ''
        }
        this.$refs[name].resetFields();
      },
      resetNode(name) {
        this.reset(name);
        this.show = false;
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            title: item.title,
            url: item.url,
            icon: item.icon,
            iconType: item.iconType,
            openType: item.openType,
            appCode: item.appCode,
            status: item.status,
            pId: item.pId,
            sortIndex: item.sortIndex.toString()
          }
        } else {
          this.dataApi = {
            title: '',
            url: '',
            icon: '',
            iconType: 1,
            openType: 1,
            appCode: '',
            status: 1,
            pId: item ? item.id : '',
            sortIndex: ''
          }
        }
        this.show = true;
      },
      //  获取应用
      getApp() {
        this.$http.post(this.$api.findApplicationList).then(res => {
          if (res.code === 1000) {
            this.appList = res.data;
          }
        })
      }
    },
    created() {
      this.getList();
      this.getApp();
    }
  }
</script>

<style lang='less' scoped>
  .page-inner {
    .extra-button {
      margin-top: -4px;
    }
  }
</style>
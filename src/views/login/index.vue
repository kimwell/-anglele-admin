<template>
  <div>
    <Form ref="formModel" :model="loginApi" :rules="rule" :label-width="100">
      <FormItem label="用户名：" prop="userName">
        <Input v-model="loginApi.userName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="密码：" prop="password">
        <Input v-model="loginApi.password" type="password" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="验证码：" prop="code">
        <Input v-model="loginApi.code" placeholder="请输入..."></Input>
        <img :src="picCodeUrl" @click="getUid()">
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submit('formModel')">Submit</Button>
        <Button @click="reset('formModel')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {
    getuuId
  } from '@/utils/tools'
  export default {
    data() {
      return {
        loginApi: {
          userName: '',
          password: '',
          code: '',
          r: '',
          roleCode: 'super'
        },
        random: '',
        rule: {
          userName: [{
            required: true,
            message: '用户名/手机号不能为空',
            trigger: 'blur'
          }],
          code: [{
            required: true,
            message: '验证码不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        loading: false
      }
    },
    computed: {
      picCodeUrl() {
        let host = "";
        if (window.location.hostname == "localhost")
          host = "http://192.168.0.252:8081";
        return host + this.$api.captcha + "?r=" + this.random;
      }
    },
    methods: {
      getUid() {
        this.random = getuuId();
      },
      setUser(data) {
        this.$store.commit(types.LOGIN, data);
        let redirect = decodeURIComponent(this.$route.query.redirect || '/index');
        this.$router.push({
          path: redirect
        })
      },
      submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.loginApi);
            params.r = this.random;
            params.password = this.$md5(params.password)
            this.$http.post(this.$api.login, params).then(res => {
              if (res.code === 1000) {
                this.setUser({
                  authorization: res.data,
                });
                this.$Notice.success({
                  title: '登录成功！',
                  desc: '恭喜你登录成功，快来体验吧！'
                })
              } else {
                this.getUid();
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      },
      reset(name) {
        this.$refs[name].resetFields();
      }
    },
    created() {
      this.getUid();
    }
  }
</script>

<style lang='less' scoped>
  
</style>
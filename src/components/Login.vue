<template>
  <div class="login">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        没有账号？ <router-link :to="{ name: 'register' }">注册</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const {url} = require('../config.json');

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        pass: '',
        username: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = new URLSearchParams();
          data.append('username', this.ruleForm.username);
          data.append('password', this.ruleForm.pass);
          fetch(url + '/user/login', {
            method: 'POST',
            body: data
          })
          .then(res=>res.json())
          .then(json=>{
            if (json.status === 0){
              const token = json.token;
              localStorage.clear();
              localStorage.setItem('token', token);
              this.$router.push({name: 'index'});
              this.$message({
                message: '登录成功',
                type: 'success',
                showClose: true,
              })
            }
            else{
              this.$message({
                message: '用户名或密码不正确',
                type: 'error',
                showClose: true,
              })
            }
          })
          .catch(err=>{
            console.error(err);
            this.$message({
              message: '未知错误',
              type: 'error',
              showClose: true,
            })
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-ruleForm{
  max-width: 300px;
  z-index: 10;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background: #EBEEF5;
}
</style>

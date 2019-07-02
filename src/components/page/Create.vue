<template>
  <div class="create">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="书名" prop="name">
        <el-input v-model.number="ruleForm.name" :change="nameChange"></el-input>
      </el-form-item>
      <el-form-item label="原价" prop="origin">
        <el-input-number v-model="ruleForm.origin" :precision="2" :min="0" :step="0.01" step-strictly></el-input-number>
      </el-form-item>
      <el-form-item label="现价" prop="price">
        <el-input-number v-model="ruleForm.price" :precision="2" :min="0" :step="0.01" step-strictly></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model.number="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input disabled :value="getLink"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const {url} = require('../../config.json');
export default {
  name: 'Create',
  data() {
    return {
      ruleForm: {
        name: '',
        cover: '',
        origin: 0,
        price: 0,
        description: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入描述', trigger: 'blur'}
        ]
      }
    }
  },
  computed:{
    getLink: function(){
      return 'http://search.dangdang.com/?key=' + this.ruleForm.name + '&act=input';
    }
  },
  methods: {
    nameChange: function(str){
      console.log(str);
    },
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const token = localStorage.getItem('token');
          const data = new URLSearchParams();
          for (let key in this.ruleForm){
            data.append(key, this.ruleForm[key]);
          }
          data.append('token', token);
          data.append('link', 'http://search.dangdang.com/?key=' + this.ruleForm['name'] + '&act=input');
          fetch(url + '/book/add', {
            method: 'POST',
            body: data
          })
          .then(res=>res.json())
          .then(json=>{
            if (json.status === 0){
              this.$message({
                message: '添加成功',
                type: 'success',
                showClose: true,
              })
            }
            else if (json.status === -1){
              this.$router.push({name: 'login'})
              this.$message({
                message: '登录超时',
                type: 'error',
                showClose: true,
              })
            }
            else{
              this.$message({
                message: '添加失败',
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

<style scoped>
.create{
  width: 500px;
  margin: 0 auto;
  padding: 30px 0;
}
</style>
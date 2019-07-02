<template>
  <div class="show">
    <el-table
      :data="book"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="书名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="origin_price"
        label="原价"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="现价"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="卖家"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const {url} = require('../../config.json');
export default {
  name: 'Show',
  data(){
    return {
      book: []
    };
  },
  mounted: function(){
    const token = localStorage.getItem('token');
    const data = new URLSearchParams();
    data.append('token', token);
    fetch(url + '/book/list', {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(async json=>{
      if (json.status === 0){
        const data = new URLSearchParams();
        data.append('token', token);
        const uid = await fetch(url + '/user/find', {
          method: 'POST',
          body: data
        })
        .then(res=>res.json())
        .then(json=>{
          return json.user.uid
        });

        const vec = json.book;
        this.book = [];
        for(let i in vec){
          const data = new URLSearchParams();
          data.append('token', token);
          data.append('uid', vec[i].uid);
          const username = await fetch(url + '/user/find', {
            method: 'POST',
            body: data
          })
          .then(res=>res.json())
          .then(json=>{
            return json.user.username
          });
          vec[i].username = username;
          if (vec[i].status != 0 && vec[i].buyer == uid){
            this.book.push(vec[i]);
          }
        }
      }
      else{
        this.$router.push({name: 'login'})
        this.$message({
          message: '登录超时',
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
  }
}
</script>

<style scoped>
</style>
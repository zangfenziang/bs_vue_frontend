<template>
  <div class="buy">
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
        width="180"
      >
      </el-table-column>
      <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">线上</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">线下</el-button>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const {url} = require('../../config.json');
export default {
  name: 'Buy',
  data() {
    return {
      book: []
    }
  },
  mounted: function(){
    this.flesh();
  },
  methods: {
    flesh: function(){
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
            if (vec[i].status == 0){
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
    },
    handleEdit(index, row) {
      this.setStatus(row.bid, 1)
    },
    handleDelete(index, row) {
      this.setStatus(row.bid, 2)
    },
    setStatus: function(bid, status){
      const data = new URLSearchParams();
      data.append('token', localStorage.getItem('token'));
      data.append('bid', bid);
      data.append('type', status);
      fetch(url + '/book/buy', {
        method: 'POST',
        body: data,
      })
      .then(res=>res.json())
      .then(json=>{
        if (json.status === 0){
          this.flesh();
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
  },
}
</script>

<style scoped>
</style>
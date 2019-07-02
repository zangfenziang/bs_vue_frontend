<template>
  <div class="message">
    <div style="padding: 5px;">
      <el-select size="mini" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.uid"
          :label="item.username"
          :value="item.uid">
        </el-option>
      </el-select>
      <el-input size="mini" style="margin-left: 3px; width: 200px;" v-model="text" />
      <el-button size="mini" style="margin-left: 3px;" @click="send" >发送</el-button>
    </div>
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="from_username"
        label="发送人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="to_username"
        label="接受人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="message"
        label="消息">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const {url} = require('../../config.json');
export default {
  name: 'Message',
  data(){
    return {
      data: [],
      options: [],
      value: '',
      text: ''
    }
  },
  beforeDestroy() {
    clearInterval(this.num);
  },
  mounted() {
    this.flesh();

    this.num = setInterval(this.flesh, 1000);

    const token = localStorage.getItem('token');
    const data = new URLSearchParams();
    data.append('token', token);
    fetch(url + '/user/list', {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(json=>{
      this.options = json.user
    })
  },
  methods: {
    flesh: function(){
      const token = localStorage.getItem('token');
      const data = new URLSearchParams();
      data.append('token', token);
      fetch(url + '/message/list', {
        method: 'POST',
        body: data
      })
      .then(res=>res.json())
      .then(async json=>{
        if (json.status === 0){
          const vec = json.message;
          for(let i in vec){
            const getName = async (uid) => {
              const data = new URLSearchParams();
              data.append('token', token);
              data.append('uid', uid);
              return await fetch(url + '/user/find', {
                method: 'POST',
                body: data
              })
              .then(res=>res.json())
              .then(json=>{
                return json.user.username
              });
            }
            const x = vec[i];
            x.from_username = await getName(x.from_uid);
            x.to_username = await getName(x.to_uid);
          }
          this.data = vec.reverse();
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
    send: function(){
      const token = localStorage.getItem('token');
      const data = new URLSearchParams();
      if (!this.value){
        this.$message({
          message: '请选择发送人',
          type: 'error',
          showClose: true
        })
        return;
      }
      data.append('token', token);
      data.append('message', this.text);
      data.append('to', this.value);
      fetch(url + '/message/send', {
        method: 'POST',
        body: data
      })
      .then(res=>res.json())
      .then(json=>{
        if (json.status == 0){
          this.$message({
            message: '发送成功',
            type: 'success',
            showClose: true,
          })
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
    }
  }
}
</script>

<style scoped>
</style>
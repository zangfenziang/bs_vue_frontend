<template>
  <div class="broadcast">
    <div style="padding: 5px;">
      <el-input size="mini" style="margin-left: 3px; width: 200px;" v-model="text" />
      <el-button size="mini" style="margin-left: 3px;" @click="send" >发送</el-button>
    </div>
    <el-table
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="发送人"
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
  name: 'Broadcast',
  data(){
    return {
      data: [],
      text: ''
    }
  },
  beforeDestroy() {
    clearInterval(this.num);
  },
  mounted() {
    this.flesh();
    this.num = setInterval(this.flesh, 1000);
  },
  methods: {
    send: function(){
      const token = localStorage.getItem('token');
      const data = new URLSearchParams();
      data.append('token', token);
      data.append('message', this.text);
      fetch(url + '/broadcast/send', {
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
    },
    flesh: function(){
      const token = localStorage.getItem('token');
      const data = new URLSearchParams();
      data.append('token', token);
      fetch(url + '/broadcast/list', {
        method: 'POST',
        body: data
      })
      .then(res=>res.json())
      .then(async json=>{
        if (json.status === 0){
          const vec = json.broadcast;
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
            x.username = await getName(x.uid);
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
    }
  }
}
</script>

<style scoped>
</style>
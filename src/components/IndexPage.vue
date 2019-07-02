<template>
  <div class="index">
    <el-container style="min-height: 100vh;">
      <div :style="isCollapse ? 'position: fixed' : 'position: fixed; width: 200px;'">
        <el-menu
          style="min-height: 100vh;" 
          default-active="1" 
          class="el-menu-vertical-demo" 
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="pageSelect('1')">
            <i class="el-icon-document-add"></i>
            <span slot="title">卖书</span>
          </el-menu-item>
          <el-menu-item index="2" @click="pageSelect('2')">
            <i class="el-icon-shopping-bag-1"></i>
            <span slot="title">买书</span>
          </el-menu-item>
          <el-menu-item index="3" @click="pageSelect('3')">
            <i class="el-icon-shopping-cart-2"></i>
            <span slot="title">购物车</span>
          </el-menu-item>
          <el-menu-item index="4" @click="pageSelect('4')">
            <i class="el-icon-bell"></i>
            <span slot="title">消息</span>
          </el-menu-item>
          <el-menu-item index="5" @click="pageSelect('5')">
            <i class="el-icon-more-outline"></i>
            <span slot="title">广播</span>
          </el-menu-item>
        </el-menu>
      </div>
      <el-container :style="isCollapse? 'margin-left: 65px;' : 'margin-left: 200px;'">
        <el-header style="position: fixed; z-index: 10; width: 100%; display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: #E4E7ED;">
          <div>
            <i class="el-icon-s-fold" v-if="!isCollapse" @click="isCollapse = true"></i>
            <i class="el-icon-s-unfold" v-if="isCollapse" @click="isCollapse = false"></i>
          </div>
          <div>
            {{username}} <i class="el-icon-position" style="cursor: pointer;" @click="logout()"></i>
          </div>
        </el-header>
        <el-main style="margin-top: 65px;">
          <div style="background: #EBEEF5;">
            <Create v-if="page == '1'" />
            <Buy v-if="page == '2'" />
            <Show v-if="page == '3'" />
            <Message v-if="page == '4'" />
            <Broadcast v-if="page == '5'" />
          </div>
        </el-main>
        <el-footer style="text-align: center; line-height: 60px;"><strong>Book Manager By Zhang</strong></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Create from './page/Create.vue';
import Buy from './page/Buy.vue';
import Show from './page/Show.vue';
import Message from './page/Message.vue';
import Broadcast from './page/Broadcast.vue';
const {url} = require('../config.json');
export default {
  name: 'IndexPage',
  data() {
    return {
      username: '',
      isCollapse: false,
      width: 200,
      page: '1'
    }
  },
  created: function(){
    const token = localStorage.getItem('token');
    if (!token){
      this.$router.push({name: 'login'});
      this.$message({
        message: '请先登录',
        showClose: true,
      });
    }
    const data = new URLSearchParams();
    data.append('token', token);
    fetch(url + '/user/find', {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(json=>{
      if (json.status !== 0){
        this.$router.push({name: 'login'});
        this.$message({
          message: '登录超时',
          showClose: true,
        });
      }
      else{
        this.username = json.user.username;
      }
    })
    .catch(err=>{
      console.error(err);
      this.$router.push({name: 'login'});
      this.$message({
        message: '未知错误',
        type: 'error',
        showClose: true,
      });
    })
  },
  methods: {
    logout: function(){
      localStorage.clear();
      this.$router.push({name: 'login'})
    },
    pageSelect: function(index){
      this.page = index;
    }
  },
  components: {
    Create, Buy, Show, Message, Broadcast
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index{
  min-height: 100vh;
}
</style>

<template>
<el-container style="height: 100%;">
  <el-header class="header">
    <h1 class="logoName">LvCMS</h1>
    <span @click="logout" class="logout"><i class="el-icon-third-exit"></i>&nbsp;退出登录</span>
  </el-header>
  <el-container style="height: 100%;">
    <el-aside width="200px" style="height: 100%">
      <el-menu
        default-active="2"
        class="el-menu-vertical"
        background-color="#2F4056"
        text-color="#fff"
        active-text-color="#009688"
        style="height: 100%;"
        @select="menuSelect">
        <nav-menu-circle :menu="menu" level="0"></nav-menu-circle>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="breadWrapper">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadPath">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <transition name="slide-fade">
      <router-view/>
      </transition>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
  import utils from '../utils/utils'
  import NavMenuCircle from '../components/NavMenuCircle'
    export default {
        name: "base",
      data(){
        return {
          menu:[],
          breadPath:[]
        };
      },
      components:{
        NavMenuCircle:NavMenuCircle
      },
      mounted(){
          this.getAuth();
      },
      methods:{
          getAuth(){
            this.$axios.get('/api/auth/getTreeOfRole',{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status='200'){
                this.menu=data.data;
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            });
          },
        menuSelect(index,indexPath){
            let path=index.split('-');
            let temp=this.menu;
            let breadPath=[];
            console.log(path);
            //由于需要递归，所以在配置菜单的时候有一个前导0，使得多级菜单会比本身多一个前导0，循环应从1位开始
            for(let i=1,len=path.length;i<len;i++){
              let tempIndex=parseInt(path[i]);
              console.log(tempIndex);
              temp=temp[tempIndex];
              breadPath.push(temp.name);
              if(i!=len-1){
                temp=temp.children;
              }
            }
            breadPath.unshift('主页');
            this.breadPath=breadPath;
            this.$router.replace(temp.uris);
        },
        logout(){
            this.$axios.get('/api/admin/logout',{
              headers:{
                token:utils.getToken()
              }
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                utils.clearToken();
                this.$router.replace('/login');
              }
              else{
                utils.responseToString(data.msg);
              }
            }).catch(err=>{
              utils.handleErr.call(this,err);
            })
        }
      }
    }
</script>

<style scoped>
.header{
  /*background-color: #393D49;*/
  background: #141E30;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #243B55, #141E30);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #243B55, #141E30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

}
  .header .logoName{
    margin: 0 20px;
    padding: 0;
    line-height: 60px;
    color: #009688;
    font-weight: 200;
    display: inline-block;
  }
  .logout{
    display: inline-block;
    line-height: 60px;
    color: white;
    cursor: pointer;
    float: right;
    font-size: 14px;
  }
  .breadWrapper{
    margin-bottom: 20px;
    background: #efefef;
    border-radius: 6px;
    padding: 20px;
  }
</style>

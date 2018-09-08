<template>
<el-container style="height: 100%;">
  <el-header class="header">
    <h1 class="logoName">LvCMS</h1>
    <!--<span @click="menuCollapse=!menuCollapse" style="color: white;font-size: 22px;cursor: pointer;"><i class="el-icon-menu"></i></span>-->
    <span @click="logout" class="rightIcon"><i class="el-icon-third-exit"></i>&nbsp;退出登录</span>
    <span @click="toggleFullScreen" class="rightIcon" style="margin-right: 10px;"><i class="el-icon-menu">全屏</i></span>
  </el-header>
  <el-container style="height: 100%;">
    <el-aside :width="menuCollapse?'auto':'230px'" class="aside">
      <el-menu
        background-color="#393D49"
        text-color="#fff"
        active-text-color="#009688"
        style="height: 100%;"
        :collapse="menuCollapse"
        @select="menuSelect">
        <nav-menu-circle :menu="menu" level="0"></nav-menu-circle>
      </el-menu>
    </el-aside>
    <el-main class="main">
      <div class="breadWrapper" v-if="breadPath&&breadPath.length>0">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadPath">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="tabWrapper">
        <el-tabs
          v-model="currentTab"
          type="border-card"
          closable
          @tab-click="tabClick"
          v-if="tabItems.length"
          @tab-remove="tabRemove"
        >
          <el-tab-pane
            :key="item.name"
            v-for="(item, index) in tabItems"
            :label="item.title"
            :name="item.name"
            :route="item.route"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-card class="contentWrapper">
          <transition name="slide-fade">
            <div>
              <keep-alive>
                <router-view/>
              </keep-alive>
            </div>
          </transition>
      </el-card>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
  import utils from '../utils/utils'
  import NavMenuCircle from '../components/NavMenuCircle'
  import apis from './../api/apis'
    export default {
        name: "base",
      data(){
        return {
          menuCollapse:false,
          fullScreen:false,
          //menu:[],
          breadPath:[]
        };
      },
      components:{
        NavMenuCircle:NavMenuCircle
      },
      computed:{
          currentTab:{
            get(){
              return this.$store.state.Tab.currentTab;
            },
            set(val){
              this.$store.commit('Tab/setCurrentTab',val);
            }
          },
        tabItems(){
            return this.$store.state.Tab.tabItems;
        },
        menu(){
            return this.$store.state.Menu.menus;
        }
      },
      mounted(){
          this.getAuth();
          this.$store.commit('Tab/clearTab');
          this.$store.commit('Tab/addTab',this.$store.state.Tab.dashboardPayload);
      },
      methods:{
        getAuth(){
          apis.getAuthMenu().then(res=>{
            let data=res.data;
            if(data.status='200'){
              this.$store.commit('Menu/setMenu',data.data);
              let menuIndex=this.searchMenuIndex(this.$route.path,this.$store.state.Menu.menus);//根据路由寻找菜单项目，用于还原刷新前的菜单状态
              if(menuIndex!=-1){
                menuIndex='0-'+menuIndex;
                this.menuSelect(menuIndex);
              }
              else{
                if(this.$route.path=='/'){
                  let breadPath=[];
                  breadPath.unshift('主页');
                  this.breadPath=breadPath;
                }
              }
            }
          });
        },
        toggleFullScreen(){
          if(this.fullScreen==false){
            if(utils.requestFullScreen(document.body)){
              this.fullScreen=true;
            }
          }
          else{
            if(utils.exitFullScreen()){
              this.fullScreen=false;
            }
          }

        },
        logout(){
          apis.logout().then(res=>{
            let data=res.data;
            if(data.status=='200'){
              utils.clearToken();
              this.$router.replace('/login');
            }
            else{
              utils.responseToString(data.msg);
            }
          });
        },
        menuSelect(index){
            let path=index.split('-');
            let temp=this.$store.state.Menu.menus;
            let breadPath=[];
            //由于需要递归组件，所以在配置菜单的时候有一个前导0，使得多级菜单会比本身多一个前导0，循环应从1位开始
            for(let i=1,len=path.length;i<len;i++){
              let tempIndex=parseInt(path[i]);
              temp=temp[tempIndex];
              breadPath.push(temp.name);
              if(i!=len-1){
                temp=temp.children;
              }
            }
            breadPath.unshift('主页');
            this.breadPath=breadPath;
            this.$store.commit('Tab/addTab',temp);
            this.$router.replace(temp.uris);
        },
        searchMenuIndex(route,menu){
            if(route==='/'){
              return -1;
            }
            for(let i=0,len=menu.length;i<len;i++){
              if(menu[i].uris===route){
                return i;
              }
              else if(menu[i].children&&menu[i].children.length>0){
                let subIndex=this.searchMenuIndex(route,menu[i].children);
                if(subIndex!=-1){
                  return `${i}-${subIndex}`;
                }
              }
            }
            return -1;
        },
        tabRemove(targetName){
            this.$store.commit('Tab/closeTab',targetName);
            for(let i=0,len=this.tabItems.length;i<len;i++){
              if(this.tabItems[i].name===this.currentTab){
                this.$router.replace(this.tabItems[i].route);
                break;
              }
            }
        },
        tabClick(tab){
            let route=tab.$attrs.route;
            this.$router.replace(route);
            let menuIndex=this.searchMenuIndex(route,this.$store.state.Menu.menus);
            if(menuIndex!=-1){
              menuIndex='0-'+menuIndex;
              this.menuSelect(menuIndex);
            }
            else{
              if(this.$route.path=='/'){
                let breadPath=[];
                breadPath.unshift('主页');
                this.breadPath=breadPath;
              }
            }
        }
      }
    }
</script>

<style>
.header{
  background-color: #2F9688;
  /*background: #141E30;  !* fallback for old browsers *!*/
  /*background: -webkit-linear-gradient(to right, #243B55, #141E30);  !* Chrome 10-25, Safari 5.1-6 *!*/
  /*background: linear-gradient(to right, #243B55, #141E30); !* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ *!*/

}
  .header .logoName{
    padding: 0;
    line-height: 60px;
    color: #f8f8f8;
    font-weight: 200;
    display: inline-block;
    width: 210px;
    margin: 0;
  }
  /*.logout{*/
    /*display: inline-block;*/
    /*line-height: 60px;*/
    /*color: white;*/
    /*cursor: pointer;*/
    /*float: right;*/
    /*font-size: 14px;*/
  /*}*/
  .rightIcon{
    display: inline-block;
    line-height: 60px;
    color: white;
    cursor: pointer;
    float: right;
    font-size: 14px;
  }
  .aside{
    height: 100%;
    transition: all .25s ease;
  }
  .main{
    background-color: #eaeaee;
    padding: 0px 10px!important;
  }
  .breadWrapper{
    background: white;
    padding: 18px 15px;
    color: #666666;
    margin: 0px -10px 10px -10px;
  }
  .tabWrapper .el-tabs__header{
    border-bottom: none!important;
  }
  .tabWrapper .el-tabs__content{
    padding: 0!important;
  }
  .contentWrapper{
    background: white;
  }
</style>

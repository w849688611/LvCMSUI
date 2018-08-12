<template>
<div>
  <vue-particles
    color="#dedede"
    :particleOpacity="0.7"
    :particlesNumber="80"
    shapeType="circle"
    :particleSize="4"
    linesColor="#dedede"
    :linesWidth="1"
    :lineLinked="true"
    :lineOpacity="0.4"
    :linesDistance="150"
    :moveSpeed="3"
    :hoverEffect="true"
    hoverMode="grab"
    :clickEffect="true"
    clickMode="push"
    v-if="banner==''"
  >
  </vue-particles>
  <div id="bannerWrapper" v-else>
    <img :src="banner">
  </div>
  <div class="loginWrapper">
    <h1 class="loginTitle">LvCMS后台管理</h1>
    <el-input
      placeholder="请输填写帐号"
      v-model="account" class="loginInput">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <div class="divider"></div>
    <el-input
      placeholder="请填写密码"
      v-model="password" type="password" class="loginInput">
      <i slot="prefix" class="el-input__icon el-icon-tickets"></i>
    </el-input>
    <div class="divider"></div>
    <el-input placeholder="填写验证码" v-model="captcha" class="loginInput">
      <i slot="prefix" class="el-input__icon el-icon-picture-outline"></i>
      <img :src="captchaUrl" alt="captcha" slot="append" class="captchaImg" @click="captchaId=Date.now()">
    </el-input>
    <div class="divider"></div>
    <el-button @click="login" @keyup.enter.native="login" style="width: 90%;" type="primary">登录</el-button>
  </div>
</div>
</template>

<script>
  import utils from '../utils/utils'
    export default {
        name: "login",
      data(){
          return {
            account:'',
            password:'',
            captcha:'',
            captchaId:'',
            banner:''
          };
      },
      computed:{
        captchaUrl(){
          return `${this.$baseURL}/api/util/captcha/get?id=${this.captchaId}&&length=4`
        }
      },
      mounted(){
          this.captchaId=Date.now();
          this.getBanner();
      },
      methods:{
          login(){
            this.$axios.post('/api/util/captcha/check',{
              code:this.captcha,
              id:this.captchaId
            }).then(res=>{
              let data=res.data;
              if(data.status=='200'){
                this.$axios.post('/api/admin/login',{
                  account:this.account,
                  password:this.password
                }).then(res=>{
                  let data=res.data;
                  if(data.status=='200'){
                    this.$message.success('登录成功');
                    let token=data.data.token;
                    window.localStorage.setItem('token',token);
                    this.$router.replace('/');
                  }
                  else{
                    this.$message.error(utils.responseToString(data.msg));
                    this.captchaId=Date.now();
                  }
                });
              }
              else{
                this.$message.error('验证码不正确');
                this.captchaId=Date.now();
              }
            })
          },
        getBanner(){
            this.$axios.get('/api/front/setting/get',{
              params:{
                itemName:'loginBanner',
                onlyContent:true
              }
            }).then(res=>{
              let data=res.data;
              if(data.length>0){
                this.banner=data[0].content
              }
            })
        }
      },
    }
</script>

<style scoped>
#particles-js{
  background-color: #2F4056;
  /*background: #1D4350;  !* fallback for old browsers *!*/
  /*background: -webkit-linear-gradient(to right, #A43931, #1D4350);  !* Chrome 10-25, Safari 5.1-6 *!*/
  /*background: linear-gradient(to right, #A43931, #1D4350); !* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ *!*/
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
#bannerWrapper{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
#bannerWrapper img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
  .loginWrapper{
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
    width: 400px;
    background: white;
    padding: 10px 5px 15px;
    border-radius: 4px;
    box-shadow: 0 3px 4px 0 #eaeaee;
    border: 1px solid #eaeaee;
    text-align: center;
  }
  .loginInput{
    width: 90%;
    margin: 0 auto;
  }
  .loginTitle{
    text-align: center;
    font-weight: 200;
  }
  .divider{
    height: 15px;
  }
  .el-input-group__append{
    padding: 0!important;
  }
  .captchaImg{
    width: 100px;
    object-fit: contain;
  }
</style>

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueParticles from 'vue-particles'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css'
import http from './api/http'
import VueNeditor from './components/VueNeditor'
Vue.config.productionTip = false;
/**
 * element
 */
Vue.use(Element);
/**
 * 粒子特效插件
 */
Vue.use(VueParticles);
/**
 * 富文本编辑器
 */
Vue.component('vue-neditor',VueNeditor);
/**
 * 网络请求
 */
Vue.prototype.$baseURL=process.env.BASE_URL;
Vue.prototype.$axios=http;
/**
 * 路由拦截
 */
router.beforeEach((to,from,next)=>{
  if(to.path!='/login'){
    let token=window.localStorage.getItem('token');
    if(token){
      http.get('api/admin/checkLogin',{
        headers:{
          token:token
        }
      }).then(res=>{
        let data=res.data;
        if(data.status=='200'){
          http.get('/api/role/checkRoleOwnAuth',{
            headers:{
              token:token
            },
            params:{
              uris:to.fullPath
            }
          }).then(res=>{
            if(res.data.status=='200'){
              next();
            }
            else{
              next('/login')
            }
          });
        }
        else{
          next('/login')
        }
      }).catch(err=>{
        next('/login');
      })
    }
    else{
      next('/login')
    }
  }
next();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

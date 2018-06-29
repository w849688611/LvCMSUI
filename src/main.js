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
import axios from 'axios';
import VueNeditor from './components/VueNeditor'
// import VueQuillEditor from 'vue-quill-editor'
// import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import utils from "./utils/utils";
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
// let editorConfig={
//   modules: {
//   ImageExtend: {
//     loading: true,
//       name: 'file',
//       headers:(xhr)=>{
//         xhr.setRequestHeader('token',utils.getToken());
//       },
//       action: process.env.BASE_URL+'/api/file/add',
//       response: (res) => {
//       if(res.status=='200'){
//         return res.data.url;
//       }
//       return '';
//     }
//   },
//   toolbar: {
//     container: container,
//       handlers: {
//       'image': function () {
//         QuillWatch.emit(this.quill.id)
//       }
//     }
//   }
// }
// };
// VueQuillEditor.Quill.register('modules/ImageExtend', ImageExtend);
// Vue.use(VueQuillEditor,editorConfig);
Vue.component('vue-neditor',VueNeditor);
/**
 * 网络请求
 */
//let http=axios.create({});
let http=axios.create({
  baseURL:process.env.BASE_URL
});
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
          http.get('/api/role/checkRoleOwnAuth',{})
          next();
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

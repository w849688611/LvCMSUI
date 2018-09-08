import axios from 'axios'
import utils from './../utils/utils'
import Vue from 'vue'
let http=axios.create({
  baseURL:process.env.BASE_URL
});
http.interceptors.request.use(
  config=>{
    let token=window.localStorage.getItem('token');
    config.headers.token=token;
    return config;
  },
  err => {
    console.log('request err'+err.toString());
    Promise.reject(err)
  });
http.interceptors.response.use(response=>{
    return response
  },
  err=>{
    utils.handleErr.call(Vue.prototype,err);
  });
export default http;

function responseToString(response){
  let result='';
  if(typeof response=='object'){
    for(let key in response){
      result+=(response[key])+'\n';
    }
  }
  else{
    result=response.toString();
  }
  return result;
};
function getToken(){
  let token=window.localStorage.getItem('token');
  if(!token){
    Vue.$router.replace('/login');
  }
  return token;
}
function setToken(token){
  window.localStorage.setItem('token',token);
}
function clearToken(){
  window.localStorage.removeItem('token');
}
function handleErr(err){
  if(!err||!err.response){
    this.$message.error(err.toString());
  }
  if(err.response.status===401){
    this.$router.replace('/login');
  }
  console.log(err);
  this.$message.error(err.response.data.msg);
}
function clearObj(obj){
  for(let key in obj){
    obj[key]='';
  }
}
function convertTime(timestamp){
  if(!Number(timestamp)){
    return new Date();
  }
  if(timestamp.toString().length==10){
    return new Date(Number(timestamp)*1000);
  }
  if(timestamp.toString().length==13){
    return new Date(Number(timestamp));
  }
  return new Date();
}
export default {
  responseToString,
  getToken,
  setToken,
  clearToken,
  handleErr,
  clearObj,
  convertTime
}

import apis from './../../api/apis'
const state={
  menus:[]
};
const getters={

};
const actions={

};
const mutations={
  setMenu(state,menus){
    state.menus=menus;
  }
};
export default {
  namespaced:true,
  state:state,
  getters:getters,
  actions:actions,
  mutations:mutations
}

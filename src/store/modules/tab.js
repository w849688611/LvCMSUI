const state={
  tabItems:[],
  currentTab:'',
  dashboardPayload:{
    name:'控制台',
    uris:'/'
  }
};
const getters={

};
const actions={

};
const mutations={
  setCurrentTab(state,currentTab){
    state.currentTab=currentTab;
  },
  addTab(state,payload){
    let tabItems=state.tabItems;
    for(let i=0,len=tabItems.length;i<len;i++){
      if(tabItems[i].route==payload.uris){
        state.currentTab=tabItems[i].name;
        return;
      }
    }
    state.tabItems.push({
      title:payload.name,
      name:`${payload.name}(${payload.uris})`,
      route:payload.uris
    });
    state.currentTab = `${payload.name}(${payload.uris})`;
  },
  closeTab(state,targetTabName){
    let dashboardName=`${state.dashboardPayload.name}(${state.dashboardPayload.uris})`;
    if(targetTabName===dashboardName){
      return;
    }
    let tabItems=state.tabItems;
    let currentTab=state.currentTab;
    if(targetTabName===currentTab){
      tabItems.forEach((item,index)=>{
        if(item.name===targetTabName){
          let nextTab=tabItems[index-1]||tabItems[index+1];
          if(nextTab){
            currentTab=nextTab.name;
          }
        }
      });
    }
    state.currentTab=currentTab;
    state.tabItems=tabItems.filter(item=> item.name!==targetTabName);
  },
  clearTab(state){
    state.tabItems=[];
  }
};
export default {
  namespaced:true,
  state,
  getters,
  actions,
  mutations
}

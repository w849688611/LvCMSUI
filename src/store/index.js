import Vue from 'vue';
import Vuex from 'vuex';
import Tab from './modules/tab'
import Menu from './modules/menu'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules:{
    Tab,
    Menu
  },
  strict: debug
});

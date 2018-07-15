import Vue from 'vue';
import Vuex from 'vuex';
import Tab from './modules/tab'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules:{
    Tab
  },
  strict: debug
});

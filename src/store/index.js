import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
import app from './modules/app'
import login from './modules/login'
import category from './modules/category'
import info from './modules/info'
import user from './modules/user'

export default new Vuex.Store({
  modules: {
    app,
    login,
    category,
    info,
    user
  }
})

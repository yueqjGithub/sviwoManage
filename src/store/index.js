// import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from './actions'
import mutations from './mutations'
import admin from './modules/admin'

Vue.use(Vuex);

const store = new Vuex.Store({
    mutations: mutations,
    actions: actions,
    modules: {
        admin
    },
    strict:false,
    plugins:[createLogger()]
});

export default store

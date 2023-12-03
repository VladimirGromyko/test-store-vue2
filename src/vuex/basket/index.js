import Vue from 'vue';
import Vuex from 'vuex';
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import state from "./state";

Vue.use(Vuex);

const elStore = new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})

export default elStore;

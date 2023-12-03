import elStore from "./vuex/basket/index.js";
import ElementUI from 'element-ui';
import Vue from 'vue';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
    el: '#app',
    store: elStore,
    render: h => h(App),
}).$mount('#app');

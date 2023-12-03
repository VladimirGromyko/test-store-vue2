// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
//
// createApp(App).mount('#app')
import elStore from "./vuex/basket/index.js";
import ElementUI from 'element-ui';
import { Button, Select, Table,   Collapse,
    CollapseItem,} from 'element-ui';

import Vue from 'vue';
import App from './App.vue';


Vue.use(ElementUI);

Vue.component(Button.name, Button);
// Vue.use(Button);
Vue.use(Select);
Vue.use(Table);
Vue.use(Collapse);
Vue.use(CollapseItem);

new Vue({
    el: '#app',
    store: elStore,

    render: h => h(App),


    // render: (h) => h(App),
}).$mount('#app');

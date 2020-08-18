import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import {getStore} from "@/store/store";

Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store: getStore(),
}).$mount('#app')

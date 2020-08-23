import {createApp} from 'vue';
import App from './App.vue'
import {getStore} from "@/store/store";
import TSNodeList from "@/components/editors/ts/components/TSNodeList.vue";
import TSNode from "@/components/editors/ts/components/TSNode.vue";

const app = createApp(App)
    .use(getStore());

app.component('TSNodeList', TSNodeList);
app.component('TSNode', TSNode);
app.mount('#app');

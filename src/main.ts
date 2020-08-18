import { createApp } from 'vue';
import App from './App.vue'
import {getStore} from "@/store/store";

createApp(App).use(getStore()).mount('#app')

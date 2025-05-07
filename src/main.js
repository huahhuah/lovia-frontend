//import "./assets/main.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

// 引入 Bootstrap 5 的 CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// （選用）引入 Bootstrap 的 JS，如有需要
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(VueAxios, axios)

app.mount('#app')

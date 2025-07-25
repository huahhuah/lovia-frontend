//import "./assets/main.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/auth'

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

const userStore = useUserStore()
userStore.restore()

const baseURL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

if (userStore.token) {
  axios
    .post(`${baseURL}/users/status`, null, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    .then((res) => {
      userStore.setUser(res.data.user)
    })
    .catch(() => {
      userStore.clear()
    })
}

app.mount('#app')

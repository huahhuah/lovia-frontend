//import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import axios from "axios";
import VueAxios from "vue-axios";

import App from "./App.vue";
import router from "./router";

// 引入 Bootstrap 5 的 CSS
import "bootstrap/dist/css/bootstrap.min.css";
// （選用）引入 Bootstrap 的 JS，如有需要
import "bootstrap";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);

app.mount("#app");

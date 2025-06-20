<script setup>
// { RouterLink, RouterView } from "vue-router";
import Header from './layouts/Header.vue'
import Footer from './layouts/Footer.vue'
import { useUserStore } from './stores/auth'
import { onMounted } from 'vue'
import axios from 'axios'

const userStore = useUserStore()
const baseUrl = 'https://lovia-backend-xl4e.onrender.com/api/v1'
onMounted(async () => {
  // 儲存過的 token/user 還原
  userStore.restore()

  // 如果有 token 但沒有 user，就從 /users/me 補資料
  if (userStore.token && !userStore.user) {
    try {
      const res = await axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })
      userStore.setUser(res.data.data)
    } catch (err) {
      console.warn('自動還原使用者失敗，清除登入狀態', err)
      userStore.clear()
    }
  }
})
</script>

<template>
  <div class="app-container d-flex flex-column min-vh-100">
    <Header />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
/* 全站最外層保險網 */
.app-container {
  overflow-x: hidden;
  max-width: 100vw;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}
</style>

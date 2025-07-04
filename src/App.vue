<script setup>
import Header from './layouts/Header.vue'
import Footer from './layouts/Footer.vue'
import AiChatWidget from './components/AiChatWidget.vue'
import { useUserStore } from './stores/auth'
import { useRoute } from 'vue-router'
import { onMounted, computed } from 'vue'
import axios from 'axios'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

const userStore = useUserStore()
const route = useRoute()

useRestoreAuth()

const baseUrl = 'https://lovia-backend-xl4e.onrender.com/api/v1'

// 判斷是否在管理後台頁面
const isAdminPage = computed(
  () => route.path.startsWith('/admin') || route.path.startsWith('/admins')
)

onMounted(async () => {
  // 如果 token 有但 user 沒有，就補 /users/me
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
    <!-- 只有不是 admin 頁才顯示 AI 客服 -->
    <AiChatWidget v-if="!isAdminPage" />
  </div>
</template>

<style>
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

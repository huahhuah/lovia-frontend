<!-- 第三方登入成功通知 -->
<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100">
    <div class="spinner-border text-primary mb-3" role="status" v-if="isLoading">
      <span class="visually-hidden">載入中...</span>
    </div>
    <h5 class="text-center">{{ loadingMessage }}</h5>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLoading = ref(true)
const loadingMessage = ref('登入中，請稍後...')

const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

onMounted(async () => {
  const token = route.query.token

  if (!token || typeof token !== 'string') {
    loadingMessage.value = '登入失敗：缺少 token，請重新登入'
    return setTimeout(() => router.push('/login'), 2000)
  }

  try {
    // 儲存 token
    localStorage.setItem('token', token)
    userStore.setToken(token)

    // 呼叫後端 /users/me 拿使用者資料
    const res = await axios.get(`${backendUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const user = res.data.data
    if (!user || !user.id) throw new Error('無效的使用者資料')

    userStore.setUser(user)
    loadingMessage.value = '登入成功，正在前往首頁...'
    setTimeout(() => router.push('/'), 1000)
  } catch (err) {
    console.error('登入錯誤：', err)
    loadingMessage.value = '登入失敗，請重新登入'
    userStore.clear()
    setTimeout(() => router.push('/login'), 2500)
  }
})
</script>

import { useUserStore } from '@/stores/auth'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

export async function useRestoreAuth() {
  const userStore = useUserStore()
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const route = useRoute()
  const router = useRouter()

  // [1] 支援從 URL 還原 token（付款導回時）
  const tokenFromUrl = route.query.token
  if (tokenFromUrl && typeof tokenFromUrl === 'string') {
    userStore.setToken(tokenFromUrl)
    localStorage.setItem('token', tokenFromUrl)
    sessionStorage.setItem('token', tokenFromUrl)
    console.log('🔑 從 URL 還原 token 並寫入 userStore')
  }

  // [2] 還原 localStorage 的 token/user
  userStore.restore()
  console.log('🔁 還原 token:', userStore.token)

  // [3] 若有 token → 呼叫後端確認有效性
  if (userStore.token) {
    try {
      const res = await axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })

      const serverUser = res.data?.data || null
      const localUser = userStore.user

      if (!serverUser) {
        console.warn('❌ 後端未回傳使用者資料，清除登入')
        userStore.clear()
        return
      }

      if (!localUser || localUser.id === serverUser.id) {
        userStore.setUser(serverUser)
      } else {
        console.warn('⚠️ 使用者 ID 不一致，可能是舊資料，清除登入')
        userStore.clear()
      }
    } catch (err) {
      console.warn('🚫 無法驗證使用者身分，清除登入資訊', err)
      userStore.clear()
    }
  }
}

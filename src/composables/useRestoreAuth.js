import { useUserStore } from '@/stores/auth'
import axios from 'axios'

export async function useRestoreAuth() {
  const userStore = useUserStore()
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  userStore.restore()
  console.log('restore token:', userStore.token)

  if (userStore.token) {
    try {
      const res = await axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      })

      console.log('API 回傳 res.data:', res.data)

      const serverUser = res.data?.data || null
      const localUser = userStore.user

      if (!serverUser) {
        console.warn('API 沒有回傳使用者資料，清除登入')
        userStore.clear()
        return
      }

      if (!localUser || localUser.id === serverUser.id) {
        userStore.setUser(serverUser)
      } else {
        console.warn('使用者 ID 不一致')
      }
    } catch (err) {
      console.warn('無法還原使用者資料，清除登入資訊', err)
      userStore.clear()
    }
  }
}

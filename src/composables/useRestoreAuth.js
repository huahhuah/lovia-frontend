import { useUserStore } from '@/stores/auth'
import { onMounted } from 'vue'
import axios from 'axios'

export function useRestoreAuth() {
  const userStore = useUserStore()
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  onMounted(async () => {
    userStore.restore()

    if (userStore.token) {
      try {
        const res = await axios.get(`${baseUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        })

        const serverUser = res.data.data
        const localUser = userStore.user

        if (!localUser || localUser.id === serverUser.id) {
          userStore.setUser(serverUser)
        } else {
          console.warn(' 使用者 ID 不一致，可能是 Google 自動登入覆蓋')
        }
      } catch (err) {
        console.warn(' 無法還原使用者資料，清除登入資訊', err)
        userStore.clear()
      }
    }
  })
}

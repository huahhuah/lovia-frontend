import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: (() => {
      try {
        const raw = localStorage.getItem('user')
        return raw && raw !== 'undefined' ? JSON.parse(raw) : null
      } catch (e) {
        console.warn('localStorage 解析失敗:', e)
        return null
      }
    })(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role?.role_type === '管理員',
    isProposer: (state) => state.user?.role?.role_type === '提案者',
    isSponsor: (state) =>
      state.user?.role?.role_type === '募資者' || state.user?.role?.role_type === '提案者',
  },
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUser(user) {
      this.user = {
        ...this.user, // 保留原本的屬性（特別是 role）
        ...user, // 用新資料更新
      }
      localStorage.setItem('user', JSON.stringify(this.user))
      console.log('已設置使用者:', this.user)
    },
    clear() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

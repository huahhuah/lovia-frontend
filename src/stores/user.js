import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: (() => {
      try {
        const raw = localStorage.getItem('user');
        return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn('localStorage 解析失敗:', e);
        return null;
      }
    })()
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    clear() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

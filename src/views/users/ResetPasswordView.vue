<template>
  <div class="reset-password-container">
    <h2>重設密碼</h2>
    <div v-if="tokenValid">
      <form @submit.prevent="submitNewPassword">
        <div class="form-group">
          <label for="password">請輸入新密碼：</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            maxlength="16"
            placeholder="密碼需包含大小寫英文與數字，8-16字元"
          />
          <small class="password-hint">密碼需包含大小寫英文與數字，長度 8-16 字元</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">確認新密碼：</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="請再次輸入新密碼"
          />
        </div>

        <button type="submit" :disabled="loading || !isFormValid">
          {{ loading ? '更新中...' : '更新密碼' }}
        </button>
      </form>
    </div>

    <div v-else class="token-error">
      <p class="error">連結已過期或無效，請重新申請重設密碼。</p>
      <router-link to="/forgot-password" class="link-button">重新申請</router-link>
    </div>

    <p v-if="message" :class="{'success': success, 'error': !success}">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ResetPasswordView',
  props: ['token'],
  data() {
    return {
      password: '',
      confirmPassword: '',
      loading: false,
      message: '',
      success: false,
      tokenValid: true,
      baseUrl: 'https://lovia-backend-xl4e.onrender.com/api/v1/users'
    }
  },
  computed: {
    isFormValid() {
      return this.password.length >= 8 &&
             this.confirmPassword.length >= 8 &&
             this.password === this.confirmPassword &&
             this.isPasswordValid
    },
    isPasswordValid() {
      const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/
      return passwordPattern.test(this.password)
    }
  },
  mounted() {
    // 檢查 token 是否存在
    if (!this.token) {
      this.tokenValid = false
      this.message = '缺少重設密碼 token'
      this.success = false
    }
  },
  methods: {
    async submitNewPassword() {
      // 前端驗證
      if (this.password !== this.confirmPassword) {
        this.message = '密碼與確認密碼不一致'
        this.success = false
        return
      }

      if (!this.isPasswordValid) {
        this.message = '密碼格式不正確，需包含大小寫英文與數字，長度 8-16 字元'
        this.success = false
        return
      }

      this.loading = true
      this.message = ''

      try {
        const res = await axios.post(`${this.baseUrl}/reset-password/${this.token}`, {
          password: this.password
        })

        this.message = res.data.message || '密碼已更新，請重新登入'
        this.success = true

        // 成功後 3 秒跳轉到登入頁面
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)

      } catch (err) {
        console.error('重設密碼錯誤:', err)

        if (err.response?.status === 400 && err.response?.data?.message?.includes('過期')) {
          this.tokenValid = false
        }

        this.message = err.response?.data?.message || '更新失敗，請稍後再試'
        this.success = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 50vh auto 0 auto;
  transform: translateY(-50%);
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.password-hint {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success {
  color: green;
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 1rem;
}

.token-error {
  text-align: center;
}

.link-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
}

.link-button:hover {
  background-color: #218838;
}
</style>

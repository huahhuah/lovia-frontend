<template>
  <div class="forgot-password-container">
    <div class="form-card">
    <h2>忘記密碼</h2>
    <p>請輸入您的電子郵件地址，我們將發送重設密碼連結給您。</p>

    <form @submit.prevent="submitForgotPassword" v-if="!success">
      <div class="form-group">
        <label for="email">電子郵件：</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="請輸入您的電子郵件"
          :disabled="loading"
        />
      </div>

      <button type="submit" :disabled="loading || !email">
        {{ loading ? '發送中...' : '發送重設連結' }}
      </button>
    </form>

    <div v-if="success" class="success-message">
      <h3>✓ 重設連結已發送</h3>
      <p>請檢查您的電子郵件，點擊連結來重設密碼。</p>
      <p class="note">如果沒有收到郵件，請檢查垃圾郵件資料夾。</p>
      <router-link to="/login" class="link-button">返回登入</router-link>
    </div>

    <p v-if="message" :class="{'success': success, 'error': !success}">{{ message }}</p>

    <div class="back-to-login">
      <router-link to="/login">← 返回登入頁面</router-link>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: '',
      loading: false,
      message: '',
      success: false,

    }
  },
  methods: {
    async submitForgotPassword() {
      // 基本驗證
      if (!this.email) {
        this.message = '請輸入電子郵件地址'
        this.success = false
        return
      }

      // 簡單的 email 格式驗證
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(this.email)) {
        this.message = '請輸入有效的電子郵件格式'
        this.success = false
        return
      }

      this.loading = true
      this.message = ''

      try {
        const response = await axios.post('https://lovia-backend-xl4e.onrender.com/api/v1/users/forgot-password', {
          email: this.email // ✅ 這裡改成 account
        })

        this.message = response.data.message || '重設密碼連結已發送到您的信箱'
        this.success = true

        // 清空表單
        this.email = ''

      } catch (error) {
        console.error('忘記密碼請求錯誤:', error)

        // 處理不同的錯誤狀況
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.message = '找不到此電子郵件地址'
              break
            case 429:
              this.message = '請求過於頻繁，請稍後再試'
              break
            case 500:
              this.message = '服務器錯誤，請稍後再試'
              break
            default:
              this.message = error.response.data?.message || '發送失敗，請稍後再試'
          }
        } else if (error.request) {
          this.message = '網路連線錯誤，請檢查網路連線'
        } else {
          this.message = '發送失敗，請稍後再試'
        }

        this.success = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  padding: 80px 16px 60px; /* 上避開 navbar，下避開 footer */
}

.form-card {
  background-color: #fff9f5;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-weight: bold;
}

p {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #FC5B53;
  box-shadow: 0 0 0 2px rgba(252, 91, 83, 0.25);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #FC5B53;
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #e4504b;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  padding: 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: #155724;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #155724;
  margin-bottom: 0.5rem;
}

.note {
  font-size: 0.9rem;
  color: #6c757d !important;
}

.success,
.error {
  text-align: center;
  font-weight: bold;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.success {
  color: #28a745;
  background-color: #e6f4ea;
  border: 1px solid #28a745;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.link-button {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.link-button:hover {
  background-color: #218838;
}

.back-to-login {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.back-to-login a {
  color: #007bff;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>

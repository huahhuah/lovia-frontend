<template>
  <div class="container-fluid login-wrapper d-flex justify-content-center align-items-center px-3">
    <div class="row w-100" style="max-width: 960px">
      <!-- 左側插圖與標語 -->
      <div class="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center">
        <img
          src="@/assets/images/login-illustration.png"
          alt="login愛心圖"
          class="mb-3"
          style="max-width: 75%; height: auto"
        />
        <p class="text-center fw-semibold fs-5">你的善意，讓世界更有溫度</p>
      </div>

      <!-- 右側登入表單 -->
      <div class="col-md-6">
        <div class="border rounded-4 p-4 shadow-sm bg-light">
          <div class="text-center mb-3">
            <i class="bi bi-person-circle fs-1"></i>
            <h3 class="fw-bold mt-2">登入</h3>
          </div>

          <form @submit.prevent="handleLogin">
            <!-- 帳號 -->
            <div class="mb-3">
              <label for="email" class="form-label">電子信箱</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="form.email"
                placeholder="lovia@example.com"
                required
              />
            </div>

            <!-- 密碼輸入 + 顯示隱藏密碼 -->
            <div class="mb-3">
              <label for="password" class="form-label">密碼</label>
              <div class="position-relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control pe-5"
                  id="password"
                  v-model="form.password"
                  placeholder="請輸入密碼"
                  required
                />
                <span class="toggle-eye" @click="togglePassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>
            </div>

            <button type="submit" class="btn btn-outline-dark w-100 mb-3">登入</button>
          </form>

          <!-- 提示區塊 -->
          <div class="text-center mt-4">
            <p class="small mb-2">
              <span class="text-muted">尚未成為會員？</span>
              <router-link to="/register" class="text-primary fw-semibold text-decoration-none"
                >註冊</router-link
              >
              <span class="mx-1">|</span>
              <router-link
                to="/forgot-password"
                class="text-primary fw-semibold text-decoration-none"
                >忘記密碼？</router-link
              >
            </p>

            <p class="text-secondary small mb-3">或使用以下方式登入</p>

            <button
              class="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style="background-color: #5f6368; color: white; border-radius: 10px"
            >
              <img src="@/assets/icons/google-g.svg" alt="Google" width="20" height="20" />
              使用 Google 帳戶登入
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/auth'

const router = useRouter()
const userStore = useUserStore()
const baseUrl = 'https://lovia-backend-xl4e.onrender.com'

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

async function handleLogin() {
  if (!form.email || !form.password) {
    alert('請輸入帳號與密碼')
    return
  }

  const payload = {
    account: form.email,
    password: form.password,
  }

  try {
    const res = await axios.post(`${baseUrl}/api/v1/users/signin`, payload)

    const { token, users: user } = res.data.data
    //驗證資料格式
    if (!token || typeof token !== 'string') {
      throw new Error('回傳 token 格式錯誤')
    }
    if (!user || typeof user !== 'object' || !user.username) {
      throw new Error('回傳 user 格式錯誤')
    }

    // 儲存登入資料到 Pinia 和 localStorage
    userStore.setToken(token)
    userStore.setUser(user)

    alert('登入成功')
    router.push('/')
  } catch (err) {
    const msg = err.response?.data?.message || err.message || '登入失敗，請確認帳密是否正確'
    alert(msg)
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-image: url('@/assets/images/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.toggle-eye {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
}
</style>

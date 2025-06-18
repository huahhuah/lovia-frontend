<template>
  <div class="container-fluid login-wrapper d-flex justify-content-center align-items-center px-3">
    <div class="row w-100" style="max-width: 960px">
      <!-- 左側插圖與標語 -->
      <div class="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center">
        <img src="/login.png" alt="login愛心圖" class="mb-3" style="max-width: 75%; height: auto" />
        <p class="text-center fw-semibold fs-4 mt-2" style="margin-top: -10px">
          你的善意，讓世界更有溫度
        </p>
      </div>

      <!-- 右側登入表單 -->
      <div class="col-md-6">
        <div class="form-box">
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

            <!-- 密碼 -->
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

            <button type="submit" class="btn login-btn w-100 mb-3">登入</button>
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
              @click="loginWithGoogle"
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

    <!--  Toast 通知提示 -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      <div
        class="toast align-items-center text-white"
        :class="toastType === 'success' ? 'bg-success' : 'bg-danger'"
        ref="toastRef"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/auth'
import { Toast } from 'bootstrap'

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

//  Toast 控制
const toastRef = ref(null)
const toastInstance = ref(null)
const toastMessage = ref('')
const toastType = ref('success')

onMounted(async () => {
  toastInstance.value = new Toast(toastRef.value, { delay: 2500, autohide: true })

  const query = new URLSearchParams(window.location.search)
  const code = query.get('code')

  if (code) {
    try {
      const res = await axios.post(`${baseUrl}/api/v1/auth/google`, { code })
      const { token, users: user } = res.data.data

      userStore.setToken(token)
      userStore.setUser(user)
      localStorage.setItem('token', token)

      showToast('Google 登入成功', 'success')
      setTimeout(() => {
        router.push('/')
      }, 1600)
    } catch (err) {
      showToast('Google 登入失敗，請重新嘗試', 'danger')
      console.error('[Google 登入錯誤]', err)
    }
  }
})

function showToast(msg, type = 'success') {
  toastMessage.value = msg
  toastType.value = type
  toastInstance.value?.show()
}

async function handleLogin() {
  if (!form.email || !form.password) {
    showToast('請輸入帳號與密碼', 'danger')
    return
  }

  const payload = {
    account: form.email,
    password: form.password,
  }

  try {
    const res = await axios.post(`${baseUrl}/api/v1/users/signin`, payload)
    const { token, users: user } = res.data.data

    if (!token || typeof token !== 'string') throw new Error('回傳 token 格式錯誤')
    if (!user || typeof user !== 'object' || !user.username) throw new Error('回傳 user 格式錯誤')

    userStore.setToken(token)
    userStore.setUser({
      ...user,
      account: form.email,
    })

    localStorage.setItem('token', token)
    sessionStorage.setItem('token', token)
    showToast('登入成功', 'success')

    setTimeout(() => {
      location.href = '/'
    }, 1500)
  } catch (err) {
    const msg = err.response?.data?.message || err.message || '登入失敗，請確認帳密是否正確'
    showToast(msg, 'danger')
  }
}

function loginWithGoogle() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope:
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    access_type: 'online',
    prompt: 'consent',
  })

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-wrapper .form-box {
  background-color: #fff9f5;
  border: none;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* 陰影加深 */
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

.login-wrapper .login-btn {
  background-color: #fc5b53;
  color: white;
  border-radius: 50px;
  font-weight: bold;
}

.login-wrapper .google-btn {
  background-color: #d5dae0;
  color: black;
  border-radius: 20px;
}
</style>

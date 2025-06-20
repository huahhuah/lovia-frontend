<template>
  <div
    class="container-fluid register-wrapper min-vh-100 d-flex justify-content-center align-items-center px-3"
  >
    <div class="row w-100" style="max-width: 960px">
      <!-- 左側內容 -->
      <div class="col-12 col-md-6 d-flex flex-column justify-content-center">
        <h2 class="fw-bold">註冊新帳號</h2>
        <p class="small">
          已經有帳號了嗎？
          <router-link to="/login" class="text-primary text-decoration-none">登入</router-link>
        </p>
        <img
          src="@/assets/images/bg pic 4.png"
          class="mb-3 d-none d-md-block"
          style="max-width: 100%; height: auto"
        />
      </div>

      <!-- 右側註冊表單 -->
      <div class="col-12 col-md-6 mt-4 mt-md-5">
        <div class="form-card">
          <form @submit.prevent="handleRegister">
            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label"
                >電子信箱 <span class="text-danger">*</span></label
              >
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="form.email"
                :class="{ 'is-invalid': form.email && !isEmailValid }"
                placeholder="lovia@example.com"
                required
              />
              <div class="invalid-feedback">請輸入正確的 Email 格式</div>
            </div>

            <!-- Username -->
            <div class="mb-3">
              <label for="username" class="form-label"
                >使用者名稱 <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="form.username"
                maxlength="50"
                placeholder="請輸入使用者名稱"
                :class="{ 'is-invalid': isUsernameTooLong }"
                required
              />
              <div class="invalid-feedback">使用者名稱最多 50 字元</div>
            </div>

            <!-- 密碼 -->
            <div class="mb-3">
              <label for="password" class="form-label"
                >密碼 <span class="text-danger">*</span></label
              >
              <div class="input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  :class="{ 'is-invalid': form.password && !isPasswordValid }"
                  placeholder="8~16 字，含英文大小寫與數字"
                  required
                />
                <span class="input-group-text eye-button" @click="togglePassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
                <div class="invalid-feedback">密碼需 8~16 字，含英文大小寫與數字</div>
              </div>
            </div>

            <!-- 確認密碼 -->
            <div class="mb-3">
              <label for="confirmPassword" class="form-label"
                >確認密碼 <span class="text-danger">*</span></label
              >
              <div class="input-group">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  class="form-control"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :class="{ 'is-invalid': passwordMismatch }"
                  placeholder="確認密碼"
                  required
                />
                <span class="input-group-text eye-button" @click="toggleConfirm">
                  <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
                <div class="invalid-feedback">兩次密碼不一致</div>
              </div>
            </div>

            <!-- 條款勾選 -->
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="agree"
                v-model="form.agree"
                required
              />
              <label class="form-check-label" for="agree">
                我同意 Lovia 公益網站的
                <a href="#" class="text-decoration-underline">隱私權政策及服務條款</a>。
              </label>
            </div>

            <!-- 註冊按鈕 -->
            <button
              type="submit"
              class="btn rounded-pill w-100 text-white"
              style="background-color: #fc5b53"
            >
              註冊
            </button>

            <!-- Google 登入 -->
            <div class="text-center small mt-4">
              <div class="d-flex align-items-center">
                <hr class="flex-grow-1" />
                <span class="px-2 text-muted">或</span>
                <hr class="flex-grow-1" />
              </div>
              <button
                @click="loginWithGoogle"
                class="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style="background-color: #5f6368; color: white; border-radius: 10px"
              >
                <img src="@/assets/icons/google-g.svg" alt="Google" width="20" height="20" />
                使用 Google 帳戶登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- toast -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div
        ref="toastRef"
        class="toast align-items-center text-white"
        :class="toastType === 'success' ? 'bg-success' : 'bg-danger'"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
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
import { reactive, ref, computed, onMounted } from 'vue'
import { Toast } from 'bootstrap'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const router = useRouter()
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const showPassword = ref(false)
const showConfirm = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)
const toggleConfirm = () => (showConfirm.value = !showConfirm.value)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/
const isEmailValid = computed(() => emailPattern.test(form.email))
const isPasswordValid = computed(() => passwordPattern.test(form.password))
const passwordMismatch = computed(
  () => form.password && form.confirmPassword && form.password !== form.confirmPassword
)

const isUsernameTooLong = computed(() => form.username.length > 50)

//toast 控制
const toastRef = ref(null)
const toastInstance = ref(null)
const toastMessage = ref('')
const toastType = ref('success') // 'success' or 'danger'

onMounted(() => {
  toastInstance.value = new Toast(toastRef.value, { autohide: true, delay: 3000 })
})

function showToast(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  toastInstance.value?.show()
}

async function handleRegister() {
  if (!isEmailValid.value || !isPasswordValid.value || passwordMismatch.value || !form.agree) return

  if (form.username.length > 50) {
    showToast('使用者名稱長度不能超過 50 字元', 'danger')

    return
  }
  try {
    const payload = {
      account: form.email,
      username: form.username,
      password: form.password,
    }
    await axios.post(`${baseUrl}/users/signup`, payload)
    showToast('註冊成功！即將跳轉登入頁', 'success')
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    showToast(err.response?.data?.message || '註冊失敗，請稍後再試', 'danger')
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
.register-wrapper {
  min-height: 100vh;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-wrapper img {
  max-width: 75%;
  height: auto;
}

.register-wrapper .form-title {
  font-weight: bold;
}

.register-wrapper .form-card {
  background-color: #fff9f5;
  border: none;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.register-wrapper .form-control {
  border-radius: 0.5rem;
}

.register-wrapper .eye-button {
  cursor: pointer;
  background-color: #fff;
  border-left: none;
}

.register-wrapper .eye-button i {
  font-size: 1.1rem;
  color: #666;
}

.register-wrapper .input-group-text.eye-button {
  border-top-right-radius: 0.5rem !important;
  border-bottom-right-radius: 0.5rem !important;
}

.register-wrapper .btn {
  border-radius: 50px;
}

.register-wrapper .google-btn {
  background-color: #d5dae0;
  color: black;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .register-wrapper {
    padding-top: 80px; /* 避開固定導覽列 */
    padding-bottom: 60px; /* 拉開 footer 間距 */
  }
}
</style>

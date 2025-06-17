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
              style="background-color: #FC5B53"
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
                type="button"
                class="btn w-100 d-flex align-items-center justify-content-center gap-2 google-btn"
              >
                <img src="@/assets/icons/google-g.svg" alt="Google" width="20" height="20" />
                使用 Google 帳戶登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      ref="modalRef"
      tabindex="-1"
      aria-labelledby="feedbackModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="feedbackModalLabel">提示</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'

const router = useRouter()
const baseUrl = 'https://lovia-backend-xl4e.onrender.com'
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

//Modal 控制
const modalRef = ref(null)
const modalMessage = ref('')
const modalType = ref('success') // 'success' or 'danger'
let modalInstance = null

onMounted(() => {
  modalInstance = new Modal(modalRef.value)
})

function showModal(msg, type = 'danger') {
  modalMessage.value = msg
  modalType.value = type
  modalInstance?.show()
}

async function handleRegister() {
  if (!isEmailValid.value || !isPasswordValid.value || passwordMismatch.value || !form.agree) return

  if (form.username.length > 50) {
    showModal('使用者名稱長度不能超過 50 字元')
    return
  }
  try {
    const payload = {
      account: form.email,
      username: form.username,
      password: form.password,
    }
    await axios.post(`${baseUrl}/api/v1/users/signup`, payload)
    //modalMessage.value = '註冊成功！即將跳轉登入頁'
    showModal('註冊成功！即將跳轉登入頁', 'success')
    setTimeout(() => {
      modalInstance.hide() //關閉 Modal
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) backdrop.remove() //清除殘留遮罩
      router.push('/login')
    }, 1500)
  } catch (err) {
    modalMessage.value = err.response?.data?.message || '註冊失敗，請稍後再試'
    modalInstance.show()
  }
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
  background-color: #D5DAE0;
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

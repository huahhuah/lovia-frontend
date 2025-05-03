<template>
  <div class="container-fluid register-wrapper min-vh-100 d-flex justify-content-center align-items-center px-3">
    <div class="row w-100" style="max-width: 960px;">
      <!-- 左側內容 -->
      <div class="col-md-6 d-flex flex-column justify-content-center">
        <h2 class="fw-bold">註冊新帳號</h2>
        <p class="small">
          已經有帳號了嗎？
          <router-link to="/login" class="text-primary text-decoration-none">登入</router-link>
        </p>
        <img src="@/assets/images/bg pic 4.png" class="mb-3" style="max-width: 100%; height: auto;" />
        <img src="@/assets/images/headline.png" class="mb-3" style="max-width: 50%; height: auto;" />
      </div>

      <!-- 右側註冊表單 -->
      <div class="col-md-6">
        <div class="border rounded-4 p-4 shadow-sm bg-light">
          <form @submit.prevent="handleRegister">
            <!-- Email -->
            <div class="mb-3">
              <label for="email" class="form-label">電子信箱 <span class="text-danger">*</span></label>
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
              <label for="username" class="form-label">使用者名稱 <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="form.username"
                placeholder="請輸入使用者名稱"
                required
              />
            </div>

            <!-- 密碼 -->
            <div class="mb-3">
              <label for="password" class="form-label">密碼 <span class="text-danger">*</span></label>
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
              <label for="confirmPassword" class="form-label">確認密碼 <span class="text-danger">*</span></label>
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

            <!-- 勾選條款 -->
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="agree" v-model="form.agree" required />
              <label class="form-check-label" for="agree">
                我同意 Lovia 公益網站的 <a href="#" class="text-decoration-underline">隱私權政策及服務條款</a>。
              </label>
            </div>

            <!-- 註冊按鈕 -->
            <button type="submit" class="btn btn-dark rounded-pill w-100">註冊</button>

            <!-- Google 登入 -->
            <div class="text-center small mt-4">
              <div class="d-flex align-items-center">
                <hr class="flex-grow-1" />
                <span class="px-2 text-muted">或</span>
                <hr class="flex-grow-1" />
              </div>
              <button
                type="button"
                class="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style="background-color: #5f6368; color: white; border-radius: 20px;"
              >
                <img src="@/assets/icons/google-g.svg" alt="Google" width="20" height="20" />
                使用 Google 帳戶登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  agree: false
});

const showPassword = ref(false);
const showConfirm = ref(false);

const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirm = () => (showConfirm.value = !showConfirm.value);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

const isEmailValid = computed(() => emailPattern.test(form.email));
const isPasswordValid = computed(() => passwordPattern.test(form.password));
const passwordMismatch = computed(() => form.password && form.confirmPassword && form.password !== form.confirmPassword);

async function handleRegister() {
  if (!isEmailValid.value || !isPasswordValid.value || passwordMismatch.value || !form.agree) return;

  try {
    const payload = {
      account: form.email,
      username: form.username,
      password: form.password
    };
    await axios.post('http://localhost:8080/api/v1/users/signup', payload);
    alert('註冊成功！');
    router.push('/login');
  } catch (err) {
    alert(err.response?.data?.message || '註冊失敗，請稍後再試');
  }
}
</script>

<style scoped>
.register-wrapper {
  background-image: url('@/assets/images/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.eye-button {
  cursor: pointer;
  background-color: #fff;
  border-left: none;
}
.eye-button i {
  font-size: 1.1rem;
  color: #666;
}
</style>

<template>
  <div class="edit-wrapper">
    <div class="container d-flex justify-content-center">
      <div
        class="card p-4 rounded-4 shadow"
        style="width: 100%; max-width: 480px; margin-top: 40px"
      >
        <h5 class="fw-bold mb-4 text-center">修改密碼</h5>

        <form @submit.prevent="submitForm" novalidate>
          <!-- 目前密碼 -->
          <div class="mb-3 position-relative">
            <label for="currentPassword" class="form-label">目前密碼</label>
            <input
              :type="showCurrent ? 'text' : 'password'"
              id="currentPassword"
              v-model="form.currentPassword"
              class="form-control"
              :class="{ 'is-invalid': submitted && !form.currentPassword }"
              required
            />
            <i
              :class="['bi', showCurrent ? 'bi-eye-slash' : 'bi-eye', 'toggle-eye']"
              @click="showCurrent = !showCurrent"
              role="button"
              tabindex="0"
              aria-label="切換目前密碼顯示"
            ></i>
            <div class="invalid-feedback">請輸入目前密碼</div>
          </div>

          <!-- 新密碼 -->
          <div class="mb-3 position-relative">
            <label for="newPassword" class="form-label">新密碼</label>
            <input
              :type="showNew ? 'text' : 'password'"
              id="newPassword"
              v-model="form.newPassword"
              class="form-control"
              :class="{
                'is-invalid': submitted && !validNewPassword,
                'is-valid': submitted && validNewPassword,
              }"
              required
              minlength="8"
              maxlength="16"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$"
              autocomplete="new-password"
            />
            <i
              :class="['bi', showNew ? 'bi-eye-slash' : 'bi-eye', 'toggle-eye']"
              @click="showNew = !showNew"
              role="button"
              tabindex="0"
              aria-label="切換新密碼顯示"
            ></i>
            <div class="invalid-feedback">
              密碼需包含英文大小寫及數字，長度 8~16 字
            </div>
          </div>

          <!-- 確認新密碼 -->
          <div class="mb-3 position-relative">
            <label for="newPasswordConfirm" class="form-label">確認新密碼</label>
            <input
              :type="showConfirm ? 'text' : 'password'"
              id="newPasswordConfirm"
              v-model="form.newPasswordConfirm"
              class="form-control"
              :class="{
                'is-invalid': submitted && form.newPasswordConfirm !== form.newPassword,
                'is-valid': submitted && form.newPasswordConfirm === form.newPassword && form.newPasswordConfirm !== '',
              }"
              required
              autocomplete="new-password"
            />
            <i
              :class="['bi', showConfirm ? 'bi-eye-slash' : 'bi-eye', 'toggle-eye']"
              @click="showConfirm = !showConfirm"
              role="button"
              tabindex="0"
              aria-label="切換確認密碼顯示"
            ></i>
            <div class="invalid-feedback">新密碼與確認密碼不一致</div>
          </div>

          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary px-5" :disabled="isSubmitting">
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              修改密碼
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bootstrap Modal -->
    <div
      class="modal fade"
      ref="modalRef"
      tabindex="-1"
      aria-labelledby="modalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div :class="`modal-content border-${modalType === 'success' ? 'success' : 'danger'}`">
          <div class="modal-header">
            <h5 class="modal-title" :class="modalType === 'success' ? 'text-success' : 'text-danger'">
              提示
            </h5>
            <button type="button" class="btn-close" @click="modalInstance.hide()" aria-label="Close"></button>
          </div>
          <div class="modal-body">{{ modalMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useUserStore } from '@/stores/auth'

const baseUrl = 'http://localhost:8080' // 請替換成你的後端API根網址
const userStore = useUserStore()

const form = reactive({
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const submitted = ref(false)
const isSubmitting = ref(false)

const modalRef = ref(null)
const modalMessage = ref('')
const modalType = ref('success')
let modalInstance = null

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/

const validNewPassword = computed(() => passwordPattern.test(form.newPassword))

function showModal(msg, type = 'danger') {
  modalMessage.value = msg
  modalType.value = type
  modalInstance?.show()
}

function showModalAndAutoClose(msg, type = 'danger', delay = 1500) {
  showModal(msg, type)
  setTimeout(() => {
    modalInstance.hide()
    const backdrop = document.querySelector('.modal-backdrop')
    if (backdrop) backdrop.remove()
    document.body.classList.remove('modal-open')
    document.body.style = ''
  }, delay)
}

async function submitForm() {
  submitted.value = true

  if (!form.currentPassword) {
    return showModalAndAutoClose('請輸入目前密碼')
  }
  if (!validNewPassword.value) {
    return showModalAndAutoClose('新密碼格式錯誤，需包含英文數字大小寫，長度 8–16 字')
  }
  if (form.newPassword !== form.newPasswordConfirm) {
    return showModalAndAutoClose('新密碼與確認密碼不一致')
  }

  try {
    isSubmitting.value = true

    const userId = userStore.user?.id
    if (!userId) {
      throw new Error('找不到使用者ID，請重新登入')
    }

    const url = `${baseUrl}/api/v1/users/${userId}/password`
    const payload = {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      newPasswordConfirm: form.newPasswordConfirm,
    }

    const res = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })

    showModalAndAutoClose(res.data.message || '密碼修改成功', 'success')

    form.currentPassword = ''
    form.newPassword = ''
    form.newPasswordConfirm = ''
    submitted.value = false
  } catch (error) {
    showModal(error.response?.data?.message || error.message || '修改密碼失敗')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  modalInstance = new Modal(modalRef.value)
})
</script>

<style scoped>

.form-control {
  padding-right: 2.5rem !important; /* 強制確保有預留空間 */
  height: 2.5rem; /* 確保input高度一致 */
  line-height: 2.5rem; /* 垂直置中 */
  }
.edit-wrapper {
  background-color: transparent;
}

.toggle-eye {
  position: absolute;
  top: 70%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
  user-select: none;
}
</style>

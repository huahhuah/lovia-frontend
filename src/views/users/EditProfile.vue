<template>
  <div class="edit-wrapper">
    <div class="container d-flex justify-content-center">
      <div
        class="card p-4 rounded-4 shadow"
        style="width: 100%; max-width: 720px; margin-top: 40px"
      >
        <h5 class="fw-bold mb-4 text-center">編輯個人資料</h5>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else class="row g-4 align-items-start">
          <!-- 左側：頭像 + 上傳 -->
          <div class="col-md-4 text-center">
            <img
              :src="form.avatar_url || defaultAvatar"
              class="rounded-circle shadow mb-2"
              style="width: 120px; height: 120px; object-fit: cover"
              alt="頭像"
            />
            <label for="avatarInput" class="btn btn-outline-secondary btn-sm">點擊更換圖片</label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onImageChange"
            />
          </div>

          <!-- 右側：表單欄位 -->
          <div class="col-md-8">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">使用者名稱</label>
                <input
                  v-model="form.username"
                  class="form-control"
                  :class="{ 'is-invalid': !usernameValid && form.username }"
                />
                <div class="invalid-feedback">請輸入 2~50 字的使用者名稱</div>
              </div>

              <div class="mb-3">
                <label class="form-label">手機</label>
                <input
                  v-model="form.phone"
                  class="form-control"
                  :class="{ 'is-invalid': !phoneValid && form.phone }"
                />
                <div class="invalid-feedback">請輸入正確的手機號碼</div>
              </div>

              <div class="mb-3">
                <label class="form-label">生日</label>
                <input v-model="form.birthday" type="date" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="gender" class="form-label">性別</label>
                <select id="gender" v-model.number="form.gender" class="form-select">
                  <option disabled value="">請選擇</option>
                  <option value="1">男性</option>
                  <option value="2">女性</option>
                  <option value="3">其他</option>
                  <option value="4">不願透露</option>
                </select>
              </div>

              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary px-5" :disabled="isSubmitting">
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  修改
                </button>
              </div>
            </form>
          </div>
        </div>
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
      <div class="modal-dialog">
        <div class="modal-content">
          <div :class="`modal-header bg-${modalType}`">
            <h5 class="modal-title text-white" id="modalLabel">提示</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body">{{ modalMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import router from '@/router'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { useUserStore } from '@/stores/auth'

const baseUrl = 'https://lovia-backend-xl4e.onrender.com'
const userStore = useUserStore()

const genderOptions = [
  { value: 1, label: '男性' },
  { value: 2, label: '女性' },
  { value: 3, label: '其他' },
  { value: 4, label: '不願透露' },
]

const genderReverseMap = {
  male: 1,
  female: 2,
  other: 3,
  undisclosed: 4,
  男性: 1,
  女性: 2,
  其他: 3,
  不願透露: 4,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
}

const form = reactive({
  username: '',
  phone: '',
  avatar_url: '',
  birthday: '',
  gender: '',
})

const isLoading = ref(true)
const isSubmitting = ref(false)
const modalRef = ref(null)
const modalMessage = ref('')
const modalType = ref('success')
let modalInstance = null

const usernameValid = computed(() => form.username.trim().length >= 2 && form.username.length <= 50)
const phonePattern = /^09\d{8}$/
const phoneValid = computed(() => phonePattern.test(form.phone))

function showModal(msg, type = 'danger') {
  modalMessage.value = msg
  modalType.value = type
  modalInstance?.show()
}

function onImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.avatar_url = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function fetchUserProfile() {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })
    const user = res.data.user
    form.username = user.username || ''
    form.phone = user.phone || ''
    form.avatar_url = user.avatar_url || ''
    form.birthday = user.birthday || ''
    form.gender = genderReverseMap[user.gender?.gender ?? user.gender] ?? ''
    userStore.setUser(user)
  } catch (err) {
    console.error('取得個人資料失敗:', err)
    if (err.response?.status === 401) {
      showModal('登入已過期，請重新登入')
      setTimeout(() => {
        userStore.clear()
        modalInstance.hide()
        const backdrop = document.querySelector('.modal-backdrop')
        if (backdrop) backdrop.remove()
        document.body.classList.remove('modal-open')
        document.body.style = ''
        router.push('/login')
      }, 1500)
    } else {
      showModal('載入個人資料失敗')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  modalInstance = new Modal(modalRef.value)
  await fetchUserProfile()
})

async function submitForm() {
  if (!usernameValid.value) return showModal('請輸入 2~50 字的使用者名稱')
  if (!phoneValid.value) return showModal('請輸入正確的手機號碼')

  if (form.avatar_url?.startsWith('data:image')) {
    showModal('圖片尚未上傳，請等待圖片上傳功能完成後再修改頭像')
    setTimeout(() => {
      modalInstance.hide()
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) backdrop.remove()
    }, 1500)
    return
  }

  const payload = {
    username: form.username.trim(),
    phone: form.phone.trim(),
    birthday: form.birthday || null,
    gender: form.gender || null,
  }

  try {
    isSubmitting.value = true
    const response = await axios.patch(`${baseUrl}/api/v1/users/profile`, payload, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })
    showModal('修改成功！', 'success')
    userStore.setUser(response.data.user)
    setTimeout(() => {
      modalInstance.hide()
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) backdrop.remove()
    }, 1500)
  } catch (error) {
    console.error('修改個人資料失敗:', error)
    showModal(error.response?.data?.message || '修改失敗')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.edit-wrapper {
  background-color: transparent;
}
</style>

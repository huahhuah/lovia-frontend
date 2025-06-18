<template>
  <div class="edit-wrapper d-flex justify-content-center align-items-center py-5">
    <div class="edit-card card border-0 rounded-4 shadow p-4 w-100" style="max-width: 720px">
      <div class="text-center mb-4">
        <h3 class="fw-bold mt-2">編輯個人資料</h3>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-4 text-center avatar-section">
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
              <input
                type="date"
                v-model="form.birthday"
                class="form-control"
                :max="maxBirthday"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">性別</label>
              <select v-model.number="form.gender" class="form-select">
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
</template>

<script setup>
import { onMounted, reactive, ref, computed, nextTick } from 'vue'
import { Modal } from 'bootstrap'

import axios from 'axios'
import router from '@/router'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { useUserStore } from '@/stores/auth'

const baseUrl = 'https://lovia-backend-xl4e.onrender.com'
const userStore = useUserStore()
const form = reactive({ username: '', phone: '', avatar_url: '', birthday: '', gender: '' })
const isLoading = ref(true)
const isSubmitting = ref(false)
const modalRef = ref(null)
const modalMessage = ref('')
const modalType = ref('success')
let modalInstance = null

const toastRef = ref(null)
const toastMessage = ref('')
let toastInstance = null

function showToast(msg = '操作成功') {
  toastMessage.value = msg
  if (!toastInstance) toastInstance = new Toast(toastRef.value)
  toastInstance.show()
}

const maxBirthday = new Date().toISOString().split('T')[0]
const usernameValid = computed(() => form.username.trim().length >= 2 && form.username.length <= 50)
const phoneValid = computed(() => /^09\d{8}$/.test(form.phone))

function isValidBirthday(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateStr)) return false

  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= today
  )
}

function showModal(msg, type = 'danger') {
  modalMessage.value = msg
  modalType.value = type
  modalInstance?.show()
}

async function onImageChange(event) {
  const file = event.target.files[0]
  if (!file) return 
  if (file.size > 10*1024*1024 ) {
      return showModalAndAutoClose('檔案太大，請選擇10MB以下的圖片')
    }
  try{
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'avatar')

    const res = await axios.post(`${baseUrl}/api/v1/uploads/image`, formData, {
      headers: {
        Authorization:`Bearer ${userStore.token}`,
        'Content-Type' : 'multipart/form-data',
      },
    })
  const { url } = res.data
  form.avatar_url = url
  } catch (error){
    console.error('圖片上傳失敗', error)
    showModalAndAutoClose('圖片上傳失敗', error)
  }
}

function convertGender(gender){
   switch (gender) {
    case 1:
    case '1':
    case 'male':
    case '男性':
      return 1
    case 2:
    case '2':
    case 'female':
    case '女性':
      return 2
    case 3:
    case '3':
    case 'other':
    case '其他':
      return 3
    case 4:
    case '4':
    case 'undisclosed':
    case '不願透露':
      return 4
    default:
      return ''
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
    form.avatar_url = user.avatar_url ? `${user.avatar_url}?t=${Date.now()}` : ''
    form.birthday = user.birthday || ''
    form.gender = convertGender(user.gender?.gender ?? user.gender) 
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
  await nextTick()
  if(modalRef.value){
    modalInstance = new Modal(modalRef.value)
    }
  await fetchUserProfile()
})

async function submitForm() {
  if (!usernameValid.value) return showModalAndAutoClose('請輸入 2~50 字的使用者名稱')
  if (!phoneValid.value) return showModalAndAutoClose('請輸入正確的手機號碼')

  if (form.birthday?.includes('/')) {
    form.birthday = form.birthday.replace(/\//g, '-')
  }

  if (form.birthday && !isValidBirthday(form.birthday)) {
    return showModalAndAutoClose('生日格式錯誤，請使用 YYYY-MM-DD 格式')
  }

  if (form.avatar_url?.startsWith('data:image')) {
    return showModalAndAutoClose('圖片尚未上傳，請等待圖片上傳功能完成後再修改頭像')
  }

  // ✅ payload 組裝：不傳 null 給 avatar_url，避免後端報錯
  const payload = {
    username: form.username.trim(),
    phone: form.phone.trim(),
    birthday: form.birthday || null,
    gender: form.gender || null,
    avatar_url: form.avatar_url ? form.avatar_url.split('?t')[0] : null,
  }

  console.log('🔍 PATCH payload：', payload)

  try {
    isSubmitting.value = true
    const response = await axios.patch(`${baseUrl}/api/v1/users/profile`, payload, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })

    showModal('修改成功！', 'success')
    userStore.setUser(response.data.data.user)
    setTimeout(() => {
      modalInstance.hide()
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) backdrop.remove()
    }, 1500)
  } catch (error) {
    console.error('修改失敗:', error)
    showModal(error.response?.data?.message || '修改失敗')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.card {
  margin-top: -50px;
  padding: 32px 24px; /* 比原本 padding 少一些 */
}

.edit-wrapper {
  min-height: 100vh;
  background-image: linear-gradient(to right, #FFEDF2, #FFF6E3);
}

.edit-card {
  background-color: #fff9f5;
}

.btn-primary {
  background-color: #FC5B53;
  border: none;
  border-radius: 999px; /* 變圓角 */
}

.btn-primary:hover {
  background-color: #e44c47; /* 深一點的 hover 色（可選） */
}

.avatar-section {
  margin-top: 20px; /* 或改 20px 看起來自然即可 */
}

@media (max-width: 767.98px) {
  .avatar-section label {
    display: block;
    margin-top: 8px;
  }
}
</style>
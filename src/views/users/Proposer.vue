<template>
  <section class="apply-proposer-section">
    <div class="container py-1" style="max-width: 720px">
      <h2 class="fw-bold mb-4 text-center">申請成為提案者</h2>

      <div class="apply-subtitle mb-4 text-center">
        若您希望成為提案者，請提供以下資料，供平台審核：
      </div>

      <!-- ✅ 新增外框樣式 -->
      <div class="form-wrapper p-4">
        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
          <!-- 衛福部網址 -->
          <div class="mb-3">
            <label for="campaignUrl" class="form-label fw-semibold">
              衛福部公益勸募活動許可網址
              <a
                href="https://sasw.mohw.gov.tw/app39/"
                target="_blank"
                rel="noopener noreferrer"
                class="ms-2 small text-decoration-underline"
              >
                點擊前往
              </a>
            </label>
            <input
              type="url"
              id="campaignUrl"
              v-model="form.campaignUrl"
              class="form-control"
              placeholder="https://..."
              required
            />
          </div>

          <!-- 專戶資訊 -->
          <div class="mb-4">
            <label for="accountInfo" class="form-label fw-semibold">
              勸募活動專戶資訊
            </label>
            <textarea
              id="accountInfo"
              v-model="form.accountInfo"
              class="form-control"
              rows="4"
              placeholder="請填寫：戶名、銀行名稱、分行、帳號"
              required
            ></textarea>
          </div>

          <!-- 按鈕 -->
          <div class="d-flex justify-content-center gap-3">
            <button type="submit" class="btn btn-dark px-4">送出申請</button>
            <button type="button" class="btn btn-outline-secondary" @click="handleCancel">
              取消
            </button>
          </div>

          <!-- 成功/錯誤訊息 -->
          <div v-if="message" :class="`alert mt-4 ${messageType}`">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/auth'
  
  const router = useRouter()
  const userStore = useUserStore()
  const form = ref({
    campaignUrl: '',
    accountInfo: '',
  })
  
  const message = ref('')
  const messageType = ref('alert-success') // or alert-danger
  
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'https://lovia-backend-xl4e.onrender.com/api/v1/users/postApplication',
        {
          url: form.value.campaignUrl,
          funding_account: form.value.accountInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }
      )
  
      message.value = '申請已送出，待管理員審核'
      messageType.value = 'alert-success'
  
      setTimeout(() => {
        router.push('/user')
      }, 3500)
    } catch (error) {
      message.value = error.response?.data?.message || '送出失敗，請稍後再試'
      messageType.value = 'alert-danger'
    }
  }
  
  const handleCancel = () => {
    router.push('/')
  }
  </script>
  
<style scoped>
.apply-proposer-section {
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  padding-top: 120px;
  padding-bottom: 4rem;
  min-height: 100vh;
  font-family: 'Noto Sans TC', sans-serif;
}

.form-wrapper {
  background-color: rgba(255, 248, 249, 0.4);
  border: 1px solid #d5dae0;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(213, 218, 224, 0.1);
}

label.form-label {
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

button {
  border-radius: 999px !important;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
}

/* ✅ 訊息欄美化 */
.alert {
  font-size: 0.95rem;
  line-height: 1.6;
}

.apply-subtitle {
  font-size: 1rem;
  color: #6c757d; /* Bootstrap 的 secondary 灰色 */
  border-radius: 8px;
}

/* ✅ 手機 RWD */
@media (max-width: 576px) {
  .form-wrapper {
    padding: 1.5rem;
  }

  .apply-proposer-section {
    padding-top: 100px;
    padding-bottom: 3rem;
  }

  button {
    width: 100%;
    padding: 0.6rem 0;
  }

  .d-flex.justify-content-center.gap-3 {
    flex-direction: column;
    gap: 1rem !important;
  }
}
</style>
  
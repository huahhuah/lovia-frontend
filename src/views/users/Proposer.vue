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
            <!-- ✅ 新增說明文字 -->
            <small class="text-muted d-block mt-2">
              *提醒您：為了保障捐款人之權益與提案的合法性，依據法規規定，公益募資必須先取得主管機關（如衛福部）許可，方能向大眾募集資源。
            </small>
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
    <!-- 常見問答區 -->
    <div class="container" style="max-width: 1000px">
    <div class="faq-section mt-5">
      <h5 class="fw-bold mb-3 text-center">常見問答 Q&A</h5>
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item mb-3">
        <!-- 問題區 -->
        <button
          class="faq-question btn w-100 text-start fw-semibold d-flex align-items-start"
          @click="toggleFAQ(index)"
        >
          <span class="me-2">Q:</span>{{ faq.question }}
          <span class="float-icon me-2 ms-auto">{{ faq.open ? '▲' : '▼' }}</span>
        </button>
        <!-- 答案區 -->
        <div v-show="faq.open" class="faq-answer text-muted mt-2 ps-4">
          <span class="text-secondary fw-bold">A:</span> {{ faq.answer }}
        </div>
      </div>
    </div>
    </div>
    <!-- Q&A 結束後的提醒區塊 -->
    <div class="container mt-5" style="max-width: 1000px">
      <div class="reminder-box px-4 py-4 rounded-4">
        <p class="mb-3">
          🔔 <strong>提醒您</strong>，若經判定為違法之公益勸募計畫，主管機關有權要求計畫將勸募所得財物返還捐贈人。
        </p>
        <p>
          請先填寫以下基本資料，經由管理員審核身份與提案目的後，您就可以開始發起屬於您的公益專案，一起為社會帶來改變！
        </p>
        <p class="mt-4 fw-semibold">一起守護善意，也守住信任 💛</p>
        <p>
          在 Lovia，每一個提案都承載著改善世界的希望。我們希望讓這份善意更有力量，也更安心地傳遞出去。
        </p>
        <p class="text-muted mt-3 small">
          * 審核需時 1–3 個工作天，如尚有任何問題，可查看提案說明內詳細 Q&A。
        </p>
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

  const faqs = ref([
  {
    question: '公益勸募是什麼？',
    answer:
      '如果您想為弱勢族群、災害救助、社會福利等公益目標發起提案，這類行為就屬於「公益勸募」，需要依《公益勸募條例》申請許可。',
    open: false,
  },
  {
    question: '什麼是勸募字號？',
    answer:
      '通過審核後，主管機關會核發一組合法字號（例如：衛部救字第XXXXXXXXXX號），這是公開募資的重要憑證。',
    open: false,
  },
  {
    question: '為什麼要這麼做？',
    answer:
      '若未經許可即對外勸募，將可能觸法、遭主管機關裁罰，並公開違規資訊。這對於提案人與平台的信任都是一大風險。',
    open: false,
  },
  {
    question: '我有提供回饋品給贊助者，就不受《公益勸募條例》規範嗎？',
    answer:
      '不是的，根據《公益勸募條例》規範，只要文案中宣稱集資金額將使「不特定多數人」受惠，即屬「公益」範疇，不論是否有提供回饋品，均需符合規範。',
    open: false,
  },
])

const toggleFAQ = (index) => {
  faqs.value[index].open = !faqs.value[index].open
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

.faq-section {
  border-top: 1px solid #ccc;
  margin-top: 3rem;
  padding-top: 2rem;
}

.faq-question {
  background-color: #fff6f9;
  border: 1px solid #ffdbe5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: #ffeef3;
}

.faq-answer {
  font-size: 0.95rem;
  line-height: 1.6;
}

.faq-toggle-icon {
  font-size: 0.8rem;
  line-height: 1;
  padding-top: 6px;
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
  
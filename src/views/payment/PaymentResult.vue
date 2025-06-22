<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <h2 class="mb-4 fw-bold text-center">交易結果</h2>

      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-5 fs-5">🔄 資料載入中，請稍候...</div>
      <p v-if="polling && result.status !== 'paid'" class="text-muted small">
        系統正在確認付款狀態中，請稍候...
      </p>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="text-center text-danger py-5">
        ⚠️ {{ error }}
        <div class="mt-4">
          <router-link to="/" class="btn btn-outline-secondary me-2">返回首頁</router-link>
        </div>
      </div>

      <!-- 成功畫面 -->
      <div v-else>
        <!-- ATM 未付款提示 -->
        <div
          v-if="result.paymentMethod === 'ATM' && result.status !== 'paid'"
          class="bg-warning bg-opacity-25 p-4 text-center mb-4 border rounded"
        >
          <h4 class="fw-bold text-warning mb-3">⚠️ 此筆交易尚未完成付款</h4>
          <p class="mb-3">請依下列虛擬帳號資訊於期限內完成轉帳：</p>
          <p><strong>銀行代碼：</strong>{{ result.bank_code || '未提供' }}</p>
          <p><strong>虛擬帳號：</strong>{{ result.v_account || '未提供' }}</p>
          <p><strong>繳費期限：</strong>{{ result.expire_date || '未提供' }}</p>
          <p class="mt-3 text-muted">轉帳完成後，系統會自動確認付款並寄出通知。</p>
        </div>

        <!-- 已付款成功區塊 -->
        <div v-else class="bg-light p-4 text-center mb-4 border rounded">
          <h4 class="fw-bold text-success mb-3">🎉 感謝您的贊助！</h4>
          <p class="text-muted">
            一封確認信已寄送至 <strong>{{ maskedEmail }}</strong
            >，請記得查收。
          </p>
        </div>

        <!-- 付款資料 -->
        <div class="bg-body-tertiary border p-4 mb-4 rounded">
          <h5 class="fw-bold mb-3">💳 付款資訊</h5>
          <p><strong>交易編號：</strong>{{ result.transactionId || '未提供' }}</p>
          <p><strong>付款金額：</strong>NT$ {{ result.amount || '未提供' }}</p>
          <p><strong>付款時間：</strong>{{ result.paidAt || '尚未付款' }}</p>
          <p><strong>付款方式：</strong>{{ result.paymentMethod || '未提供' }}</p>
        </div>

        <!-- 贊助人資料 -->
        <div class="bg-body-tertiary border p-4 rounded">
          <h5 class="fw-bold mb-3">🙋 贊助者資訊</h5>
          <p><strong>贊助姓名：</strong>{{ result.display_name || '未提供' }}</p>
          <p><strong>電子信箱：</strong>{{ result.email || '未提供' }}</p>
          <p><strong>收件人：</strong>{{ result.recipient || '未提供' }}</p>
          <p><strong>電話：</strong>{{ result.phone || '未提供' }}</p>
          <p><strong>地址：</strong>{{ result.address || '未提供' }}</p>
          <p><strong>備註：</strong>{{ result.note || '無' }}</p>
        </div>

        <div class="text-center mt-5">
          <router-link to="/" class="btn btn-outline-secondary me-2">返回首頁</router-link>
          <router-link to="/projects/mine" class="btn btn-success">查看我的贊助</router-link>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { getDistrictByZipcode } from '@/utils/zipcodeMap'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

//  嘗試從 URL 還原 token（LINE Pay 付款後回來用）
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const tokenFromUrl = route.query.token
if (tokenFromUrl && typeof tokenFromUrl === 'string') {
  localStorage.setItem('token', tokenFromUrl)
  sessionStorage.setItem('token', tokenFromUrl)
  userStore.setToken(tokenFromUrl)
  console.log(' 從 URL 還原 token')
}

useRestoreAuth()

const orderId = route.query.orderId
const token = ref(userStore.token || '')
const loading = ref(true)
const error = ref('')
const polling = ref(false)

const result = ref({
  transactionId: '',
  amount: '',
  paidAt: '',
  paymentMethod: '',
  display_name: '',
  email: '',
  recipient: '',
  phone: '',
  address: '',
  note: '',
  status: '',
  bank_code: '',
  v_account: '',
  expire_date: '',
})

const maskedEmail = computed(() => {
  const email = result.value?.email || ''
  return email.replace(/^(.{3})(.*)(@.*)$/, (_, a, _b, c) => `${a}***${c}`)
})

onMounted(async () => {
  // 抓 URL query 參數
  const tokenFromUrl = route.query.token
  const method = route.query.method
  const transactionId = route.query.transactionId

  // [1] 還原 token
  if (tokenFromUrl && typeof tokenFromUrl === 'string') {
    localStorage.setItem('token', tokenFromUrl)
    sessionStorage.setItem('token', tokenFromUrl)
    userStore.setToken(tokenFromUrl)
    console.log(' 從 URL 還原 token 並寫入 userStore')
  }

  // [2] 呼叫 useRestoreAuth（自動處理 token + /me 資料）
  await useRestoreAuth()

  // [3] 清除 URL 中的多餘參數（避免重複觸發或外洩 token）
  if (method || transactionId || tokenFromUrl) {
    const cleanQuery = { orderId: route.query.orderId }
    router.replace({ path: '/checkout/result', query: cleanQuery })
    return
  }

  // [4] 驗證 token 與 orderId 是否存在
  token.value = userStore.token || ''
  if (!token.value) {
    error.value = '登入憑證不存在，請重新登入'
    loading.value = false
    return
  }

  if (!orderId) {
    error.value = '找不到訂單編號，請重新操作'
    loading.value = false
    return
  }

  // [5] 開始輪詢交易結果
  await pollResult()
})

// 輪詢最多 6 次
let retryCount = 0
const maxRetry = 6
const retryInterval = 5000

async function pollResult() {
  loading.value = true
  polling.value = true
  error.value = ''

  try {
    await fetchResult()

    if (result.value.status !== 'paid' && retryCount < maxRetry) {
      retryCount++
      console.log(`第 ${retryCount} 次輪詢未付款，再等 ${retryInterval / 1000} 秒...`)
      setTimeout(pollResult, retryInterval)
    } else if (result.value.status !== 'paid') {
      polling.value = false
      error.value = '付款狀態尚未確認，請稍後再試或聯繫客服'
    } else {
      polling.value = false
    }
  } catch (err) {
    console.error('輪詢付款狀態失敗:', err)
    error.value = err.message || '輪詢查詢失敗'
    polling.value = false
  } finally {
    loading.value = false
  }
}

async function fetchResult() {
  const res = await fetch(
    `https://lovia-backend-xl4e.onrender.com/api/v1/orders/${orderId}/payment/success`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error(`錯誤 ${res.status}：${res.statusText}`)
  }

  const json = await res.json()
  const data = json.data

  if (!json.status || !data) throw new Error(json.message || '查無資料')

  const zipcode = data.shipping?.zipcode?.toString()
  if (!zipcode || !getDistrictByZipcode(zipcode)) {
    error.value = '郵遞區號無效，請重新輸入'
    return
  }

  const methodMap = {
    LINE_PAY: 'LINE Pay',
    ATM: '綠界 ATM',
    Credit: '綠界信用卡',
    Credit_CreditCard: '綠界信用卡',
  }

  result.value = {
    transactionId: data.orderId,
    amount: data.amount,
    paidAt: data.paidAt,
    paymentMethod: methodMap[data.paymentMethod] || '未知方式',
    display_name: data.display_name || '匿名',
    email: data.email || '',
    recipient: data.recipient || '',
    phone: data.phone || '',
    address: data.address || '',
    note: data.note || '',
    status: 'paid',
    bank_code: data.bank_code || '',
    v_account: data.v_account || '',
    expire_date: data.expire_date || '',
  }
}
</script>

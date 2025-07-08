<!-- 交易結果頁 -->
<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <h2 class="mb-4 fw-bold text-center">交易結果</h2>

      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-5 fs-5">🔄 資料載入中，請稍候...</div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="text-center text-danger py-5">
        ⚠️ {{ error }}
        <div class="mt-4">
          <router-link to="/" class="btn btn-outline-secondary me-2">返回首頁</router-link>
        </div>
      </div>

      <!-- 已付款成功 -->
      <div
        v-else-if="result.status === 'paid'"
        class="bg-light p-4 text-center mb-4 border rounded"
      >
        <h4 class="fw-bold text-success mb-3">🎉 感謝您的贊助！</h4>
        <p class="text-muted">
          一封確認信已寄送至 <strong>{{ maskedEmail }}</strong
          >，請記得查收。
        </p>
      </div>

      <!-- 尚未付款 -->
      <div v-else class="bg-warning-subtle p-4 text-center mb-4 border rounded">
        <h4 class="fw-bold text-warning mb-3">⚠️ 尚未完成付款</h4>
        <p class="text-muted">此筆訂單尚未付款或已被取消，請重新操作。</p>
      </div>

      <!-- 付款資料 -->
      <div class="bg-body-tertiary border p-4 mb-4 rounded">
        <h5 class="fw-bold mb-3">💳 付款資訊</h5>
        <p><strong>交易編號：</strong>{{ result.transactionId || '未提供' }}</p>
        <p><strong>付款金額：</strong>NT$ {{ result.amount || '未提供' }}</p>
        <p><strong>付款時間：</strong>{{ result.paidAt || '尚未付款' }}</p>
        <p>
          <strong>付款狀態：</strong>
          <span
            :class="{
              'text-success': result.status === 'paid',
              'text-warning': result.status !== 'paid',
            }"
          >
            {{ result.status === 'paid' ? '已付款' : '尚未付款' }}
          </span>
        </p>
        <p><strong>付款方式：</strong>{{ result.paymentMethod || '未提供' }}</p>
      </div>

      <!-- 贊助人資料 -->
      <div class="bg-body-tertiary border p-4 rounded">
        <h5 class="fw-bold mb-3">🙋 贊助者資訊</h5>

        <p><strong>贊助人名稱：</strong>{{ result.display_name || '匿名' }}</p>
        <p><strong>收件人：</strong>{{ result.recipient || '未提供' }}</p>
        <p><strong>電話：</strong>{{ result.phone || '未提供' }}</p>
        <p><strong>地址：</strong>{{ result.address || '未提供' }}</p>
        <p>
          <strong>收據類型：</strong>
          <span v-if="result.receipt_type === 'email'">電子收據（寄送 Email）</span>
          <span v-else-if="result.receipt_type === 'paper'">紙本收據（郵寄地址）</span>
          <span v-else>未提供</span>
        </p>
        <p v-if="result.id_number"><strong>身份證字號：</strong>{{ maskedIdNumber }}</p>
        <p><strong>備註：</strong>{{ result.note || '無' }}</p>
      </div>

      <div class="text-center mt-5">
        <router-link to="/" class="btn btn-outline-secondary me-2">返回首頁</router-link>
        <router-link to="/user/sponsorships" class="btn btn-success">查看我的贊助</router-link>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestoreAuth } from '@/composables/useRestoreAuth'
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'

useRestoreAuth()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const orderId = route.query.orderId || ''
const transactionId = route.query.transactionId || ''

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
  receipt_type: '',
  id_number: '',
})

const maskedEmail = computed(() => {
  const email = result.value.email || ''
  return email.replace(/^(.{3})(.*)(@.*)$/, (_, a, _b, c) => `${a}***${c}`)
})

const maskedIdNumber = computed(() => {
  const id = (result.value.id_number || '').trim()
  if (id.length === 10) {
    return id.slice(0, 3) + '****' + id.slice(-1)
  }
  return id
})

const displayPaidTime = computed(() => {
  return result.value.paidAt ? dayjs(result.value.paidAt).format('YYYY/MM/DD HH:mm') : '尚未付款'
})

onMounted(async () => {
  if (!orderId) {
    error.value = '找不到訂單編號，請重新操作'
    loading.value = false
    return
  }

  await fetchResult()

  // 移除 URL 中多餘的參數（如果有）
  if (route.query.transactionId) {
    router.replace({ path: '/checkout/result', query: { orderId } })
    window.history.replaceState({}, '', `/checkout/result?orderId=${orderId}`)
  }
})

async function fetchResult() {
  loading.value = true
  error.value = ''

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

    const res = await fetch(`${baseUrl}/users/orders/${orderId}/payment/success/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    })

    const json = await res.json()
    const data = json.data

    if (!json.success || !data) throw new Error(json.message || '查無資料')

    const methodMap = {
      LINE_PAY: 'LINE Pay',
      linepay: 'LINE Pay',
      webatm: 'WebATM 線上轉帳',
      WebATM: 'WebATM 線上轉帳',
      Credit: '綠界信用卡',
      credit: '綠界信用卡',
      Credit_CreditCard: '綠界信用卡',
    }

    let paymentMethod = data.paymentMethod || ''
    const mappedMethod = methodMap[paymentMethod] || paymentMethod || '未知方式'

    result.value = {
      transactionId: data.transactionId || data.orderId,
      amount: data.amount,
      paidAt: data.paidAt,
      paymentMethod: mappedMethod,
      display_name: data.display_name || '匿名',
      email: data.email || '',
      recipient: data.recipient || '',
      phone: data.phone || '',
      address: data.address || '',
      note: data.note || '',
      status: data.status || '',
      bank_code: data.bank_code || '',
      v_account: data.v_account || '',
      expire_date: data.expire_date || '',
      receipt_type: data.invoice_type || '',
      id_number: data.idNumber || '',
    }

    console.log(' 查詢成功 result:', result.value)
  } catch (err) {
    console.error(' 查詢錯誤:', err)
    error.value = err.message || '查詢失敗'
  } finally {
    loading.value = false
  }
}
</script>

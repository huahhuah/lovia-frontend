<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <section class="mb-5">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">訂單編號</label>
                <input type="text" class="form-control" :value="orderData.orderId" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">贊助金額</label>
                <input type="text" class="form-control" :value="orderData.amount" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">贊助人資料</label>
                <input type="text" class="form-control" :value="orderData.name" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">電子信箱</label>
                <input type="text" class="form-control" :value="orderData.email" disabled />
              </div>
            </div>
          </section>

          <section class="mb-5">
            <h5 class="fw-bold">確認寄送資料</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">收件人</label>
                <input type="text" class="form-control" :value="orderData.recipient" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">電話</label>
                <input type="text" class="form-control" :value="orderData.phone" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">郵遞區號</label>
                <input type="text" class="form-control" :value="orderData.zipcode" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">地址</label>
                <input type="text" class="form-control" :value="orderData.address" disabled />
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label">備註</label>
              <textarea class="form-control" rows="3" v-model="orderData.note" disabled></textarea>
            </div>
          </section>

          <p class="text-muted small">確認內容無誤後請點選右側按鈕完成付款，我們將為您處理訂單。</p>
        </div>

        <div class="col-lg-4">
          <div class="card p-4 shadow-sm">
            <h6 class="fw-bold">訂單摘要</h6>
            <p class="mb-1">專案名稱: {{ sponsorData.project_title }}</p>
            <p class="text-muted small">
              贊助方案：{{ sponsorData.feedback }}（NT$ {{ baseAmount }}）
            </p>
            <hr />
            <div class="d-flex justify-content-between">
              <span>原始金額</span>
              <span>NT$ {{ baseAmount }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>額外贊助</span>
              <span>NT$ {{ extraAmount }}</span>
            </div>
            <div class="d-flex justify-content-between fw-bold mt-2">
              <span>總計</span>
              <span>NT$ {{ orderData.amount }}</span>
            </div>
            <p class="text-muted small mt-3">備註：{{ orderData.note || '無' }}</p>
            <button
              class="btn btn-primary w-100 mt-3"
              @click="submitPayment"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '處理中...' : '立即付款' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderData = ref({})
const sponsorData = ref({ project_title: '', feedback: '' })
const baseAmount = ref(0)

const extraAmount = computed(() => {
  const total = orderData.value.amount || 0
  return total > baseAmount.value ? total - baseAmount.value : 0
})

// 錯誤跳轉方法
function redirectError(msg) {
  alert(msg + '，請重新操作')
  router.push('/checkout')
}

// 掛載時讀取 localStorage 資料
onMounted(() => {
  const raw = localStorage.getItem('checkoutOrderData')
  if (!raw) return redirectError('找不到訂單資料')

  try {
    const parsed = JSON.parse(raw)
    if (!parsed.orderId && !parsed.order_uuid) return redirectError('訂單編號遺失')
    orderData.value = parsed
    sponsorData.value.project_title = parsed.project_title || '未提供'
    sponsorData.value.feedback = parsed.feedback || '未提供'
    baseAmount.value = Number.isFinite(parsed.base_amount) ? parsed.base_amount : parsed.amount || 0
  } catch (err) {
    redirectError('訂單資料格式錯誤')
  }
})

const isSubmitting = ref(false)

// 安全處理商品名稱避免亂碼與 SHA 錯誤
function safeEncodeProductName(name) {
  if (!name || typeof name !== 'string') return 'donate_card'
  try {
    const encoded = encodeURIComponent(name)
    const base64 = btoa(decodeURIComponent(encoded))
    return base64.slice(0, 100) // 限制長度避免錯誤
  } catch (e) {
    return 'donate_card'
  }
}

// 送出付款請求
async function submitPayment() {
  isSubmitting.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) return redirectError('請先登入才能付款')

    const rawType = (orderData.value.payment || '').toLowerCase()
    const paymentType = rawType === 'card' ? 'credit' : rawType || 'credit'

    const orderId = orderData.value.order_uuid || orderData.value.orderId
    const amount = Number(orderData.value.amount) || 0
    const email = orderData.value.email?.trim() || 'test@example.com'

    // ⛑️ 安全抓取 sponsorFormData 中的 selectedPlan
    const sponsorFormDataRaw = localStorage.getItem('sponsorFormData') || '{}'
    const selectedPlan = JSON.parse(sponsorFormDataRaw)?.selectedPlan || {}

    const planName =
      selectedPlan.plan_name?.trim() || selectedPlan.feedback?.trim() || '贊助支持方案'

    const productName = safeEncodeProductName(planName)

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/users/orders/'
    const url = `${baseURL}${orderId}/payment`

    const payload = { amount, email, payment_type: paymentType, productName }

    // 根據付款方式處理
    if (paymentType === 'linepay') {
      await handleLinePayPayment(payload, token, url)
    } else {
      await handleNewebPayPayment(payload, token, url)
    }
  } catch (err) {
    console.error('付款建立失敗：', err)
    alert('付款建立失敗：\n' + (err.message || '未知錯誤'))
  } finally {
    isSubmitting.value = false
  }
}

// LINE Pay 付款處理
async function handleLinePayPayment(payload, token, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok || !json?.data?.payment_url) {
    console.error('LINE Pay 錯誤回應：', json)
    throw new Error(json?.message || 'LINE Pay 建立失敗')
  }
  window.location.href = json.data.payment_url
}

// NewebPay 藍新付款處理
async function handleNewebPayPayment(payload, token, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`藍新金流建立失敗：${res.status}`)

  const formHTML = await res.text()

  const blob = new Blob([formHTML], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  window.location.href = blobUrl
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>

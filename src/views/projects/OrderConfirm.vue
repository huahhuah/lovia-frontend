<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <div class="narrow-wrapper">
        <div class="row">
          <div class="col-lg-8">
            <section class="mb-5">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">訂單編號</label>
                  <input type="text" class="form-control" :value="orderData.order_uuid" disabled />
                </div>
                <div class="col-md-6">
                  <label class="form-label">贊助金額</label>
                  <input type="text" class="form-control" :value="orderData.amount" disabled />
                </div>
                <div class="col-md-6">
                  <label class="form-label">會員名稱</label>
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
                <textarea class="form-control" rows="3" :value="orderData.note" disabled></textarea>
              </div>
            </section>

            <p class="text-muted small">
              確認內容無誤後請點選右側按鈕完成付款，我們將為您處理訂單。
            </p>
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
                {{ isSubmitting ? '正在跳轉中...' : '立即付款' }}
              </button>
            </div>
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
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()
const router = useRouter()
const orderData = ref({})
const sponsorData = ref({ project_title: '', feedback: '' })
const baseAmount = ref(0)
const isSubmitting = ref(false)

const extraAmount = computed(() => {
  const total = orderData.value.amount || 0
  return total > baseAmount.value ? total - baseAmount.value : 0
})

function redirectError(msg) {
  alert(msg + '，請重新操作')
  router.push('/checkout')
}

onMounted(() => {
  const sessionToken = sessionStorage.getItem('token')
  const localToken = localStorage.getItem('token')
  if (!sessionToken && localToken) {
    sessionStorage.setItem('token', localToken)
    location.reload()
    return
  }

  const raw = localStorage.getItem('checkoutOrderData')
  if (!raw) return redirectError('找不到訂單資料')

  try {
    const parsed = JSON.parse(raw)
    const id = parsed.order_uuid || parsed.orderId
    if (!id || typeof id !== 'string' || id.length < 16) {
      return redirectError('訂單編號格式錯誤（請重新發起贊助）')
    }

    const selectedPlan = parsed.selectedPlan
    if (!selectedPlan || (!selectedPlan.plan_name && !selectedPlan.feedback)) {
      return redirectError('找不到贊助方案資料，請重新操作')
    }

    orderData.value = {
      orderId: id,
      order_uuid: id,
      amount: parsed.amount,
      name: parsed.name,
      email: parsed.email,
      note: parsed.note || '',
      recipient: parsed.recipient,
      phone: parsed.phone,
      zipcode: parsed.zipcode,
      address: parsed.address,
      payment: parsed.payment || 'credit',
    }
    sponsorData.value.project_title = parsed.project_title || '未提供'
    sponsorData.value.feedback = parsed.feedback || '未提供'
    baseAmount.value = Number.isFinite(parsed.base_amount) ? parsed.base_amount : parsed.amount || 0
  } catch (err) {
    console.error('checkoutOrderData 解析錯誤:', err)
    redirectError('訂單資料格式錯誤')
  }
})

async function submitPayment() {
  isSubmitting.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) return redirectError('請先登入才能付款')

    const orderId = orderData.value.order_uuid
    if (!orderId || typeof orderId !== 'string') {
      return redirectError('訂單編號格式錯誤，請重新操作')
    }

    const amount = Number(orderData.value.amount) || 0
    if (!Number.isInteger(amount) || amount <= 0) {
      return redirectError('金額不合法，請重新操作')
    }

    const email = orderData.value.email?.trim() || 'test@example.com'
    const rawType = (orderData.value.payment || '').toLowerCase()
    const paymentType = ['linepay', 'credit', 'webatm'].includes(rawType) ? rawType : 'credit'

    const sponsorFormDataRaw = localStorage.getItem('sponsorFormData') || '{}'
    const selectedPlan = JSON.parse(sponsorFormDataRaw)?.selectedPlan || {}
    const planName =
      selectedPlan.plan_name?.trim() ||
      selectedPlan.feedback?.trim() ||
      sponsorData.value.feedback?.trim() ||
      '贊助支持方案'

    const productName = planName.slice(0, 100)
    const baseURL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

    const url = `${baseURL}/users/orders/${orderId}/payment`

    const payload = {
      amount,
      email,
      payment_type: paymentType,
      productName,
    }

    if (paymentType === 'linepay') {
      await handleLinePayPayment(payload, token, url)
    } else {
      await handleEcpayPayment(payload, token, url)
    }
  } catch (err) {
    console.error(' submitPayment 錯誤:', err)
    alert('付款建立失敗：' + (err.message || '未知錯誤'))
  } finally {
    isSubmitting.value = false
  }
}

async function handleLinePayPayment(payload, token, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json()
  if (!res.ok || !result?.data?.paymentUrl) {
    console.error('LINE Pay 回傳錯誤：', result)
    throw new Error('LINE Pay 付款建立失敗')
  }

  window.location.href = result.data.paymentUrl
}

async function handleEcpayPayment(payload, token, url) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()

  if (!res.ok) throw new Error(`綠界金流建立失敗：${res.status}`)

  document.open()
  document.write(text)
  document.close()
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}
.narrow-wrapper {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.btn.btn-primary {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  color: white !important;
  border-radius: 50px !important;
  font-weight: bold;
}

.btn.btn-primary:hover {
  background-color: #e0433b !important;
  border-color: #e0433b !important;
  color: white !important;
}

.btn.btn-primary:disabled {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  opacity: 0.65;
  border-radius: 50px !important;
}
</style>

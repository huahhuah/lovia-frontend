<!-- 建立訂單(確認訂單資料) -->
<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <!-- 顯示 localStorage 儲存的訂單資訊 -->
      <div class="row">
        <!-- 左側內容區 -->
        <div class="col-lg-8">
          <!-- 訂單資訊 -->
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
                <label class="form-label">真實姓名</label>
                <input type="text" class="form-control" :value="orderData.name" disabled />
              </div>
              <div class="col-md-6">
                <label class="form-label">電子信箱</label>
                <input type="text" class="form-control" :value="orderData.email" disabled />
              </div>
            </div>
          </section>

          <!-- 寄送資料 -->
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

        <!-- 右側摘要區 -->
        <div class="col-lg-4">
          <div class="card p-4 shadow-sm">
            <h6 class="fw-bold">訂單摘要</h6>
            <p class="mb-1">專案名稱: {{ sponsorData.project_title || '專案名稱載入中' }}</p>
            <p class="text-muted small">
              贊助方案：{{ sponsorData.feedback || '方案資訊載入中' }}（NT$ {{ baseAmount }}）
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

<script setup></script>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const orderData = ref({})
const sponsorData = ref({
  project_title: '',
  feedback: '',
})

// baseAmount：回饋方案的原始金額
const baseAmount = ref(0)

// 計算額外贊助金額：總金額 - 回饋原始金額
const extraAmount = computed(() => {
  const total = orderData.value.amount || 0
  return total > baseAmount.value ? total - baseAmount.value : 0
})

onMounted(() => {
  const raw = localStorage.getItem('checkoutOrderData')
  if (!raw) {
    alert('找不到訂單資料，請重新操作')
    router.push('/checkout')
    return
  }

  try {
    const parsed = JSON.parse(raw)
    orderData.value = parsed
    sponsorData.value.project_title = parsed.project_title || '未提供'
    sponsorData.value.feedback = parsed.feedback || '未提供'
    baseAmount.value = parsed.base_amount || parsed.amount || 0
  } catch (err) {
    alert('訂單資料格式錯誤，請重新操作')
    router.push('/checkout')
  }
})

const isSubmitting = ref(false)

async function submitPayment() {
  isSubmitting.value = true

  const token = localStorage.getItem('token')

  const paymentType = (orderData.value.payment || '').toLowerCase()
  if (!paymentType) {
    alert('找不到付款方式，請回到上一頁重新選擇')
    router.push('/checkout/order')
    return
  }

  try {
    const orderId = orderData.value.order_uuid || orderData.value.orderId
    const amount = orderData.value.amount
    const email = orderData.value.email

    const requestBody = {
      amount,
      email,
    }

    if (paymentType === 'line') {
      requestBody.orderId = orderId
      requestBody.productName = sponsorData.value.feedback || 'Loveia 專案贊助'
    }
    console.log('🧾 建立付款 requestBody：', requestBody)

    let url = ''
    const baseURL = 'https://lovia-backend-xl4e.onrender.com/api/v1/users/orders/'

    if (paymentType === 'line') {
      url = `${baseURL}${orderId}/linepay`
    } else if (paymentType === 'atm') {
      url = `${baseURL}${orderId}/newebpay`
    } else {
      url = `${baseURL}${orderId}/ecpay`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`建立付款失敗，HTTP ${response.status}：${errorText}`)
    }

    const data = await response.json()

    if (paymentType === 'line') {
      // LINE Pay 使用原頁面跳轉，保留 localStorage 登入狀態
      if (!data?.data?.payment_url) {
        throw new Error('付款連結建立失敗')
      }
      window.location.href = data.data.payment_url
    } else {
      // 其他（ATM / ECPay）使用新視窗
      const paymentWindow = window.open('', '_blank')
      if (!paymentWindow) {
        alert('無法開啟付款視窗，請確認瀏覽器未封鎖彈出視窗')
        return
      }
      paymentWindow.document.open()
      paymentWindow.document.write(data)
      paymentWindow.document.close()
    }
  } catch (err) {
    console.error('付款建立失敗：', err)
    alert('付款建立失敗：' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>

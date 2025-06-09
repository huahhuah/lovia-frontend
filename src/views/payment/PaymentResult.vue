<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <h2 class="mb-4 fw-bold">交易結果</h2>

      <!-- 載入中 -->
      <div v-if="loading">🔄 載入中，請稍候...</div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="text-danger">⚠️ 錯誤：{{ error }}</div>

      <!-- 成功畫面 -->
      <div v-else>
        <div class="bg-light p-4 text-center mb-4 border">
          <h4 class="fw-bold text-success">🎉 恭喜！您的贊助付款已完成！</h4>
          <p class="text-muted">
            確認信已寄出至 <strong>{{ maskedEmail }}</strong>
          </p>
        </div>

        <!-- 付款資料 -->
        <div class="bg-body-tertiary border p-4 mb-4">
          <h5 class="fw-bold mb-3">付款資料</h5>
          <p><strong>交易編號：</strong>{{ result.transactionId || '未提供' }}</p>
          <p><strong>付款金額：</strong>NT$ {{ result.amount || '未提供' }}</p>
          <p><strong>付款時間：</strong>{{ result.paidAt || '未提供' }}</p>
          <p><strong>付款方式：</strong>{{ result.paymentMethod || '未提供' }}</p>
        </div>

        <!-- 贊助人資料 -->
        <div class="bg-body-tertiary border p-4">
          <h5 class="fw-bold mb-3">贊助者資料</h5>
          <p><strong>贊助姓名：</strong>{{ result.display_name || '未提供' }}</p>
          <p><strong>電子信箱：</strong>{{ result.email || '未提供' }}</p>
          <p><strong>收件人：</strong>{{ result.recipient || '未提供' }}</p>
          <p><strong>電話：</strong>{{ result.phone || '未提供' }}</p>
          <p><strong>地址：</strong>{{ result.address || '未提供' }}</p>
          <p><strong>備註：</strong>{{ result.note || '無' }}</p>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 預設結果欄位，避免 undefined 報錯
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
})

const loading = ref(true)
const error = ref('')

watchEffect(async () => {
  const orderId = route.query.orderId?.toString().trim()
  if (!orderId) {
    error.value = '找不到訂單編號'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch(
      `https://lovia-backend-xl4e.onrender.com/api/v1/users/orders/${orderId}/payment/success`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    const json = await res.json()
    console.log(' 付款成功資料：', json)
    if (!json.status || !json.data) throw new Error(json.message || '查無資料')

    result.value = json.data
  } catch (err) {
    console.error(' 付款資料取得失敗:', err)
    error.value = err.message || '查詢付款結果失敗'
  } finally {
    loading.value = false
  }
})

const maskedEmail = computed(() => {
  const email = result.value?.email || ''
  return email.replace(/^(.{3})(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`)
})
</script>

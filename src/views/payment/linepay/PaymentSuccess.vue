<template>
  <div class="container py-5">
    <h2 class="mb-4 text-success">🎉 付款結果</h2>

    <div v-if="loading" class="text-muted">載入中...</div>
    <div v-else-if="error" class="text-danger">⚠️ {{ error }}</div>

    <div v-else>
      <p><strong>訂單編號：</strong>{{ result.orderId }}</p>
      <p><strong>交易編號：</strong>{{ result.transactionId }}</p>
      <p><strong>付款金額：</strong>NT$ {{ result.amount }}</p>
      <p><strong>付款方式：</strong>{{ result.paymentMethod }}</p>
      <p><strong>交易時間：</strong>{{ formatDate(result.paidAt) }}</p>
      <p
        class="fw-bold"
        :class="result.transactionStatus === 'paid' ? 'text-success' : 'text-warning'"
      >
        <strong>交易狀態：</strong>{{ translateStatus(result.transactionStatus) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth'

const userStore = useUserStore()
const result = ref(null)
const loading = ref(true)
const error = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return '未知時間'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW')
}

function translateStatus(status) {
  switch (status) {
    case 'paid':
      return '付款完成'
    case 'pending':
      return '等待付款'
    case 'cancelled':
      return '付款已取消'
    default:
      return status
  }
}

onMounted(async () => {
  const hashQuery = window.location.hash.split('?')[1]
  const params = new URLSearchParams(hashQuery)
  const transactionId = params.get('transactionId')
  const orderId = params.get('orderId')

  if (!transactionId || !orderId) {
    error.value = '找不到交易資訊，請確認網址正確'
    loading.value = false
    return
  }

  // 還原登入狀態
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await axios.get('https://lovia-backend-xl4e.onrender.com/api/v1/users/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.status === 'success') {
        userStore.setUser(res.data.data)
      }
    } catch (err) {
      console.warn('⚠️ 無法還原登入狀態：', err)
    }
  }

  // 嘗試輪詢確認付款結果（最多等 10 秒）
  try {
    let attempts = 5
    while (attempts-- > 0) {
      const res = await axios.post(
        'https://lovia-backend-xl4e.onrender.com/api/v1/payments/linepay/confirm',
        { transactionId, orderId }
      )
      const info = res.data.info
      if (info.transactionStatus === 'paid') {
        result.value = info
        break
      } else {
        result.value = info
        await new Promise((r) => setTimeout(r, 2000))
      }
    }
  } catch (err) {
    console.error('確認交易失敗', err)
    error.value = '交易確認失敗，請聯絡客服'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-warning {
  color: #ffc107;
}
</style>

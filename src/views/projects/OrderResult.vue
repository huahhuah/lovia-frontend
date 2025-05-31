<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <!-- 頁面標題 -->
      <h3 class="fw-bold mb-4 text-center">交易結果</h3>

      <!-- 成功提示 -->
      <div class="alert alert-success text-center" v-if="order && order.status === 'paid'">
        <h5 class="fw-bold mb-2">恭喜！您的贊助付款已經完成了！</h5>
        <p class="mb-0 text-muted">
          稍後您將會收到一次付款成功確認信，付款狀明細將寄至 {{ order.email || '您提供的信箱' }}
        </p>
      </div>

      <!-- 錯誤或載入中 -->
      <div v-else-if="loading" class="text-center text-muted">查詢中，請稍候...</div>
      <div v-else-if="!order" class="text-center text-danger">查無訂單，請確認連結是否正確。</div>

      <!-- 資料區塊 -->
      <div v-else class="card p-4 mt-4 bg-light-subtle">
        <!-- 付款資料 -->
        <h5 class="fw-bold border-bottom pb-2 mb-3">付款資料</h5>
        <p><strong>交易編號：</strong>{{ order.order_uuid }}</p>
        <p><strong>付款金額：</strong>NT${{ order.amount }}</p>
        <p><strong>日期：</strong>{{ formatDate(order.created_at) }}</p>

        <!-- 贊助者資料 -->
        <h5 class="fw-bold border-bottom pb-2 mt-4 mb-3">贊助者資料</h5>
        <p><strong>貴賓姓名：</strong>{{ order.display_name || '匿名' }}</p>
        <p><strong>電子信箱：</strong>{{ order.email || '無' }}</p>
        <p><strong>收件人：</strong>{{ order.shipping?.name || '無' }}</p>
        <p><strong>收件電話：</strong>{{ order.shipping?.phone || '無' }}</p>
        <p><strong>收件地址：</strong>{{ order.shipping?.address || '無' }}</p>
        <p><strong>備註：</strong>{{ order.note || '無' }}</p>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '@/api/project'
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'

const route = useRoute()
const orderId = route.query.order
const order = ref(null)
const loading = ref(true)

onMounted(async () => {
  if (!orderId) {
    loading.value = false
    return
  }

  try {
    const res = await getOrderById(orderId)
    order.value = res.data
  } catch (err) {
    console.error(' 查詢訂單失敗', err)
  } finally {
    loading.value = false
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
  background-color: #f8f9fa;
}
</style>

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
            <button class="btn btn-primary w-100 mt-3" @click="goToResult">立即付款</button>
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

  const parsed = JSON.parse(raw)

  // 套入訂單資料
  orderData.value = parsed

  // 套入專案摘要資料
  sponsorData.value.project_title = parsed.project_title || '未提供'
  sponsorData.value.feedback = parsed.feedback || '未提供'

  // 若 base_amount 有設定就使用，否則 fallback 為總金額
  baseAmount.value = parsed.base_amount || parsed.amount || 0
})

function goToResult() {
  // 後續可串接金流邏輯，目前先跳轉完成頁面
  router.push('/order-result')
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>

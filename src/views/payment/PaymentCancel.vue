<template>
  <div class="cancel-wrapper container py-5">
    <div class="narrow-wrapper">
      <h2 class="mb-4 mt-5 fw-bold text-center">交易取消</h2>

      <div class="card text-center p-5">
        <h4 class="fw-bold text-danger">您已取消本次贊助付款</h4>
        <p class="text-muted mt-2">若您是誤操作，可重新回到訂單頁再次發起付款。</p>

        <!-- 顯示訂單編號 -->
        <p v-if="orderId" class="text-muted">訂單編號：{{ orderId }}</p>

        <!-- 回到贊助確認頁 -->
        <RouterLink class="btn btn-outline-secondary mt-3" to="/checkout">
          返回贊助確認頁
        </RouterLink>

        <!-- 回到該訂單確認頁 -->
        <RouterLink
          v-if="orderId"
          :to="`/checkout/confirm?orderId=${orderId}`"
          class="btn btn-primary mt-3 ms-2"
        >
          回到訂單確認頁
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.query?.orderId
</script>

<style scoped>
.narrow-wrapper {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card h4 {
  white-space: nowrap;
}

.card {
  background-color: #fffaf8;
  border-radius: 1rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.03);
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
.btn-outline-secondary {
  border-color: #fc5b53 !important;
  color: #fc5b53 !important;
  border-radius: 50px !important;
  font-weight: bold;
  background-color: transparent !important;
}

.btn-outline-secondary:hover {
  background-color: #ffe1d9 !important;
  border-color: #e0433b !important;
  color: #e0433b !important;
}
</style>

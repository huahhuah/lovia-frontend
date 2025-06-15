<template>
  <div class="container py-5">
    <h2 class="mb-4 fw-bold">交易取消</h2>

    <div class="bg-light p-4 text-center border">
      <h4 class="fw-bold text-danger">您已取消本次贊助付款</h4>
      <p class="text-muted mt-2">若您是誤操作，可重新回到訂單頁再次發起付款。</p>

      <!-- 顯示訂單編號 -->
      <p v-if="orderId" class="text-muted">訂單編號：{{ orderId }}</p>

      <!-- 回到贊助確認頁 -->
      <RouterLink class="btn btn-outline-primary mt-3" to="/checkout">返回贊助確認頁</RouterLink>

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
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.query?.orderId
</script>

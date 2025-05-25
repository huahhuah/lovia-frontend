<template>
  <div class="sponsorship-layout">
    <SponsorshipStepper :currentStep="currentStep" />
    <main class="container py-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import SponsorshipStepper from '@/components/SponsorshipStepper.vue'

// 根據路由判斷目前是哪個步驟
const route = useRoute()

const stepMap = {
  '/checkout': 0,
  '/checkout/order': 1,
  '/checkout/confirm': 2,
  '/checkout/result': 3,
}

const currentStep = stepMap[route.path] ?? 0
</script>

<style scoped>
.sponsorship-layout {
  background: #f8f9fa;
  min-height: 100vh;
  padding-top: 100px;
}
</style>

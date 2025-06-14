<template>
  <nav class="stepper d-flex justify-content-between mb-5">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step flex-fill text-center"
      :class="{ active: currentStep === index }"
      @click="goToStep(step)"
      style="cursor: pointer"
    >
      {{ step.label }}
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  currentStep: Number, // 目前步驟 index
})

const router = useRouter()

const steps = [
  { label: '① 贊助專案確認', path: '/checkout' },
  { label: '② 訂單填寫資料', path: '/checkout/order' },
  { label: '③ 確認訂單資料', path: '/checkout/confirm' },
  { label: '④ 交易結果', path: '/checkout/result' },
]

function goToStep(step) {
  if (step.path) {
    router.push(step.path)
  }
}
</script>

<style scoped>
.step {
  padding: 3rem 1rem;
  border-bottom: 2px solid transparent;
  font-weight: bold;
  color: #888;
  font-size: 25px;
  background-color: #ffedf2;
}
.step.active {
  border-color: #e1141b;
  color: #e1141b;
  background-color: #ffd2cf;
}
</style>

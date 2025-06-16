<template>
  <nav class="stepper d-flex justify-content-between mb-5">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="step flex-fill text-center"
      :class="{ active: currentStep === index, disabled: index < currentStep }"
      @click="goToStep(step)"
      :style="{ cursor: index < currentStep ? 'not-allowed' : 'pointer' }"
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
  const targetIndex = steps.findIndex((s) => s.path === step.path)

  // 如果要前往比目前 index 更小（往回），則不允許
  if (targetIndex < props.currentStep) {
    alert('您無法返回先前步驟，請依序完成流程。')
    return
  }

  // 否則允許切換（等於或往前）
  router.push(step.path)
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

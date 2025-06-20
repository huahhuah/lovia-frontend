<template>
  <div class="stepper-wrapper mx-auto mb-">
    <nav class="checkout-steps d-flex justify-content-between align-items-start">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item text-center flex-fill"
        :class="{ active: currentStep === index, completed: index < currentStep }"
        @click="goToStep(step)"
      >
        <div class="circle mb-1">{{ index + 1 }}</div>
        <div class="label">{{ step.label }}</div>
        <div v-if="index !== steps.length - 1" class="line"></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  currentStep: Number, // 目前步驟 index
})

const router = useRouter()

const steps = [
  { label: '贊助專案確認', path: '/checkout' },
  { label: '訂單填寫資料', path: '/checkout/order' },
  { label: '確認訂單資料', path: '/checkout/confirm' },
  { label: '交易結果', path: '/checkout/result' },
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
.checkout-steps {
  position: relative;
}

.step-item {
  position: relative;
  cursor: pointer;
}
.step-item.completed .circle {
  background-color: #e1141b;
  color: white;
}
.step-item.active .circle {
  background-color: #ffd2cf;
  color: #e1141b;
  border: 2px solid #e1141b;
}
.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ccc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto;
}
.label {
  font-size: 14px;
  color: #888;
}
.step-item.active .label {
  color: #e1141b;
}
.line {
  position: absolute;
  top: 18px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #ddd;
  z-index: -1;
}
.step-item:last-child .line {
  display: none;
}

.stepper-wrapper {
  max-width: 800px;
}

.checkout-steps {
  gap: 10px;
}

.step-item {
  position: relative;
  flex: 1;
  min-width: 60px;
  cursor: pointer;
}
.step-item.completed .circle {
  background-color: #e1141b;
  color: white;
}
.step-item.active .circle {
  background-color: #ffd2cf;
  color: #e1141b;
  border: 2px solid #e1141b;
}
.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto;
  font-size: 14px;
}
.label {
  font-size: 14px;
  color: #888;
  white-space: nowrap;
}
.step-item.active .label {
  color: #e1141b;
}
.line {
  position: absolute;
  top: 16px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #ddd;
  z-index: -1;
}
.step-item:last-child .line {
  display: none;
}
</style>

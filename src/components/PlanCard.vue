<template>
  <div class="plan-card rounded-4 p-4 mb-4 shadow-sm">
    <!-- 標題 -->
    <h6 class="fw-bold mb-2 text-dark">{{ plan.plan_name }}</h6>

    <!-- 價格獨立一行 -->
    <p class="text-danger fw-bold fs-5 mb-2">NT$ {{ plan.amount }}</p>

    <!-- 贊助人數 icon + 數字 -->
    <div class="d-flex align-items-center text-secondary small mb-3">
      <img
        src="@/assets/icons/group.svg"
        alt="人 icon"
        class="me-1"
        style="width: 16px; height: 16px"
      />
      {{ plan.quantity }} 人數限制
    </div>

    <!-- 圖片 -->
    <img
      :src="imgSrc"
      class="rounded w-100 mb-3"
      style="height: 180px; object-fit: cover"
      alt="回饋圖片"
    />

    <!-- 回饋說明 -->
    <p class="small text-muted" style="white-space: pre-line">
      {{ plan.feedback }}
    </p>

    <!-- 贊助按鈕 -->
    <button class="btn btn-danger w-100 mt-3 fw-bold rounded-pill py-2" @click="handleSponsor">
      立即贊助
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import defaultImg from '@/assets/images/default.png'

const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['sponsor'])

function handleSponsor() {
  emit('sponsor', props.plan.plan_id)
}

// fallback 圖片處理
const imgSrc = ref(defaultImg)

onMounted(() => {
  const testImg = new Image()
  testImg.src = props.plan.feedback_img
  testImg.onload = () => {
    imgSrc.value = props.plan.feedback_img
  }
  testImg.onerror = () => {
    imgSrc.value = defaultImg
  }
})
</script>

<style scoped>
.plan-card {
  background-color: #fff5f5;
}
</style>

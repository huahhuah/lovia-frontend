<template>
  <div
    class="plan-card rounded-4 px-2 py-4 mb-4 shadow-sm border"
    :class="{ 'opacity-50': type === '歷年專案' }"
  >
    <!-- 標題 -->
    <h6 class="fw-bold mb-2 text-dark">{{ plan.plan_name }}</h6>

    <!-- 價格 + 贊助人數 -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <p class="fw-bold text-dark fs-5 mb-0">NT$ {{ plan.amount }}</p>
      <div class="d-flex align-items-center small fw-bold">
        <img
          src="@/assets/icons/group.svg"
          alt="人 icon"
          class="me-1"
          style="width: 16px; height: 16px"
        />
        <span style="color: #fd7269">{{ plan.sponsor_count || 0 }}</span>
        <span style="color: #000"> 人已贊助</span>
      </div>
    </div>

    <!-- 圖片 -->
    <img
      :src="imgSrc"
      class="rounded-4 w-100 mb-3"
      style="height: 180px; object-fit: cover"
      alt="回饋圖片"
    />

    <!-- 回饋說明 + gift icon -->
    <div class="d-flex align-items-start gap-2">
      <img src="/gift.png" alt="gift icon" style="width: 16px; height: 16px; margin-top: 2px" />
      <p class="small text-muted mb-0" style="white-space: pre-line">
        {{ plan.feedback }}
      </p>
    </div>

    <!-- 贊助按鈕 -->
    <button
      class="btn w-100 mt-3 fw-bold rounded-pill py-2 text-white"
      style="background-color: #fc5b53"
      @click="handleSponsor"
      :disabled="type === '歷年專案'"
      :title="type === '歷年專案' ? '此為歷年專案，無法再贊助' : '立即贊助此方案'"
    >
      {{ type === '歷年專案' ? '無法贊助' : '立即贊助 >' }}
    </button>
    <!-- 額外提示 -->
    <p v-if="type === '歷年專案'" class="mt-2 text-center text-muted small">
      此為歷年專案，僅供瀏覽，無法再贊助
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import defaultImg from '@/assets/images/default.png'

const router = useRouter()

const props = defineProps({
  plan: Object,
  projectId: [String, Number],
  projectType: String,
})

//  預設為「募資中」避免空字串造成誤判
const type = props.projectType?.trim?.() || '募資中'

const imgSrc = ref(defaultImg)

onMounted(() => {
  const testImg = new Image()
  testImg.src = props.plan.feedback_img
  testImg.onload = () => (imgSrc.value = props.plan.feedback_img)
  testImg.onerror = () => (imgSrc.value = defaultImg)
})

function handleSponsor() {
  //  僅當 type === '歷年專案' 時擋下
  if (type === '歷年專案') {
    console.warn(' 無法贊助：該專案為歷年專案', type)
    alert('此為歷年專案，無法贊助')
    return
  }

  const numericProjectId = Number(props.projectId)
  const planId = Number(props.plan.plan_id)

  if (isNaN(numericProjectId) || isNaN(planId)) {
    console.error(' 無效參數', { projectId: props.projectId, planId })
    return
  }

  console.log(' 導頁參數：', { projectId: numericProjectId, planId })

  router.push({
    name: 'SponsorshipConfirm',
    query: {
      projectId: numericProjectId,
      planId,
    },
  })
}
</script>

<style scoped>
.plan-card {
  background-color: transparent;
  border: 1px solid #fd7269 !important; /*  強制紅色外框 */
}
.plan-card.opacity-50 .btn {
  pointer-events: none;
}
button:disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>

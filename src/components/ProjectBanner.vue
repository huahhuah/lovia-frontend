<template>
  <div
    class="project-banner p-4 mb-4 rounded-4 d-flex flex-column flex-lg-row align-items-start"
    style="background: linear-gradient(90deg, #fff5f7, #fff9f5)"
  >
    <!-- 左圖 + 分類 -->
    <div
      class="position-relative w-100 w-lg-50 mb-3 mb-lg-0"
      style="max-width: 500px; overflow: hidden"
    >
      <img
        :src="imgSrc"
        @error="onImageError"
        class="rounded-3 w-100"
        style="object-fit: cover"
        alt="project cover"
      />

      <!-- 分類圖示與名稱（固定左上角） -->
      <div
        v-if="project?.category_img"
        class="position-absolute"
        style="
          top: 12px;
          left: 12px;
          background-color: rgba(0, 0, 0, 0);
          padding: 2px 6px;
          border-radius: 8px;
          z-index: 10;
        "
      >
        <img :src="project.category_img" alt="分類圖" style="height: 16px; width: auto" />
      </div>
    </div>

    <!-- 右卡片 -->
    <div class="bg-white rounded-4 shadow-sm p-4 flex-grow-1 ms-lg-4 w-100">
      <h5 class="fw-bold mb-2">{{ project?.title || '未命名提案' }}</h5>

      <div class="d-flex align-items-center gap-2 mb-2">
        <img src="@/assets/icons/group.svg" alt="人 icon" style="width: 20px; height: 20px" />
        <span class="badge bg-light text-secondary fw-normal px-2 py-1">
          {{ project?.project_team || '提案者' }}
        </span>
      </div>

      <p class="text-muted small mb-3">{{ project?.summary || '尚無摘要' }}</p>

      <div class="d-flex align-items-center gap-3 text-secondary small mb-1">
        <img src="@/assets/icons/vector.svg" alt="時鐘" style="width: 16px; height: 16px" />
        倒數 {{ remainingDays }} 天

        <img
          src="@/assets/icons/group.svg"
          class="ms-3"
          alt="人"
          style="width: 16px; height: 16px"
        />
        {{ project?.supporters ?? 0 }} 人已贊助

        <span class="ms-auto text-danger fw-bold">{{ project?.progress_percent ?? 0 }}%</span>
      </div>

      <div class="progress rounded-pill" style="height: 8px">
        <div
          class="progress-bar bg-danger"
          :style="{ width: (project?.progress_percent ?? 0) + '%' }"
        ></div>
      </div>

      <p class="mt-3 fw-bold fs-5 text-danger mb-1">
        NT$
        {{
          typeof project?.current_amount === 'number'
            ? project.current_amount.toLocaleString()
            : '尚無資料'
        }}
        <small class="text-muted fs-6">
          ／目標 NT$
          {{
            typeof project?.total_amount === 'number'
              ? project.total_amount.toLocaleString()
              : '未設定'
          }}
        </small>
      </p>

      <p class="text-secondary small mb-3">
        募資期間：{{ project?.start_time }} ~ {{ project?.end_time }}
      </p>

      <div class="d-flex justify-content-between align-items-center gap-2 mt-2">
        <button
          class="border-0 bg-transparent rounded-circle p-2"
          @click="handleToggleFavorite"
          :style="{ backgroundColor: isFavorited ? '#ffe6e9' : '#fff0f2' }"
        >
          <img :src="favoriteIcon" alt="收藏" style="width: 24px; height: 24px" />
        </button>

        <button
          class="btn btn-danger rounded-pill flex-grow-1 py-2 fw-bold shadow-sm"
          @click="$emit('scrollToSponsor')"
        >
          立即贊助
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { toggleFavorite as toggleFavoriteAPI } from '@/api/user'
import { useRoute } from 'vue-router'

const emit = defineEmits(['scrollToSponsor'])
const route = useRoute()
const isFavorited = ref(false)

const props = defineProps({
  project: Object,
})

// 封面 fallback
const imgSrc = ref('')
watchEffect(() => {
  imgSrc.value = props.project?.cover || '/images/default.jpg'
  isFavorited.value = !!props.project?.follow
})
function onImageError(e) {
  e.target.src = '/images/default.jpg'
}

// 收藏邏輯
const projectId = parseInt(route.params.id)
const favoriteIcon = computed(() =>
  isFavorited.value
    ? new URL('@/assets/icons/heart-clicked.svg', import.meta.url).href
    : new URL('@/assets/icons/heart-default.svg', import.meta.url).href
)
async function handleToggleFavorite() {
  const token = localStorage.getItem('token')
  if (!token) {
    return alert('登入後才能收藏')
  }
  try {
    const res = await toggleFavoriteAPI(projectId, token)
    alert(res.data.message)
    isFavorited.value = res.data.follow
  } catch (err) {
    console.error ('收藏失敗', err)
  }
}

// 倒數天數
const remainingDays = computed(() => {
  const end = props.project?.end_time ? new Date(props.project.end_time) : null
  if (!end || isNaN(end)) return '？'
  const now = new Date()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})
</script>

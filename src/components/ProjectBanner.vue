<template>
  <div class="project-banner d-flex flex-column flex-lg-row align-items-start mb-4">
    <!-- 左：圖片區（8/12） -->
    <div class="position-relative mb-3 mb-lg-0 banner-image-container col-12 col-lg-8">
      <img
        :src="imgSrc"
        @error="onImageError"
        class="w-100 rounded-3 project-banner-img"
        alt="project cover"
      />

      <!-- 分類圖示 -->
      <div
        v-if="project?.category_img"
        class="position-absolute"
        style="top: 12px; left: 12px; z-index: 10"
      >
        <img :src="project.category_img" alt="分類圖" style="height: 25px" />
      </div>
    </div>

    <!-- 右：資訊區（4/12） -->
    <div class="info-area d-flex flex-column justify-content-between ms-lg-4 col-12 col-lg-4">
      <!-- 上：標題／團隊／簡介 -->
      <div class="info-area-top">
       <div class="d-flex justify-content-between align-items-start mb-2">
         <h5 class="fw-bold mb-0">{{ project?.title || '未命名提案' }}</h5>

         <!-- 手機版收藏按鈕 -->
         <button
          class="border-0 bg-transparent rounded-circle d-lg-none ms-2"
          @click="handleToggleFavorite"
          :style="{ backgroundColor: isFavorited ? '#ffe6e9' : '#fff0f2' }"
         >
            <img :src="favoriteIcon" alt="收藏" style="width: 38px; height: 38px" />
          </button>
        </div>

        <div class="d-flex align-items-center gap-2 mb-2">
          <img src="/協會.png" alt="人 icon" style="width: 20px" />
          <span class="badge bg-light text-secondary fw-normal px-2 py-1">
            {{ project?.project_team || '提案者' }}
          </span>
        </div>

        <p class="text-muted small summary-text">
          {{ project?.summary || '尚無摘要' }}
        </p>
      </div>

      <!-- 下：贊助進度與按鈕 -->
      <div class="info-area-content mt-3">
        <div class="d-flex align-items-center text-secondary small mb-1 gap-3">
          <div class="d-flex align-items-center gap-1">
            <img src="@/assets/icons/vector.svg" alt="時鐘" style="width: 16px" />
            <span class="fw-bold text-dark">
              倒數 <span style="color: #FD7269" class="fw-bold">{{ remainingDays }}</span> 天
            </span>
          </div>

          <div class="d-flex align-items-center gap-1">
            <img src="@/assets/icons/group.svg" alt="人" style="width: 16px" />
            <span class="fw-bold text-dark">
              <span style="color: #FD7269" class="fw-bold">{{ project?.supporters ?? 0 }}</span> 人已贊助
            </span>
          </div>

          <span class="ms-auto fw-bold" style="color: #FD7269">
            {{ project?.progress_percent ?? 0 }}%
          </span>
        </div>

        <div class="progress rounded-pill mb-2" style="height: 8px">
          <div
            class="progress-bar"
            :style="{ width: (project?.progress_percent ?? 0) + '%',
            backgroundImage: 'linear-gradient(to right, #fc7c9d, #ffc443)'
          }"
         ></div>
        </div>

        <p class="fw-bold fs-5 text-dark mb-1">
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
          募資期間：{{ formatDate(project?.start_time) }} ~ {{ formatDate(project?.end_time) }}
        </p>

        <div 
        class="d-none d-lg-flex align-items-center gap-2 mt-2"
        :class="{ 'justify-content-end': isMobile }"
        >
          <button
            class="border-0 bg-transparent rounded-circle p-2"
            @click="handleToggleFavorite"
            :style="{ backgroundColor: isFavorited ? '#ffe6e9' : '#fff0f2' }"
          >
            <img :src="favoriteIcon" alt="收藏" style="width: 38px; height: 38px" />
          </button>

          <button
            v-if="!isMobile"
            class="btn rounded-pill flex-grow-1 py-2 fw-bold shadow-sm text-white"
            style="background-color: #FC5B53"
            @click="$emit('scrollToSponsor')"
          >
            立刻贊助 >>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- ✅ 手機版底部固定按鈕區 -->
  <div class="mobile-bottom-bar d-lg-none">
    <div class="container d-flex justify-content-between align-items-center gap-2 py-2">
      <button
        class="border-0 bg-transparent rounded-circle p-2"
        @click="handleToggleFavorite"
        :style="{ backgroundColor: isFavorited ? '#ffe6e9' : '#fff0f2' }"
      >
        <img :src="favoriteIcon" alt="收藏" style="width: 38px; height: 38px" />
      </button>

      <button
        class="btn rounded-pill flex-grow-1 py-2 fw-bold shadow-sm text-white"
        style="background-color: #FC5B53"
        @click="$emit('scrollToSponsor')"
      >
        立刻贊助 >>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { toggleFavorite as toggleFavoriteAPI } from '@/api/user'
import { useRoute } from 'vue-router'

const emit = defineEmits(['scrollToSponsor'])
const route = useRoute()
const props = defineProps({
  project: Object,
})
const imgSrc = ref('')
const isFavorited = ref(false)

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
    console.error('收藏失敗', err)
  }
}

const remainingDays = computed(() => {
  const end = props.project?.end_time ? new Date(props.project.end_time) : null
  if (!end || isNaN(end)) return '？'
  const now = new Date()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

function formatDate(dateStr) {
  if (!dateStr) return '未設定'
  const date = new Date(dateStr)
  if (isNaN(date)) return '未設定'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

const isMobile = window.innerWidth < 992
</script>

<style>
.project-banner {
  margin-top: -40px; 
}

.project-banner-img {
  object-fit: cover;
  height: auto;
  aspect-ratio: 16 / 9;
}

.banner-image-container {
  width: 66.666%;
  overflow: hidden;
}

.info-area {
  width: 33.333%;
}

/* 桌機版固定高度兩行顯示 */
@media (min-width: 992px) {
  .summary-text {
    min-height: 4rem;
    max-height: 4rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
  }
}

@media (max-width: 991.98px) {
  .project-banner {
    flex-direction: column !important;
  }

  .banner-image-container,
  .info-area {
    width: 100% !important;
    margin-left: 0 !important;
  }

  .summary-text {
    min-height: auto;
    max-height: none;
    margin-bottom: 0.75rem;
    overflow: visible;
    display: block;
  }

  .info-area-top {
    margin-bottom: 0.5rem;
  }

  .info-area-content {
    padding-top: 0.5rem;
    margin-top: 0;
    padding-bottom: 0.5rem !important; /* ✅ 保留按鈕空間但不太大 */
    margin-bottom: 0 !important;     /* ✅ 去掉與下方的空白 */
  }

  .progress {
    height: 6px;
  }

  .project-banner .btn {
    font-size: 14px;
  }
}

@media (min-width: 992px) {
  .project-banner {
    align-items: stretch; /* 左右對齊高 */
  }

  .banner-image-container,
  .info-area {
    min-height: 420px;
  }

  .info-area {
    justify-content: space-between; /* 上下貼齊 */
  }

  .info-area-content {
    margin-top: auto;
  }
}
/* 手機版底部固定 bar */
.mobile-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-image: linear-gradient(to right, #FFEDF2, #FFF6E3);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

</style>
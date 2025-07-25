<template>
  <section class="funding-section text-center position-relative custom-section3-spacing">
    <!-- 背景裝飾圖 -->
    <img src="/homepageS3-bg.png" alt="bg1" class="section3-bg1" />
    <img src="/homepageS3-bg2.png" alt="bg2" class="section3-bg2" />
    <img src="/homepageS3-illustration.png" alt="illustration" class="section3-illustration" />

    <!-- 載入中 -->
    <div v-if="isLoading">載入中...</div>

    <!-- 有資料 -->
    <div v-else-if="visibleCards.length > 0">
      <h2 class="section-title text-danger fs-4 fw-bold mb-5">長期贊助</h2>
      <div class="container" style="padding-left: 10rem; padding-right: 10rem">
        <!-- 桌機版卡片 -->
        <div class="row justify-content-center g-4 d-none d-xl-flex">
          <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
            <ProjectCard
              :project="card"
              :is-archived="card.status === '已結束'"
              :isFollowed="card.is_followed"
              @toggle-follow="onToggleFollow"
            />
          </div>
        </div>

        <!-- 手機版 -->
        <div class="project-scroll-wrapper d-xl-none" ref="scrollContainer" @scroll="onScroll">
          <div class="project-scroll">
            <div class="card-wrapper" v-for="(card, index) in visibleCards" :key="'mobile-' + index">
              <ProjectCard
                :project="card"
                :is-archived="card.status === '已結束'"
                :isFollowed="card.is_followed"
                @toggle-follow="onToggleFollow"
              />
            </div>
          </div>
        </div>

        <!-- 手機版圓點 -->
        <div class="dot-indicator d-md-none">
          <span
            v-for="(card, index) in visibleCards.slice(0, 5)"
            :key="'dot-' + index"
            class="dot"
            :class="{ active: currentIndex === index }"
          ></span>
        </div>
      </div>

        <!-- 平板專用的左右箭頭按鈕（768px–1199px） -->
        <div class="arrow-nav d-none d-md-flex d-xl-none justify-content-center gap-4 mt-3">
          <button @click="scrollLeft" class="arrow-btn">&lt;</button>
          <button @click="scrollRight" class="arrow-btn">&gt;</button>
        </div>

      <!-- 查看更多 -->
      <div class="text-center mt-4" v-if="longTermProjects.length > 3">
        <button class="btn btn-outline-danger rounded-pill mt-4" @click="showAll = !showAll">
          {{ showAll ? '收起' : '查看更多' }}
        </button>
      </div>
    </div>

    <!-- 無資料 -->
    <div v-else class="text-muted my-5">(尚無長期贊助資料)</div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProjects } from '@/api/project'
import ProjectCard from '@/components/ProjectCard.vue'

const isLoading = ref(true)
const longTermProjects = ref([])
const showAll = ref(false)

onMounted(async () => {
  try {
    const params = {
      page: 1,
      per_page: 6,
      filter: 'long',
      sort: 'newest',
    }

    const res = await getAllProjects(params)
    console.log('📦 長期贊助 API 回傳：', res.data)

    if (res.data?.status && Array.isArray(res.data.data)) {
      // 加工處理每個卡片項目，補上倒數天數與格式化
      longTermProjects.value = res.data.data.map((p) => {
        const daysLeft = Math.max(
          0,
          Math.ceil((new Date(p.end_time) - new Date()) / (1000 * 60 * 60 * 24))
        )
        const percentage = p.total_amount === 0 ? 0 : (p.amount / p.total_amount) * 100
        return {
          ...p,
          daysLeft,
          percentage: parseFloat(percentage.toFixed(2)),
        }
      })
    } else {
      console.warn('沒有符合條件的長期贊助資料')
    }
  } catch (err) {
    console.error('取得長期贊助資料失敗:', err)
  } finally {
    isLoading.value = false
  }
})

const visibleCards = computed(() =>
  showAll.value ? longTermProjects.value : longTermProjects.value.slice(0, 3)
)

function onToggleFollow({ projectId, follow }) {
  const target = longTermProjects.value.find((p) => p.id === projectId)
  if (target) {
    target.is_followed = follow
  }
}

const currentIndex = ref(0)
const scrollContainer = ref(null)

const onScroll = () => {
  const container = scrollContainer.value
  if (!container) return

  const scrollLeft = container.scrollLeft
  const cardWidth = container.offsetWidth * 0.8 + 16 // 卡片寬 + gap
  const index = Math.round(scrollLeft / cardWidth)

  // 最多只顯示前 5 個圓點
  currentIndex.value = Math.min(index, 4)
}

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<style scoped>
.card {
  height: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.funding-section {
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  position: relative;
  padding-top: 8rem;
  padding-bottom: 8rem;
  overflow: hidden;
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 60px;
  z-index: 2;
}

.favorite-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background-color: rgba(26, 26, 26, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}
.favorite-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.text-proposer {
  color: #c4c4c4;
  font-size: 14px;
}

/* 背景裝飾圖 */
.section3-bg1 {
  position: absolute;
  top: 300px;
  left: 0;
  width: 50px;
  z-index: 0;
}
.section3-bg2 {
  position: absolute;
  top: 400px;
  right: 0;
  width: 300px;
  z-index: 0;
}
.section3-illustration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 800px;
  z-index: 0;
}

.section3-bg2 {
  opacity: 0;
  transform: scale(1.05);
  animation: fadeZoomIn 2s ease-out forwards;
}

@keyframes fadeZoomIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.section3-illustration {
  opacity: 0;
  transform: translateY(20px);
  animation:
    fadeFloatIn 1s ease-out 0.5s forwards,
    floatUpDown 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.section3-illustration:hover {
  transform: scale(1.05);
}

/* 初次進場浮現動畫 */
@keyframes fadeFloatIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 上下浮動動畫 */
@keyframes floatUpDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.custom-section3-spacing {
  padding-top: 5rem;
  padding-bottom: 25rem;
}
@media (max-width: 991.98px) {
  .search-form .input-group {
    width: 100%;
  }
  .custom-register.small {
    font-size: 14px;
    padding: 4px 10px;
  }
  .nav-link.small {
    font-size: 14px;
  }
  .navbar-collapse .nav-link {
    font-size: 16px;
    margin-bottom: 0.75rem;
  }
  .form-control {
    font-size: 14px;
    padding: 6px 10px;
  }

  .funding-section {
    padding: 3rem 1rem 10rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .card {
    max-width: 100%;
  }

  .section2-bg1,
  .section2-bg2,
  .section3-bg1,
  .section3-bg2 {
    display: none;
  }
  .section2-illustration,
  .section3-illustration {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    max-width: 320px;
    z-index: 0;
  }

  /* 手機版橫向滑動 */
.project-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-left: -1rem;
  margin-right: -1rem;
  padding: 0 1rem;
}

.project-scroll {
  display: flex;
  gap: 1rem;
}

.card-wrapper {
  flex: 0 0 auto;
  width: 80vw;
  max-width: 320px;
}

.dot-indicator {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #ddd;
  border-radius: 50%;
  transition: background-color 0.3s;
}

/* 解決 scoped style 問題 */
:deep(.dot.active) {
  background-color: #fc5b53;
}

.project-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-left: -1rem;
  margin-right: -1rem;
  padding: 0 1rem;

  /* ✅ 加這兩行可以隱藏 scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.project-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.arrow-btn {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: #fc5b53;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow-btn:hover {
  transform: scale(1.2);
}
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .project-scroll {
    display: flex;
    gap: 1rem;
  }

  .card-wrapper {
    flex: 0 0 auto;
    width: 80vw;
    max-width: 320px;
  }

  .project-scroll-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 1rem;
    margin-left: -1rem;
    margin-right: -1rem;
    scrollbar-width: none;
  }

  .project-scroll-wrapper::-webkit-scrollbar {
    display: none;
  }

  .arrow-btn {
  background-color: transparent;
  border: none;
  font-size: 1.3rem;
  color: #fc5b53;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.arrow-btn:hover {
  transform: scale(1.2);
}
}
</style>

<template>
  <section class="funding-section text-center position-relative custom-section2-spacing">
    <!-- 背景裝飾圖 -->
    <img src="/homepageS2-bg.png" alt="bg1" class="section2-bg1" />
    <img src="/homepageS2-bg2.png" alt="bg2" class="section2-bg2" />
    <img src="/homepageS2-illustration.png" alt="illustration" class="section2-illustration" />
    <div v-if="isLoading">載入中...</div>
    <div v-else>
      <h2 class="section-title text-danger fs-4 fw-bold mb-5">募資中</h2>

      <div class="container" style="padding-left: 10rem; padding-right: 10rem">
        <!-- 桌機版卡片 -->
        <!-- 募資中固定不是已結束 -->
        <div class="row justify-content-center g-4 d-none d-xl-flex">
          <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
            <ProjectCard
              :project="card"
              :is-archived="false" 
              :isFollowed="card.is_followed"
              @toggle-follow="onToggleFollow"
            />
          </div>
        </div>

        <!-- 手機版滑動卡片 -->
        <!-- 募資中固定不是已結束 -->
        <div class="project-scroll-wrapper d-xl-none" ref="scrollContainer" @scroll="onScroll">
          <div class="project-scroll">
            <div class="card-wrapper" v-for="(card, index) in visibleCards" :key="'mobile-' + index">
              <ProjectCard
                :project="card"
                :is-archived="false" 
                :isFollowed="card.is_followed"
                @toggle-follow="onToggleFollow"
              />
            </div>
          </div>
        </div>

        <!-- 圓點指示器 -->
        <div class="dot-indicator d-md-none">
          <span
            v-for="(card, index) in visibleCards.slice(0, 5)"
            :key="'dot-' + index"
            class="dot"
            :class="{ active: currentIndex === index }"
          ></span>
        </div>

        <!-- 平板版左右箭頭（僅在平板出現） -->
        <div class="arrow-nav d-none d-md-flex d-xl-none justify-content-center gap-4 mt-3">
          <button @click="scrollLeft" class="arrow-btn">&lt;</button>
          <button @click="scrollRight" class="arrow-btn">&gt;</button>
        </div>

        <button
          class="btn btn-outline-danger rounded-pill mt-4"
          @click="showAll = !showAll"
          v-if="filteredProjects.length  > 3"
        >
          {{ showAll ? '收起' : '查看更多' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProjects } from '@/api/project'
import ProjectCard from '@/components/ProjectCard.vue'
import axios from 'axios'

const isLoading = ref(true)
const projects = ref([])
const showAll = ref(false)
  
//  初始化：取得募資中專案
onMounted(async () => {
  try {
    const res = await getAllProjects({
      filter: 'funding', // 後端設定：募資中
      page: 1,
      per_page: 6,
    })

    console.log('募資中API 回傳：', res.data)

    if (res.data.status && Array.isArray(res.data.data)) {
      projects.value = res.data.data
    }
  } catch (err) {
    console.error('取得募資中失敗:', err)
  } finally {
    isLoading.value = false
  }
})

//  新增：過濾掉已結束的專案
const filteredProjects = computed(() =>
  projects.value.filter((p) => p.status !== '已結束')
)  
  
// 使用過濾後的專案
const visibleCards = computed(() => 
  showAll.value ? filteredProjects.value : filteredProjects.value.slice(0, 3)
)


//  收藏狀態切換  
function onToggleFollow({ projectId, follow }) {
  const target = projects.value.find((p) => p.id === projectId)
  if (target) {
    target.is_followed = follow
  }
}

//  手機版滑動邏輯  
const currentIndex = ref(0)
const scrollContainer = ref(null)

const onScroll = () => {
  const container = scrollContainer.value
  if (!container) return

  const scrollLeft = container.scrollLeft
  const cardWidth = container.offsetWidth * 0.8 + 16 // 卡片寬 + gap (16px)
  const index = Math.round(scrollLeft / cardWidth)

  // 最多只顯示 0~5 的圓點
  currentIndex.value = Math.min(index, 5)
}

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

const scrollRight = () => {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<style scoped>
.funding-section {
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  position: relative;
  padding-top: 8rem;
  padding-bottom: 8rem;
  overflow: hidden;
}

.card {
  height: 100%;
  max-width: 300px;
  margin: 0 auto;
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

.progress-custom {
  height: 6px;
  background-color: #f3f3f3;
  border-radius: 100px;
  overflow: hidden;
}
.progress-custom .progress-bar {
  background-image: linear-gradient(to right, #fc7c9d, #ffc443);
}

/* 標題區兩行 */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 3em;
}

/* 說明區三行 */
.text-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 4.5em;
}

/* 背景裝飾圖 */
.section2-bg1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  z-index: 0;
}
.section2-bg2 {
  position: absolute;
  top: 400px;
  left: 0;
  width: 300px;
  z-index: 0;
}
.section2-illustration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  z-index: 0;
}

.section2-bg2 {
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

.section2-illustration {
  opacity: 0;
  transform: translateY(20px);
  animation:
    fadeFloatIn 1s ease-out 0.5s forwards,
    floatUpDown 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.section2-illustration:hover {
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

.custom-section2-spacing {
  padding-top: 5rem;
  padding-bottom: 25rem;
}
@media (max-width: 991.98px) {
  .funding-section {
    padding: 3rem 1rem 10rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .card {
    max-width: 100%;
  }
  .section2-bg1,
  .section2-bg2 {
    display: none;
  }
  .section2-illustration {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    max-width: 300px;
    z-index: 0;
  }
  /* 橫向滑動區容器 */
.project-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-left: -1rem;
  margin-right: -1rem;
  padding: 0 1rem;
  scrollbar-width: none; /* Firefox */
}

.project-scroll-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.project-scroll {
  display: flex;
  gap: 1rem;
}

/* 卡片容器 */
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

.dot.active {
  background-color: #fc5b53;
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

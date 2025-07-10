<template>
  <div class="explore-page-wrapper">
    <!-- 裝飾圖層 -->
    <img src="@/assets/images/bg.png" class="position-fixed bg-img" alt="bg" />
    <img src="/proposal-deco.png" class="position-absolute deco-img" alt="deco" />

    <!-- 內容區塊 -->
    <section class="wide-container">
      <!-- 標題區 -->
      <div class="hero-text text-start">
        <h1 class="fw-bold">探索提案</h1>
        <p>發現正在改變世界的行動</p>
      </div>

      <!-- 分類與工具列 -->
      <div
        class="filter-section d-flex justify-content-between flex-wrap align-items-center bg-transparent"
        style="margin-top: 200px; padding-top: 40px"
      >
        <!-- 分類按鈕 -->
        <div class="category-scroll">
          <ul class="nav nav-pills mb-2 category-button-group desktop-spacing">
            <li class="nav-item" v-for="tag in filters" :key="tag.key">
              <button
                class="btn filter-tab"
                :class="{ active: currentFilter === tag.key }"
                @click="setFilter(tag.key)"
              >
                {{ tag.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- 搜尋與分類 -->
        <div class="tools-wrapper mb-2 ms-auto d-flex gap-3 align-items-center">
          <div class="search-input position-relative">
            <i class="bi bi-search" @click="searchFromLocalKeyword" style="cursor: pointer"></i>
            <input
              type="text"
              placeholder="輸入關鍵字搜尋專案"
              v-model="localKeyword"
              @keydown.enter.prevent="searchFromLocalKeyword"
            />
            <button
              v-if="localKeyword"
              @click="clearLocalKeyword"
              class="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-2"
              style="background: none; border: none; font-size: 16px; color: #888"
            >
              ✕
            </button>
          </div>

          <div class="category-wrapper">
            <select
              class="form-select rounded-pill border-0 category-select"
              v-model="selectedCategory"
              @change="onCategoryChange"
            >
              <option value="">分類</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 卡片列表 -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 gx-2 gy-4 card-list">
        <div class="col d-flex" v-for="project in projects" :key="project.id">
          <ProjectCard
            :project="project"
            :is-archived="project.status === '已結束' || project.days_left === 0"
            @toggle-follow="onToggleFollow"
            class="w-100"
          />
        </div>
        <div v-if="!isLoading && projects.length === 0" class="text-center text-muted mt-4">
          沒有符合條件的專案
        </div>
      </div>

      <!-- 分頁 -->
      <nav class="d-flex justify-content-center mt-5">
        <ul class="pagination custom-pagination gap-2">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">‹</a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">›</a>
          </li>
        </ul>
      </nav>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProjectCard from '@/components/ProjectCard.vue'
import { getAllCategories } from '@/api/project'
import { useUserStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const selectedCategory = ref(route.query.category || '')
const currentPage = ref(Number(route.query.page) || 1)
const currentFilter = ref(route.query.filter || 'all')
const localKeyword = ref('') // Explore 頁自己的輸入框

const baseURL = 'https://lovia-backend-xl4e.onrender.com/api/v1'
const projects = ref([])
const categories = ref([])
const isLoading = ref(false)
const perPage = 12
const totalPages = ref(1)

const filters = [
  { key: 'all', label: '全部專案' },
  { key: 'recent', label: '近期專案' },
  { key: 'popular', label: '熱門專案' },
  { key: 'long', label: '長期贊助' },
]

//  按搜尋 icon 或 Enter 時才真正同步到 URL
const searchFromLocalKeyword = () => {
  router.push({
    path: '/projects/explore-projects',
    query: {
      ...route.query,
      keyword: localKeyword.value || undefined,
      page: 1,
    },
  })
}

// 清除本地輸入框，不會影響 header
const clearLocalKeyword = () => {
  localKeyword.value = ''
}

// 分頁
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({
      path: '/projects/explore-projects',
      query: {
        ...route.query,
        page,
      },
    })
  }
}

// 篩選
const setFilter = (key) => {
  router.push({
    path: '/projects/explore-projects',
    query: {
      ...route.query,
      filter: key,
      page: 1,
    },
  })
}

// 分類
const onCategoryChange = () => {
  router.push({
    path: '/projects/explore-projects',
    query: {
      ...route.query,
      category: selectedCategory.value || undefined,
      page: 1,
    },
  })
}

//  主 fetch
const fetchProjects = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${baseURL}/projects`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
      params: {
        search: route.query.keyword || undefined,
        category_id: route.query.category || undefined,
        page: Number(route.query.page) || 1,
        per_page: perPage,
        filter: route.query.filter || 'all',
      },
    })

    const list = (res.data.projects || res.data.data || []).map((p) => {
      const percentage = p.total_amount === 0 ? 0 : (p.amount / p.total_amount) * 100
      return {
        ...p,
        percentage: parseFloat(percentage.toFixed(2)),
        status_img: percentage >= 100 ? '/募資達標.png' : '/募資結束.png',
      }
    })
    projects.value = list

    const totalCount = res.data.total || list.length
    totalPages.value = Math.max(1, Math.ceil(totalCount / perPage))

    if (currentPage.value > totalPages.value) {
      changePage(totalPages.value)
    }
  } catch (err) {
    console.error('搜尋失敗', err)
    projects.value = []
  } finally {
    isLoading.value = false
  }
}

//  當 URL query 變化時就自動 fetch，並把當前 URL keyword 更新到 local
watch(
  () => route.query,
  (newQuery) => {
    selectedCategory.value = newQuery.category || ''
    currentPage.value = Number(newQuery.page) || 1
    currentFilter.value = newQuery.filter || 'all'
    localKeyword.value = newQuery.keyword || '' // 當跳轉時才把 URL keyword 代入
    fetchProjects()
  },
  { immediate: true }
)

onMounted(() => {
  fetchCategories()
})

const fetchCategories = async () => {
  const res = await getAllCategories()
  if (res.data?.status) {
    categories.value = res.data.data
  }
}

function onToggleFollow({ projectId, follow }) {
  const target = projects.value.find((p) => p.id === projectId)
  if (target) target.is_followed = follow
}
</script>

<style scoped>
.explore-page-wrapper {
  position: relative;
  background-image: url('@/assets/images/explore bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center 200px;
  min-height: 100vh;
  padding-bottom: 5rem;
  overflow-x: hidden;
}

.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -3;
}

.deco-img {
  top: 60px;
  left: 120px;
  width: 280px;
  z-index: -2;
  position: absolute;
}

.wide-container {
  max-width: 1140px;
  padding: 0 1rem;
  margin: 0 auto;
}

.hero-text {
  position: relative;
  z-index: 1;
  padding-top: 12rem;
  color: black;
  margin-left: 4rem;
  margin-bottom: 2rem;
}

.hero-text h1 {
  font-size: 1.8rem;
}

.hero-text p {
  font-size: 1rem;
}

.filter-section {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.nav-pills {
  gap: 4px;
}

.filter-tab {
  background: none;
  border: none;
  color: #333;
  position: relative;
  padding: 0.55rem 1.2rem;
  font-size: 15px;
  font-weight: 400;
}

.filter-tab.active {
  color: #e74c3c;
  font-weight: 400;
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40%;
  height: 2px;
  background-color: #e74c3c;
  transform: translateX(-50%);
}

.tools-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 999px;
  padding: 0 0.75rem;
  height: 40px;
  width: 280px;
  flex-shrink: 0;
}

.search-input i {
  font-size: 18px;
  color: #333;
  margin-right: 0.5rem;
}

.search-input input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
}

.category-select {
  background-color: #f9f9f9;
  height: 40px;
  padding: 0 1rem;
  font-size: 16px;
  width: 100px;
}

.card-list {
  margin-top: 3rem;
}

.custom-pagination .page-link {
  border-radius: 50%;
  background-color: transparent;
  border: none;
  width: 36px;
  height: 36px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-bottom: 2rem;
}

.custom-pagination .page-item.active .page-link {
  background-color: #ff5c5c;
  color: #fff;
}

@media (max-width: 768px) {
  /* 背景固定、位置向上調整 */
  .explore-page-wrapper {
    background-image: url('@/assets/images/explore-mobile bg.png'); /* ✅ 一定要補 */
    background-repeat: no-repeat;
    background-size: cover;
  }

  /* 隱藏裝飾圖 */
  .deco-img {
    display: none !important;
  }

  /* 主容器左右間距縮小 */
  .wide-container {
    padding: 0 0.2rem;
  }

  /* 標題置中與間距 */
  .hero-text {
    text-align: center;
    margin-left: 0;
    padding-top: 6rem;
  }

  .hero-text h1,
  .hero-text p {
    text-align: center;
  }

  /* 分類區往上調整，避免背景留白 */
  .filter-section {
    margin-top: 70px !important;
    padding-top: 12px;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* 分類按鈕可橫滑，左右更貼文字 */
  .category-scroll {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .category-button-group {
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 2px; /* 左右間距更小 */
  }

  .filter-tab {
    padding: 0.45rem 0.8rem; /* 內距調小 */
    font-size: 17px;
  }

  /* 工具列一行顯示 */
  .tools-wrapper {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .search-input {
    max-width: 60%;
    flex-grow: 1;
  }

  .category-wrapper {
    width: 40%;
    flex-shrink: 0;
  }

  .category-select {
    font-size: 14px;
    padding: 0 0.5rem;
  }

  /* 卡片區補最小高度避免背景跳動 */
  .card-list {
    min-height: 200px;
  }
}
</style>

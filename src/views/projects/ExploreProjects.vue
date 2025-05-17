<template>
  <section class="explore-page">
    <!-- 🔹 背景圖與 Banner -->
    <section class="explore-banner text-center text-white">
      <div class="banner-text-container">
        <h2 class="fw-bold text-danger">探索提案</h2>
        <p class="text-muted">發現更多你關心的議題</p>
      </div>
    </section>

    <!--  篩選與搜尋 -->
    <section class="container my-4">
      <div class="d-flex justify-content-between flex-wrap align-items-center">
        <!-- 篩選按鈕 -->
        <ul class="nav nav-pills gap-4 mb-2">
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

        <!-- 搜尋與分類 -->
        <div class="tools-wrapper mb-2 d-flex gap-3 align-items-center ms-auto">
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input
              type="text"
              placeholder="輸入關鍵字搜尋專案"
              v-model="searchKeyword"
              @input="fetchProjects"
            />
          </div>

          <div class="category-wrapper">
            <select
              class="form-select rounded-pill border-0 category-select"
              v-model="selectedCategory"
              @change="fetchProjects"
            >
              <option value="">分類</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片列表 -->
    <section class="container">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="project in visibleProjects" :key="project.id">
          <ProjectCard :project="project" />
        </div>
      </div>

      <!-- 分頁 -->
      <nav class="d-flex justify-content-center mt-4">
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProjects, getAllCategories } from '@/api/project'
import axios from 'axios'
import ProjectCard from '@/components/ProjectCard.vue'

const filters = [
  { key: 'all', label: '全部專案' },
  { key: 'recent', label: '近期專案' },
  { key: 'popular', label: '熱門專案' },
  { key: 'long', label: '長期贊助' },
]

const currentFilter = ref('all')
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const perPage = 9
const projects = ref([])
const totalPages = ref(1)
const categories = ref([])

const fetchProjects = async () => {
  const res = await getAllProjects({
    filter: currentFilter.value,
    page: currentPage.value,
    per_page: perPage,
    search: searchKeyword.value,
    category_id: selectedCategory.value,
  })
  if (res.data?.status) {
    projects.value = res.data.data
    totalPages.value = res.data.pagination.total_pages
  }
}

const fetchCategories = async () => {
  const res = await getAllCategories()
  if (res.data?.status) {
    categories.value = res.data.data
  }
}

const setFilter = (key) => {
  currentFilter.value = key
  currentPage.value = 1
  fetchProjects()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProjects()
  }
}

const visibleProjects = computed(() => projects.value)

onMounted(() => {
  fetchProjects()
  fetchCategories()
})
</script>

<style scoped>
.explore-page {
  position: relative;
  z-index: 1;
  overflow: hidden;
  background-image: url('@/assets/images/explore bg.png'), url('@/assets/images/bg.png');
  background-repeat: no-repeat, no-repeat;
  background-size: cover, cover;
  background-position:
    top 150px center,
    top center;
  background-attachment: scroll, scroll;
}

.explore-banner {
  padding-top: 10rem;
  padding-bottom: 13rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
}
.banner-text-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  padding-right: 60rem;
}
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-right: 2rem;
  margin-top: 80px;
}
.tools-wrapper {
  min-width: 420px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.filter-tab {
  background: none;
  border: none;
  color: #333;
  position: relative;
  padding-bottom: 0.25rem;
  font-size: 24px;
}
.filter-tab.active {
  color: #e74c3c;
  font-weight: bold;
}
.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 60%;
  height: 2px;
  background-color: #e74c3c;
  transform: translateX(-50%);
}
.form-control {
  background: transparent;
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
  width: 150px;
}
.custom-pagination .page-link {
  border-radius: 50%;
  background-color: transparent;
  border: none;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  color: #333;
}

.custom-pagination .page-item.active .page-link {
  background-color: #ff5c5c;
  color: #fff;
}

@media (max-width: 767.98px) {
  .explore-banner {
    padding-top: 4rem;
  }
  .tools-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

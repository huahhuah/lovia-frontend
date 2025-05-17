<template>
  <section class="funding-section text-center position-relative custom-section4-spacing">
    <!-- 背景裝飾圖 -->
    <img src="/homepageS4-bg.png" alt="bg1" class="section4-bg1" />
    <img src="/homepageS4-bg2.png" alt="bg2" class="section4-bg2" />
    <img src="/homepageS4-illustration.png" alt="illustration" class="section4-illustration" />

    <h2 class="section-title text-danger fs-4 fw-bold mb-5">歷年專案</h2>

    <div class="container" style="padding-left: 10rem; padding-right: 10rem">
      <div class="row justify-content-center g-4">
        <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
          <div class="card shadow-sm rounded-5 h-100 d-flex flex-column overflow-hidden">
            <div class="position-relative">
              <img :src="card.cover" class="card-img-top rounded-top-4" :alt="card.title" />
              <img
                :src="card.category_img || '/default.png'"
                alt="分類標籤"
                class="category-badge"
              />

              <div class="overlay-dark"></div>
              <img :src="card.status_img" class="status-stamp" alt="狀態印章" />
              <div class="favorite-wrapper">
                <img src="/favorite.png" alt="收藏" class="favorite-icon" />
              </div>
            </div>

            <div class="card-body text-start px-3 pb-4 d-flex flex-column flex-grow-1">
              <h5 class="card-title fw-bold text-ellipsis-2">{{ card.title }}</h5>
              <p class="card-text small mb-1 text-ellipsis-3">{{ card.summary }}</p>
              <p class="text-proposer mb-2">提案單位：{{ card.proposer }}</p>

              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">已結束</small>
                  <small>達成率 {{ card.percentage }}%</small>
                </div>
                <div class="progress my-2 progress-custom">
                  <div class="progress-bar" :style="{ width: card.percentage + '%' }"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <strong>NT$ {{ card.amount.toLocaleString() }}</strong>
                  <button class="btn btn-sm btn-danger rounded-pill px-3">查看專案 ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="archivedProjects.length > 3"
        @click="showAll = !showAll"
        class="btn btn-outline-danger rounded-pill mt-4"
      >
        {{ showAll ? '收起' : '查看更多' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllProjects } from '@/api/project'
import axios from 'axios'

const archivedProjects = ref([])
const showAll = ref(false)
const isLoading = ref(true)

const visibleCards = computed(() =>
  showAll.value ? archivedProjects.value : archivedProjects.value.slice(0, 3)
)

onMounted(async () => {
  try {
    const res = await getAllProjects({
      filter: 'archived',
      page: 1,
      per_page: 99,
    })
    if (res.data.status && Array.isArray(res.data.data)) {
      archivedProjects.value = res.data.data.map((p) => ({
        ...p,
        status_img: p.percentage >= 100 ? '/募資達標.png' : '/募資結束.png',
      }))
    }
  } catch (err) {
    console.error('取得歷年專案失敗:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.funding-section {
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  position: relative;
  padding-top: 8rem;
  padding-bottom: 25rem;
  overflow: hidden;
}

/* 卡片 */
.card {
  height: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* 標題兩行 */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 3em;
}

/* 說明三行 */
.text-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 4.5em;
}

/* 進度條 */
.progress-custom {
  height: 6px;
  background-color: #f3f3f3;
  border-radius: 100px;
  overflow: hidden;
}
.progress-custom .progress-bar {
  background-image: linear-gradient(to right, #fc7c9d, #ffc443);
}

/* 提案單位 */
.text-proposer {
  color: #c4c4c4;
  font-size: 14px;
}

/* Icon 與遮罩 */
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
}

.favorite-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.overlay-dark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.status-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  transform: translate(-50%, -50%);
  z-index: 2;
}

/* 背景圖 */
.section4-bg1 {
  position: absolute;
  top: 350px;
  right: 0;
  width: 50px;
  z-index: 0;
}
.section4-bg2 {
  position: absolute;
  top: 550px;
  left: 0;
  width: 300px;
  z-index: 0;
}
.section4-illustration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  z-index: 0;
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
    font-size: 1.25rem;
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
  .section3-bg2,
  .section4-bg1,
  .section4-bg2 {
    display: none;
  }
  .section2-illustration,
  .section3-illustration,
  .section4-illustration {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    max-width: 320px;
    z-index: 0;
  }
}
</style>

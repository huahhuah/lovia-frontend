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
        <div class="row justify-content-center g-4">
          <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
            <ProjectCard :project="card" />
          </div>
        </div>
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
</script>

<style scoped>
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
}
</style>

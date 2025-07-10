<template>
  <div class="my-sponsorships">
    <h2 class="section-title">我的贊助專案</h2>

    <!-- 載入狀態 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>載入贊助紀錄中...</p>
    </div>

    <!-- 主要內容 -->
    <div v-else class="sponsorships-content">
      <!-- 空狀態 -->
      <div v-if="filteredSponsorships.length === 0" class="no-sponsorships">
        <div class="empty-icon">💝</div>
        <h3>還沒有贊助紀錄</h3>
        <p>開始探索精彩專案，成為第一個支持者！</p>
        <button class="explore-button" @click="goToExploreProjects">探索專案</button>
      </div>

      <!-- 贊助卡片列表 -->
      <div v-else class="sponsorships-grid">
        <div
          v-for="item in filteredSponsorships"
          :key="item.id"
          class="sponsorship-card"
          @click="goToProject(item.project?.id)"
        >
          <!-- 專案狀態標籤 -->
          <div class="status-overlay" style="margin-bottom: 8px">
            <span :class="['status-badge', `status-${item.status}`]">
              {{ getStatusText(item.status) }}
            </span>
          </div>

          <!-- 專案資訊 -->
          <div class="card-content">
            <div class="project-header">
              <h3 class="project-title">{{ item.project?.title || '無標題專案' }}</h3>
            </div>
            <div class="detail-item">
              <span class="detail-label">訂單編號</span>
              <span class="detail-value">{{ item.order_uuid }}</span>
            </div>

            <div class="sponsorship-details">
              <div class="detail-item amount-highlight">
                <span class="detail-label">贊助金額</span>
                <span class="detail-value amount">{{ formatAmount(item.amount) }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">贊助方案</span>
                <span class="detail-value">{{ item.plan?.plan_name || '基礎方案' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">贊助日期</span>
                <span class="detail-value">{{ formatDate(item.created_at) }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">付款方式</span>
                <span class="detail-value">{{ item.payment_method || '未付款' }}</span>
              </div>

              <!-- 進度條（如果有的話） -->
              <div v-if="item.project?.progress !== undefined" class="progress-section">
                <div class="progress-label">
                  <span>專案進度</span>
                  <span>{{ item.project.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${Math.min(item.project.progress || 0, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="card-actions">
              <button
                class="action-button primary"
                @click.stop="viewProjectDetails(item.project?.id)"
              >
                查看專案
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計資訊 -->
    <div v-if="!loading && filteredSponsorships.length > 0" class="sponsorship-stats">
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-number">{{ pagination.total }}</span>
          <span class="stat-label">贊助專案</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ formatAmount(totalAmount) }}</span>
          <span class="stat-label">總贊助金額</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!loading && pagination.total_pages > 1" class="pagination-container">
    <button :disabled="currentPage === 1" @click="prevPage">上一頁</button>
    <span>第 {{ currentPage }} / {{ pagination.total_pages }} 頁</span>
    <button :disabled="currentPage === pagination.total_pages" @click="nextPage">下一頁</button>

    <div class="jump-container">
      <input
        type="number"
        v-model.number="jumpPage"
        :min="1"
        :max="pagination.total_pages"
        placeholder="頁碼"
      />
      <button @click="jumpToPage">Go</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/auth'

const userStore = useUserStore()
  

const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

export default {
  name: 'MySponsorships',
  data() {
    return {
      sponsorships: [],
      pagination: {
        total: 0,
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        has_more: false,
      },
      currentPage: null,
      jumpPage: null,
      loading: false,
      isMounted: true,
      abortController: null,
    }
  },
  computed: {
    filteredSponsorships() {
      return this.sponsorships.filter((item) => item && item.project)
    },
    totalAmount() {
      return this.filteredSponsorships.reduce((sum, item) => sum + (item.amount || 0), 0)
    },
    completedCount() {
      return this.filteredSponsorships.filter(
        (item) => (item.project?.progress_percent ?? item.project?.progress ?? 0) >= 100
      ).length
    },
  },

  methods: {
    async fetchSponsorships(page = 1) {
      if (!this.isMounted) return
      try {
        this.loading = true
        this.abortController = new AbortController()
        const token = localStorage.getItem('token')
        const res = await axios.get(
          `${BASE_URL}/users/orders/mine?page=${page}&timestamp=${Date.now()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: this.abortController.signal,
          }
        )

        if (!this.isMounted) return

        if (res.data.success) {
          this.sponsorships = res.data.data || []
          this.pagination = res.data.pagination || { total: 0 }
          this.currentPage = this.pagination.current_page || page
        } else {
          this.sponsorships = []
          this.pagination = { total: 0 }
        }
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return
        if (!this.isMounted) return
        console.error('取得贊助資料錯誤:', error)
        this.sponsorships = []
        this.pagination = { total: 0 }
      } finally {
        if (this.isMounted) {
          this.loading = false
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.fetchSponsorships(this.currentPage - 1)
      }
    },
    nextPage() {
      if (this.currentPage < this.pagination.total_pages) {
        this.fetchSponsorships(this.currentPage + 1)
      }
    },
    jumpToPage() {
      if (this.jumpPage >= 1 && this.jumpPage <= this.pagination.total_pages) {
        this.fetchSponsorships(this.jumpPage)
      } else {
        alert(`請輸入 1 ~ ${this.pagination.total_pages} 之間的頁碼`)
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '未知日期'
      try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch (error) {
        console.error('日期格式化錯誤:', error)
        return '日期錯誤'
      }
    },
    formatAmount(amount) {
      if (!amount) return 'NT$ 0'
      return `NT$ ${amount.toLocaleString()}`
    },
    getStatusText(status) {
      const statusMap = {
        paid: '已付款',
        pending: '處理中',
        completed: '已完成',
        cancelled: '已取消',
        refunded: '已退款',
      }
      return statusMap[status] || '未知狀態'
    },
    handleImageError(event) {
      event.target.style.display = 'none'
      event.target.nextElementSibling?.classList.remove('hidden')
    },
    goToProject(projectId) {
      if (projectId) {
        this.$router.push(`/projects/${projectId}`)
      }
    },
    viewProjectDetails(projectId) {
      if (projectId) {
        this.$router.push(`/projects/funding/${projectId}`)
      }
    },
    goToExploreProjects() {
      window.location.href = 'https://lovia-frontend.vercel.app/projects/explore-projects'
    },
  },
  mounted() {
    this.isMounted = true
    this.fetchSponsorships()
  },
  beforeUnmount() {
    this.isMounted = false
    if (this.abortController) {
      this.abortController.abort()
    }
  },
  unmounted() {
    this.isMounted = false
    this.sponsorships = []
    this.pagination = { total: 0 }
  },
}
</script>

<style scoped>
.my-sponsorships {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.section-title {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  text-align: left;
  position: relative;
  padding-left: 12px;
}

/* 載入狀態 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15);
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 105, 180, 0.2);
  border-top: 4px solid #fd7269;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #1a1a1a;
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

/* 空狀態 */
.no-sponsorships {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15);
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.no-sponsorships h3 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 12px;
  font-weight: 600;
}

.no-sponsorships p {
  color: #1a1a1a;
  font-size: 16px;
  margin: 0 0 32px;
}

.explore-button {
  background: #fc5b53;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px;
}

.explore-button:hover {
  background: #e94a45;
  box-shadow: 0 6px 20px rgba(252, 91, 83, 0.4);
  transform: translateY(-2px);
}

/* 贊助卡片網格 */
.sponsorships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.sponsorship-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.sponsorship-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(255, 105, 180, 0.25);
  border-color: #ffb6a7;
}

/* 圖片容器 */
.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.sponsorship-card:hover .project-img {
  transform: scale(1.05);
}

.project-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  opacity: 0.7;
}

/* 狀態覆蓋層 */
.status-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-paid {
  background: rgba(46, 116, 21, 0.5);
  color: white;
}

.status-pending {
  background: rgba(217, 114, 5, 0.5);
  color: white;
}

.status-completed {
  background: rgba(2, 31, 0, 0.5);
  color: white;
}

.status-cancelled {
  background: rgba(194, 34, 34, 0.5);
  color: white;
}

/* 卡片內容 */
.card-content {
  padding: 24px;
}

.project-header {
  height: 48px;
  overflow: hidden;
  margin-bottom: 20px;
  padding-top: 24px;
}

.project-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  line-height: 1.3;
  min-height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-category {
  display: inline-block;
  background: #fc7c9d;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* 贊助詳情 */
.sponsorship-details {
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
}

.detail-item.amount-highlight {
  border-radius: 12px;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  padding: 16px 20px;
  margin: 0 -8px 16px;
  border: 1px solid #c4c4c4;
}

.detail-label {
  font-size: 14px;
  color: rgba(95, 99, 104, 1);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.detail-value.amount {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 700;
}

/* 進度條 */
.progress-section {
  margin-top: 16px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #d5dae0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 操作按鈕 */
.card-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-button.primary {
  background: #fc5b53;
  color: white;
  box-shadow: 0 4px 15px;
  border-radius: 50px;
}

.action-button.primary:hover {
  background: #e94a45; /* 比原本的 #FC5B53 深一點 */
  box-shadow: 0 6px 20px rgba(252, 91, 83, 0.4);
  transform: translateY(-2px);
}

/* 統計資訊 */
.sponsorship-stats {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.15);
  border: 1px solid rgba(255, 105, 180, 0.1);
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: #5f6368;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #5f6368;
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-container button {
  background: #fc5b53;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-container button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination-container span {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.jump-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jump-container input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.jump-container button {
  background: #fc5b53;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.jump-container button:hover {
  background: #e94a45;
}

@media (max-width: 768px) {
  .my-sponsorships {
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
    padding-left: 5px;
  }

  .sponsorships-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .sponsorship-card {
    min-height: 460px;
    padding: 16px;
  }

  .card-content {
    padding: 16px;
  }

  .project-title {
    font-size: 18px;
  }

  .detail-item.amount-highlight {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 12px;
  }

  .detail-value.amount {
    font-size: 18px;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }

  .sponsorship-stats {
    padding: 24px 16px;
  }

  .stats-card {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .loading-container,
  .no-sponsorships {
    padding: 60px 16px;
  }

  .no-sponsorships h3 {
    font-size: 20px;
  }

  .no-sponsorships p,
  .loading-container p {
    font-size: 14px;
  }

  .explore-button {
    font-size: 14px;
    padding: 12px 24px;
  }

  .detail-label,
  .detail-value {
    font-size: 13px;
  }

  .progress-label {
    font-size: 13px;
  }

  .project-category {
    font-size: 11px;
    padding: 4px 12px;
  }

  .status-badge {
    font-size: 10px;
    padding: 6px 12px;
  }

  .detail-value {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px; /* 視情況調整 */
    display: inline-block;
  }
  .pagination-container {
    flex-wrap: nowrap; /* 不換行 */
    justify-content: space-between; /* 均勻分布 */
    gap: 8px;
  }

  .pagination-container span {
    font-size: 12px;
  }

  .pagination-container button,
  .pagination-container input,
  .pagination-container span {
    flex: 1 1 0;
    text-align: center;
    max-width: none;
  }

  .jump-container {
    display: flex;
    flex: 1;
    gap: 6px;
    justify-content: center;
  }

  .jump-container input {
    flex: 2;
  }

  .jump-container button {
    flex: 1;
  }
}
</style>

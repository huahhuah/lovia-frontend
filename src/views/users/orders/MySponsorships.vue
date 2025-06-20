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
        <button class="explore-button" @click="$router.push('/projects')">探索專案</button>
      </div>

      <!-- 贊助卡片列表 -->
      <div v-else class="sponsorships-grid">
        <div
          v-for="item in filteredSponsorships"
          :key="item.id"
          class="sponsorship-card"
          @click="goToProject(item.project?.id)"
        >
          <!-- 專案封面 -->
          <div class="card-image-container">
            <img
              v-if="item.project?.cover"
              class="project-img"
              :src="item.project.cover"
              :alt="item.project?.title || '專案封面'"
              @error="handleImageError"
            />
            <div v-else class="project-img-placeholder">
              <span>📋</span>
            </div>

            <!-- 狀態標籤 -->
            <div class="status-overlay">
              <span :class="['status-badge', `status-${item.status}`]">
                {{ getStatusText(item.status) }}
              </span>
            </div>
          </div>

          <!-- 專案資訊 -->
          <div class="card-content">
            <div class="project-header">
              <h3 class="project-title">{{ item.project?.title || '無標題專案' }}</h3>
              <div class="project-category">{{ item.project?.category || '其他' }}</div>
            </div>

            <div class="sponsorship-details">
              <div class="detail-item amount-highlight">
                <span class="detail-label">贊助金額</span>
                <span class="detail-value amount">{{ formatAmount(item.amount) }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">贊助方案</span>
                <span class="detail-value">{{ item.plan?.title || '基礎方案' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">贊助日期</span>
                <span class="detail-value">{{ formatDate(item.created_at) }}</span>
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
              <button class="action-button secondary" @click.stop="viewSponsorshipDetails(item.id)">
                贊助詳情
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
          <span class="stat-number">{{ filteredSponsorships.length }}</span>
          <span class="stat-label">贊助專案</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ formatAmount(totalAmount) }}</span>
          <span class="stat-label">總贊助金額</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ completedCount }}</span>
          <span class="stat-label">已完成專案</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MySponsorships',
  data() {
    return {
      sponsorships: [],
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
        (item) => item.status === 'completed' || item.project?.status === 'completed'
      ).length
    },
  },

  methods: {
    async fetchSponsorships() {
      if (!this.isMounted) return

      try {
        this.loading = true
        this.abortController = new AbortController()

        const token = localStorage.getItem('token')
        const res = await axios.get(`/api/v1/users/orders/mine?timestamp=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: this.abortController.signal,
        })

        if (!this.isMounted) return

        if (res.data.success) {
          console.log('API 回傳贊助資料:', res.data.data)
          this.sponsorships = res.data.data || []
        } else {
          this.sponsorships = []
        }
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return
        if (!this.isMounted) return

        console.error('取得贊助資料錯誤:', error)
        this.sponsorships = []
      } finally {
        if (this.isMounted) {
          this.loading = false
        }
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
        this.$router.push(`/projects/${projectId}`)
      }
    },

    viewSponsorshipDetails(sponsorshipId) {
      // 實現查看贊助詳情的邏輯
      console.log('查看贊助詳情:', sponsorshipId)
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
  },
}
</script>

<style scoped>
.my-sponsorships {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #ffe4e1 0%,
    #ffcccb 30%,
    #ffb6c1 60%,
    rgba(255, 105, 180, 0) 100%
  );
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #d5006d;
  margin: 0 0 24px 0;
  text-align: left;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #ff1493, #ff69b4);
  border-radius: 2px;
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
  border-top: 4px solid #ff1493;
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
  color: #d5006d;
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
  color: #d5006d;
  margin: 0 0 12px;
  font-weight: 600;
}

.no-sponsorships p {
  color: #c71585;
  font-size: 16px;
  margin: 0 0 32px;
}

.explore-button {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.explore-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5);
  background: linear-gradient(135deg, #ff1493, #db2777);
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
  border-color: #ff69b4;
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
  background: linear-gradient(135deg, #ffe4e1, #ffcccb);
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
  background: rgba(76, 175, 80, 0.9); /* 綠色底 */
  color: white;
}

.status-pending {
  background: rgba(255, 182, 193, 0.9);
  color: white;
}

.status-completed {
  background: rgba(255, 20, 147, 0.9);
  color: white;
}

.status-cancelled {
  background: rgba(255, 105, 180, 0.9);
  color: white;
}

/* 卡片內容 */
.card-content {
  padding: 24px;
}

.project-header {
  margin-bottom: 20px;
}

.project-title {
  font-size: 20px;
  font-weight: 700;
  color: #d5006d;
  margin: 0 0 8px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-category {
  display: inline-block;
  background: linear-gradient(135deg, #ffe4e1, #ffcccb);
  color: #d5006d;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 105, 180, 0.2);
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
  background: linear-gradient(135deg, #ffe4e1, #ffcccb);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 0 -8px 16px;
  border: 1px solid rgba(255, 105, 180, 0.2);
}

.detail-label {
  font-size: 14px;
  color: #c71585;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #d5006d;
  font-weight: 600;
}

.detail-value.amount {
  font-size: 20px;
  color: #ff1493;
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
  color: #c71585;
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
  background: linear-gradient(90deg, #ff69b4, #ff1493);
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
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #ff1493, #db2777);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.7);
  color: #d5006d;
  border: 1px solid rgba(255, 105, 180, 0.3);
  backdrop-filter: blur(10px);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #ff69b4;
  color: #ff1493;
  transform: translateY(-1px);
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
  color: #ff1493;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(255, 105, 180, 0.2);
}

.stat-label {
  font-size: 16px;
  color: #d5006d;
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .my-sponsorships {
    padding: 16px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .sponsorships-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-content {
    padding: 20px;
  }

  .project-title {
    font-size: 18px;
  }

  .stats-card {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .stat-number {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .my-sponsorships {
    padding: 12px;
  }

  .card-content {
    padding: 16px;
  }

  .card-actions {
    flex-direction: column;
    gap: 8px;
  }

  .detail-item.amount-highlight {
    margin: 0 -4px 16px;
    padding: 12px 16px;
  }
}

/* 深色模式適配粉暖色系 */
@media (prefers-color-scheme: dark) {
  .my-sponsorships {
    background: linear-gradient(135deg, #4c1d95 0%, #7c2d12 30%, #92400e 60%, #d5006d 100%);
  }

  .section-title {
    color: #ffeb3b;
  }

  .section-title::before {
    background: linear-gradient(135deg, #ffeb3b, #ff9800);
  }

  .sponsorship-card,
  .loading-container,
  .no-sponsorships,
  .sponsorship-stats {
    background: rgba(39, 39, 42, 0.9);
    border-color: rgba(255, 235, 59, 0.2);
    box-shadow: 0 8px 32px rgba(255, 235, 59, 0.1);
  }

  .project-title {
    color: #ffeb3b;
  }

  .detail-label {
    color: #ff9800;
  }

  .detail-value {
    color: #ffeb3b;
  }

  .detail-value.amount {
    color: #ff9800;
  }

  .project-category {
    background: rgba(39, 39, 42, 0.8);
    color: #ffeb3b;
    border-color: rgba(255, 235, 59, 0.3);
  }

  .detail-item.amount-highlight {
    background: rgba(39, 39, 42, 0.6);
    border-color: rgba(255, 235, 59, 0.3);
  }

  .progress-bar {
    background: rgba(39, 39, 42, 0.8);
  }

  .progress-fill {
    background: linear-gradient(90deg, #ffeb3b, #ff9800);
  }

  .action-button.primary {
    background: linear-gradient(135deg, #ffeb3b, #ff9800);
    box-shadow: 0 4px 15px rgba(255, 235, 59, 0.3);
  }

  .action-button.primary:hover {
    background: linear-gradient(135deg, #ff9800, #ff5722);
    box-shadow: 0 6px 20px rgba(255, 235, 59, 0.4);
  }

  .action-button.secondary {
    background: rgba(39, 39, 42, 0.7);
    border-color: rgba(255, 235, 59, 0.3);
    color: #ffeb3b;
  }

  .action-button.secondary:hover {
    background: rgba(39, 39, 42, 0.9);
    border-color: #ffeb3b;
    color: #ff9800;
  }

  .stat-number {
    color: #ffeb3b;
    text-shadow: 0 2px 4px rgba(255, 235, 59, 0.2);
  }

  .stat-label {
    color: #ff9800;
  }

  .loading-container p,
  .no-sponsorships h3,
  .no-sponsorships p {
    color: #ffeb3b;
  }

  .explore-button {
    background: linear-gradient(135deg, #ffeb3b, #ff9800);
    box-shadow: 0 6px 20px rgba(255, 235, 59, 0.4);
  }

  .explore-button:hover {
    background: linear-gradient(135deg, #ff9800, #ff5722);
    box-shadow: 0 10px 30px rgba(255, 235, 59, 0.5);
  }
}
</style>

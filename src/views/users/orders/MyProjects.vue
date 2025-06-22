<template>
  <div class="my-projects">
    <h1 class="section-title">我的專案</h1>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="projects.length === 0" class="no-projects">尚無提案</div>

    <div v-else class="card-wrapper">
      <div class="table-card">
        <div class="table-responsive">
          <table class="project-table">
            <thead>
              <tr>
                <th>專案名稱</th>
                <th>目標金額</th>
                <th>支持金額</th>
                <th>訂單狀態</th>
                <th>回饋品</th>
                <th>新增進度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id">
                <td>
                  <a href="#" @click.prevent="openProjectDetail(project)">{{ project.title }}</a>
                </td>
                <td>{{ formatCurrency(project.targetAmount) }}</td>
                <td>{{ formatCurrency(project.supportAmount) }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(project.status)">
                    {{ project.status }}
                  </span>
                </td>
                <td>{{ project.rewardItem || '無' }}</td>
                <router-link
                  :to="{ name: 'ProgressFormCreate', params: { projectId: project.id } }"
                  class="icon-button icon-button--modern"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="icon--enhanced"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  新增進度
                </router-link>
                <td class="actions">
                  <!-- 編輯按鈕（用 edit.png） -->
                  <router-link
                    :to="{ name: 'ProjectFormEdit', params: { project_id: project.id } }"
                    class="icon-button"
                  >
                    <img src="/edit.png" alt="edit" width="20" height="20" />
                  </router-link>
                  <!-- 刪除按鈕（用 delete.png） -->
                  <button
                    @click="handleDelete(project.id)"
                    class="icon-button"
                    :disabled="deleting === project.id"
                  >
                    <img src="/delete.png" alt="delete" width="20" height="20" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ProjectDetailModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="selectedProject = null"
    />
  </div>
</template>

<script>
import { getMyProjects, deleteProject } from '@/api/project'
import ProjectDetailModal from '@/views/users/orders/ProjectDetailModal.vue' // ← 加這一行
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()
export default {
  name: 'MyProjects',
  components: {
    ProjectDetailModal,
  },
  data() {
    return {
      projects: [],
      loading: false,
      deleting: null, // 紀錄正在刪除的專案ID
      selectedProject: null, // ← 加入這一行
    }
  },
  methods: {
    async fetchProjects() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('尚未登入或 token 遺失')
        }

        const res = await getMyProjects(token)
        this.projects = res.data.data || []

        console.log('成功取得專案列表:', this.projects.length, '個專案')
      } catch (error) {
        console.error('取得專案列表失敗:', error)

        // 根據錯誤類型顯示不同訊息
        if (error.response?.status === 401) {
          this.$toast?.error?.('登入已過期，請重新登入')
          // 可以導向登入頁面
          // this.$router.push('/login')
        } else if (error.response?.status === 403) {
          this.$toast?.error?.('沒有權限查看專案')
        } else {
          this.$toast?.error?.('無法取得專案資料，請稍後再試')
        }
      } finally {
        this.loading = false
      }
    },

    formatCurrency(amount) {
      if (amount === null || amount === undefined) return '無資料'

      const numAmount = Number(amount)
      if (isNaN(numAmount)) return '無資料'

      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
      }).format(numAmount)
    },

    getStatusClass(status) {
      const statusMap = {
        進行中: 'status-active',
        已完成: 'status-completed',
        已取消: 'status-cancelled',
        待審核: 'status-pending',
      }
      return statusMap[status] || 'status-default'
    },

    async handleDelete(projectId) {
      // 防止重複點擊
      if (this.deleting === projectId) return

      const confirmDelete = confirm('確定要刪除此專案嗎？此操作無法復原')
      if (!confirmDelete) return

      this.deleting = projectId

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('尚未登入')
        }

        // 先檢查專案是否存在
        const projectExists = this.projects.find((p) => p.id === projectId)
        if (!projectExists) {
          throw new Error('專案不存在或已被刪除')
        }

        await deleteProject(projectId, token)

        this.$toast?.success?.('專案已成功刪除')

        // 從本地列表中移除已刪除的專案，避免重新載入
        this.projects = this.projects.filter((p) => p.id !== projectId)
      } catch (error) {
        console.error('刪除失敗:', error)

        // 根據錯誤類型顯示不同訊息
        if (error.response?.status === 404) {
          this.$toast?.warning?.('專案不存在或已被刪除')
          // 刷新列表以同步狀態
          this.fetchProjects()
        } else if (error.response?.status === 401) {
          this.$toast?.error?.('登入已過期，請重新登入')
        } else if (error.response?.status === 403) {
          this.$toast?.error?.('沒有權限刪除此專案')
        } else {
          this.$toast?.error?.('刪除失敗，請稍後再試')
        }
      } finally {
        this.deleting = null
      }
    },

    openProjectDetail(project) {
      console.log('你點擊了：', project.title)
      this.selectedProject = project
    },
  },

  mounted() {
    this.fetchProjects()
  },
}
</script>

<style scoped>
.my-projects {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  margin-left: 18px;
  text-align: left;
}

.loading,
.no-projects {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.card-wrapper {
  display: flex;
  justify-content: center;
}

.table-card {
  background: transparent;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;
}

.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.project-table th {
  background-color: #ffd2cf;
  white-space: nowrap;
  font-weight: 600;
  color: #333;
}

.project-table th,
.project-table td {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  text-align: left;
  vertical-align: middle; /* 確保所有內容垂直居中 */
}

.project-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  vertical-align: middle;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-completed {
  background-color: #cce7ff;
  color: #0066cc;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-default {
  background-color: #e9ecef;
  color: #6c757d;
}

.status-success {
  color: #28a745;
}

.status-warning {
  color: #ffc107;
}

.actions {
  white-space: nowrap;
}

/* 統一的按鈕樣式 - 基礎版本 */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  background: transparent;
  color: #cc4444; /* 更紅的預設顏色 */
  min-height: 32px; /* 確保按鈕有固定高度 */
  box-sizing: border-box; /* 確保 padding 計算在高度內 */
}

.icon-button:hover {
  background: #f1f3f4;
  color: #aa2222; /* hover 時更深的紅色 */
}

/* 現代化漸變效果按鈕 - 粉色系暖漸層 */
.icon-button--modern {
  background: transparent; /* 背景透明 */
  color: black; /* 文字改成黑色 */
  border: 1px solid black; /* 加上黑色邊框 */
  box-shadow: none; /* 拿掉原本的陰影 */
  overflow: hidden;
  padding: 6px 10px;
  min-height: 32px;
  vertical-align: middle;
  margin-top: 12px;
  transition: all 0.3s ease; /* 增加滑過動畫效果 */
}

.icon-button--modern:hover {
  background: black; /* 滑過變黑底 */
  color: white; /* 文字變白色 */
}

.icon-button--modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.icon-button--modern:hover::before {
  left: 100%;
}

.icon-button--modern:hover {
  box-shadow: 0 2px 6px rgba(255, 154, 158, 0.3);
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}

/* 只有圖標的按鈕樣式 */
.icon-button--icon-only {
  padding: 8px;
  border-radius: 50%;
  min-width: 32px;
  min-height: 32px;
  gap: 0;
}

.icon-button--icon-only:hover {
  background: #f1f3f4;
  transform: scale(1.05);
}

/* 編輯按鈕 */
.icon-button--edit {
  color: #cc4444; /* 更偏紅的編輯按鈕顏色 */
}

.icon-button--edit:hover {
  background: #ffebeb; /* 淡紅色背景 */
  color: #aa2222; /* 深紅色 */
}

/* 刪除按鈕 */
.icon-button--delete {
  color: #dc2626; /* 保持較深的紅色 */
}

.icon-button--delete:hover {
  background: #fef2f2;
  color: #b91c1c; /* 更深的紅色 */
}

/* 增強的圖標樣式 */
.icon--enhanced {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  filter: drop-shadow(0 1px 2px rgba(204, 68, 68, 0.2)); /* 紅色陰影 */
  flex-shrink: 0; /* 防止圖標變形 */
}

/* 表格中的圖標 */
.icon-button img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  transition: transform 0.2s;
  filter: hue-rotate(10deg) saturate(1.2); /* 增加紅色調和飽和度 */
}

.icon-button:hover img {
  transform: scale(1.1);
  filter: hue-rotate(15deg) saturate(1.4); /* hover 時更紅 */
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-button:disabled:hover {
  transform: none;
  background: transparent;
}

@media (max-width: 768px) {
  .project-table {
    font-size: 14px;
  }

  .project-table th,
  .project-table td {
    padding: 8px 4px;
  }

  .icon-button {
    padding: 4px 8px;
    font-size: 12px;
    min-height: 28px;
  }

  .icon-button--icon-only {
    min-width: 28px;
    min-height: 28px;
    padding: 6px;
  }

  .icon--enhanced {
    width: 14px;
    height: 14px;
  }
}
</style>

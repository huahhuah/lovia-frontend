<template>
  <div class="my-projects">
    <h1>我的專案</h1>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="projects.length === 0" class="no-projects">尚無提案</div>

    <table v-else class="project-table">
      <thead>
        <tr>
          <th>專案名稱</th>
          <th>目標金額</th>
          <th>支持金額</th>
          <th>訂單狀態</th>
          <th>回饋品</th>
          <th>配送地址</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.title }}</td>
          <td>{{ formatCurrency(project.targetAmount) }}</td>
          <td>{{ formatCurrency(project.supportAmount) }}</td>
          <td>
            <span class="status-badge" :class="getStatusClass(project.status)">
              {{ project.status }}
            </span>
          </td>
          <td>{{ project.rewardItem || '無' }}</td>
          <td>
            <span v-if="project.shippingInfo" class="status-success">✔️ 已填寫</span>
            <span v-else class="status-warning">❌ 無</span>
          </td>
          <td class="actions">
            <router-link
              :to="{ name: 'ProjectFormEdit', params: { project_id: project.id } }"
              class="btn-edit"
            >
              編輯專案
            </router-link>
            <button
              @click="handleDelete(project.id)"
              class="btn-delete"
              :disabled="deleting === project.id"
            >
              {{ deleting === project.id ? '刪除中...' : '刪除' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getMyProjects, deleteProject } from '@/api/project'

export default {
  name: 'MyProjects',
  data() {
    return {
      projects: [],
      loading: false,
      deleting: null, // 紀錄正在刪除的專案ID
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

.loading,
.no-projects {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.project-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.project-table th,
.project-table td {
  padding: 12px;
  border: 1px solid #e9ecef;
  text-align: left;
}

.project-table th:last-child,
.project-table td:last-child {
  text-align: center;
}

.project-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* 狀態徽章樣式 */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
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

/* 狀態指示器 */
.status-success {
  color: #28a745;
}

.status-warning {
  color: #ffc107;
}

/* 操作按鈕區域 */
.actions {
  white-space: nowrap;
}

.btn-edit {
  display: inline-block;
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  padding: 6px 12px;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-delete:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .my-projects {
    padding: 10px;
  }

  .project-table {
    font-size: 14px;
  }

  .project-table th,
  .project-table td {
    padding: 8px 4px;
  }

  .btn-edit,
  .btn-delete {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>

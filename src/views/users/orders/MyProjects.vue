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
                <th>募資狀態</th>
                <th>審核狀態</th> <!-- 這邊改成審核狀態 -->
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
                  <span class="status-badge" :class="getStatusClass(project.project_type)">
  {{ project.project_type }}
</span>
                </td>
                <!-- 審核狀態欄位改用 project.auditStatus（或 project.reviewStatus），如果無此欄位用 project.status 替代 -->
                <td>
                  <span class="status-badge" :class="getStatusClass(project.auditStatus || project.status)">
                    {{ project.auditStatus || project.status || '無' }}
                  </span>
                </td>
                <td>
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
                </td>
                <td class="actions">
                  <!-- 編輯按鈕 -->
                  <router-link
                    :to="{ name: 'ProjectFormEdit', params: { project_id: project.id } }"
                    class="icon-button icon-button--edit"
                  >
                    <img src="/edit.png" alt="edit" width="20" height="20" />
                  </router-link>
                  <!-- 刪除按鈕 -->
                  <button
                    @click="handleDelete(project.id)"
                    class="icon-button icon-button--delete"
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
      deleting: null,
      selectedProject: null,
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
      } catch (error) {
        console.error('取得專案列表失敗:', error)
        if (error.response?.status === 401) {
          this.$toast?.error?.('登入已過期，請重新登入')
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
      if (this.deleting === projectId) return
      const confirmDelete = confirm('確定要刪除此專案嗎？此操作無法復原')
      if (!confirmDelete) return
      this.deleting = projectId
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('尚未登入')
        }
        const projectExists = this.projects.find((p) => p.id === projectId)
        if (!projectExists) {
          throw new Error('專案不存在或已被刪除')
        }
        await deleteProject(projectId, token)
        this.$toast?.success?.('專案已成功刪除')
        this.projects = this.projects.filter((p) => p.id !== projectId)
      } catch (error) {
        console.error('刪除失敗:', error)
        if (error.response?.status === 404) {
          this.$toast?.warning?.('專案不存在或已被刪除')
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
  background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 100%);
  min-height: 100vh;
  border-radius: 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 18px;
  text-align: left;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(252, 125, 157, 0.1);
}

.loading,
.no-projects {
  text-align: center;
  padding: 60px;
  color: #FC7D9D;
  font-size: 18px;
  font-weight: 500;
  background: rgba(252, 125, 157, 0.05);
  border-radius: 15px;
  border: 2px dashed #FC7D9D;
}

.card-wrapper {
  display: flex;
  justify-content: center;
}

.table-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 25px;
  box-shadow:
    0 20px 40px rgba(252, 125, 157, 0.15),
    0 10px 20px rgba(255, 196, 67, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  width: 100%;
  overflow-x: auto;
  border: 1px solid rgba(252, 125, 157, 0.1);
}

.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border-radius: 15px;
  overflow: hidden;
}

.project-table th {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  color: white;
  white-space: nowrap;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.project-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
}

.project-table th, .project-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(252, 125, 157, 0.1);
  text-align: left;
  vertical-align: middle;
}

.project-table tbody tr {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
}

.project-table tbody tr:nth-child(even) {
  background: rgba(252, 125, 157, 0.02);
}

.progress-cell {
  white-space: nowrap;
}

.project-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(252, 125, 157, 0.08) 0%, rgba(255, 196, 67, 0.05) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(252, 125, 157, 0.1);
}

.project-table a {
  color: #FC7D9D;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.project-table a:hover {
  color: #e91e63;
  text-shadow: 0 1px 2px rgba(252, 125, 157, 0.2);
}

.project-table a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FC7D9D, #FFC443);
  transition: width 0.3s ease;
}

.project-table a:hover::after {
  width: 100%;
}

/* 狀態標籤 */
.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-active {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-completed {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-cancelled {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-pending {
  background: linear-gradient(135deg, #FFC443 0%, #f59e0b 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-default {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 按鈕與連結 */
.icon-button {
  border: none;
  background: transparent;
  cursor: pointer;
  margin-right: 8px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(252, 125, 157, 0.1) 0%, rgba(255, 196, 67, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.icon-button:hover::before {
  opacity: 1;
}

.icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.icon-button img {
  vertical-align: middle;
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.icon-button:hover img {
  transform: scale(1.1);
}

.icon-button--modern {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  border-radius: 20px;
  padding: 10px 18px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  user-select: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(252, 125, 157, 0.3);
  border: none;
  position: relative;
  overflow: hidden;
}

.icon-button--modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.icon-button--modern:hover::before {
  left: 100%;
}

.icon-button--modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(252, 125, 157, 0.4);
}

.icon-button--edit {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.icon-button--edit:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.icon-button--delete {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.icon-button--delete:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.4);
  transform: translateY(-1px);
}

.icon--enhanced {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 操作欄 */
.actions {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .my-projects {
    padding: 15px;
    border-radius: 15px;
  }

  .section-title {
    font-size: 24px;
    margin-left: 10px;
  }

  .table-card {
    padding: 1rem;
    border-radius: 20px;
  }

  .project-table th, .project-table td {
    padding: 12px 8px;
    font-size: 14px;
  }

  .icon-button--modern {
    padding: 8px 14px;
    font-size: 12px;
  }
}

/* 滾動條美化 */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: rgba(252, 125, 157, 0.1);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e91e63 0%, #f59e0b 100%);
}
</style>

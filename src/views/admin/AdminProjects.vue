<template>
  <div class="container py-5">
    <h2 class="text-xl font-bold mb-4">提案資料</h2>
    <div class="table-responsive">
      <table class="table project-table">
        <thead>
          <tr>
            <th>提案時間</th>
            <th>標題</th>
            <th>募資期間</th>
            <th>提案單位</th>
            <th>查看詳情</th>
            <th>提案狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>{{ formatDate(project.created_at) }}</td>
            <td class="text-break">{{ project.title }}</td>
            <td>{{ project.start_time }} ~ {{ project.end_time }}</td>
            <td>{{ project.project_team }}</td>
            <td class="text-center align-middle"><button class="btn btn-outline-primary btn-sm" @click="viewDetails(project)">🔍</button></td>
            <td>
              <select 
                class="form-select form-select-sm mt-1" 
                v-model="project.status" 
                :class="statusClass(project.status)" 
                @change="onStatusChange(project)"
              >
                <option :value=1>審查中</option>
                <option :value=2>提案通過</option>
                <option :value=3>提案退回</option>
                <option :value=4>修改後重送</option>
              </select>
              <input 
                v-if="project.status === 3" 
                v-model="project.reason" 
                type="text" 
                class="form-control form-control-sm mt-2" 
                placeholder="請輸入退回原因"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-primary" 
      @click="submitAllUpdates" 
      :disabled="isSubmitting">送出更新</button>
    </div>
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="spinner"></div>
      <p>更新中，請稍候...</p>
    </div>
  </div>

  <div class="pagination mt-4">
    <button 
      v-for="n in totalPages" 
      :key="n" 
      :class="{active: n === currentPage}" 
      @click="changePage(n)"
    >{{ n }}</button>
  </div>

  <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
    <div class="modal-card">
      <button class="close-btn" @click="closeDetailModal"> ❌ </button>
      <h2>提案詳細資料</h2>
      <p><strong>提案編號：</strong>{{selectedProject.id}}</p>
      <p><strong>提案者名稱：</strong>{{selectedProject.name}}</p>
      <p><strong>提案帳號：</strong>{{selectedProject.email}}</p>
      <p><strong>提案者電話：</strong>{{selectedProject?.phone || '-'}}</p>
      <p><strong>提案標題：</strong>{{ selectedProject.title }}</p>
      <p><strong>提案大綱：</strong>{{ selectedProject.summary }}</p>
      <p><strong>提案分類：</strong>{{ selectedProject.category }}</p>
      <p><strong>預計募資總金額：</strong>{{ selectedProject.total_amount }}</p>
      <p><strong>募資期間：</strong>{{ selectedProject.start_time }} ~ {{ selectedProject.end_time }}</p>
      <p><strong>封面：</strong><a :href="selectedProject.cover" target="_blank">{{ selectedProject.cover }}</a></p>
      <p><strong>完整內容：</strong></p>
      <p v-html="formatMultilineText(selectedProject.full_content)"></p>
      <p><strong>提案團隊：</strong>{{ selectedProject.project_team }}</p>
      <p><strong>問與答：</strong></p>
      <div v-if="selectedProject.parseFaq?.length">
        <ul>
          <li v-for="(item, index) in selectedProject.parseFaq" :key="index">
            <p><strong>Q:</strong> {{ item.question }}</p>
            <p><strong>A:</strong> {{ item.answer }}</p>
          </li>
        </ul>
      </div>
      <p v-else>無</p>
      <div v-if="selectedProject.plans?.length">
        <h5>回饋方案</h5>
        <ul>
          <li v-for="(plan, index) in selectedProject.plans" :key="index">
            <p>名稱：{{ plan.plan_name }}</p>
            <p>金額：{{ plan.plan_amount }}</p>
            <p>數量：{{ plan.quantity }}</p>
            <p>回饋品：{{ plan.feedback }}</p>
            <p>寄送時間：{{ plan.delivery_date }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { allProjects as getProjects } from '@/api/admin'
import axios from 'axios'

const isSubmitting = ref(false)
const userStore = useUserStore()

const projects = ref([])
const currentPage = ref(1) // 建立可追蹤變數，起始值為1，故預設第1頁
const totalPages = ref(1)
const showDetailModal = ref(false)
const selectedProject = ref(null)

function formatDate(dateString){
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function formatMultilineText(text) {
  if (!text) return ''
  const parsed = text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n')
  return parsed.replace(/\n/g, '<br>')
}

async function getAllProjects( page = 1){
  try {
    const token = userStore.token
    const res = await getProjects(token, page)
    const result = res.data.result

    projects.value = result.data.map(project => ({
      ...project,
      status: project.status_id,
      reason: ''
    }))
    totalPages.value = result.pagination.totalPages
    currentPage.value = result.pagination.currentPage
  } catch (err) {
    console.error('載入失敗', err)
  }
}

function viewDetails(project) {
  selectedProject.value = {
    ...project,
    parseFaq: []
  } 
  try {
    if(typeof project.faq === 'string'){
      selectedProject.value.parseFaq = JSON.parse(project.faq)
    } else if (Array.isArray(project.faq)){
      selectedProject.value.parseFaq = project.faq
    } 
  } catch (e){
      console.warn('問與答解析失敗',e )
      selectedProject.value.parseFaq = []
  }
  showDetailModal.value = true
}

async function closeDetailModal (){
  showDetailModal.value = false
  selectedProject.value = null  
}

onMounted(() => {
  getAllProjects()
})

const changePage = (page) =>{
  if (page >= 1 && page <= totalPages.value){
    getAllProjects(page)
  }
}
function onStatusChange(project) {
  if (project.status === 3 && !project.reason){
    project.reason = ''
  }
}

function statusClass(status) {
  switch(status) {
    case 2:
      return "status-approved"
    case 3:
      return "status-rejected"
    case 4:
      return "status-resubmitted" 
    case 1:
    default:
      return "status-pending"
  }
}

async function submitAllUpdates() {
  const token = userStore.token
  isSubmitting.value = true // ✅ 開始時設為 true
  try {
    for (const project of projects.value) {
      const status = project.status
      if (![2,3].includes(status)) {
        continue // 只送出通過或退回
      }
      const payload = { status }
      if (status === 3) {
        if (!project.reason.trim()) {
          alert(`請填寫提案 ${project.id} 的退回原因`)
          isSubmitting.value = false // 錯誤時關閉
          return
        }
        payload.reason = project.reason.trim()
      }

      await axios.patch(`https://lovia-backend-xl4e.onrender.com/api/v1/admins/projects/${project.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
    }
    alert('所有狀態已更新')
    await getAllProjects(currentPage.value)  // 更新完重新載入列表
    console.log('重新載入專案列表:',projects.value);
  } catch (error) {
    console.error('更新失敗', error)
    alert('更新失敗，請稍後再試')
  } finally {
    isSubmitting.value = false 
  }
}

</script>

<style scoped>
.project-table th, .project-table td {
  vertical-align: middle;
  white-space: nowrap;
}
.project-table th {
  background-color: #f8f9fa;
}
.project-table td select,
.project-table td input {
  width: 100%;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.pagination button {
  padding: 6px 12px;
  border: 1px solid #aaa;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.pagination button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-card {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
@media (max-width: 768px) {
  .project-table {
    border-collapse: separate;
    border-spacing: 0 1rem;
  }

  .project-table thead {
    display: none;
  }

  .project-table, .project-table tbody, .project-table tr, .project-table td {
    display: block;
    width: 100%;
  }

  .project-table tr {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    margin-bottom: 1rem;
  }

  .project-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border: none;
  }

  .project-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #333;
    flex-basis: 40%;
    text-align: left;
  }

  .project-table td > *:not(:first-child) {
    flex: 1;
    text-align: right;
  }

  .project-table td button,
  .project-table td select,
  .project-table td input {
    width: 100%;
    margin-top: 0.25rem;
  }

  .btn-sm {
    padding: 6px 10px;
    font-size: 14px;
  }

  .form-select-sm,
  .form-control-sm {
    font-size: 14px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 6px;
  }

  :deep(.project-table td input) {
    display: block !important;
    flex: 1 0 50% !important;
    text-align: left !important;
  }

  .project-table td > *:not(:first-child):not(input) {
    flex: 1;
    text-align: right;
  }
}
</style>

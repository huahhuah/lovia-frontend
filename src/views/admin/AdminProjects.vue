<template>
  <div class="container py-5">
    <h2 class="text-xl font-bold mb-4">提案資料</h2>
    <table border="1" style="width: 100%" class="project-table">
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
          <td>{{ project.title }}</td>
          <td>{{ project.start_time }} ~ {{ project.end_time }}</td>
          <td>{{ project.project_team }}</td>
          <td><button @click="viewDetails(project)">🔍</button></td>
          <td>
            <select 
              v-model="project.status_id" 
              :class="statusClass(project.status_id)" 
              @change="onStatusChange(project)"
            >
              <option :value=1>審查中</option>
              <option :value=2>提案通過</option>
              <option :value=3>提案退回</option>
            </select>
            <div v-if="project.status_id === 3" style="margin-top: 4px;">
              <input 
                type="text" 
                v-model="project.reason" 
                placeholder="請輸入退回原因" 
                style="width: 100%;"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 20px; text-align: center;">
      <button @click="submitAllUpdates()">送出更新</button>
    </div>
  </div>
  <div class="pagination mt-3">
    <button 
    v-for="n in totalPages" 
    :key="n" 
    :class="{active: n === currentPage}"
    @click="changePage(n)">{{ n }}</button>
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
      <p><strong>問與答：</strong>{{ selectedProject.faq || '無' }}</p>
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
      status_id: typeof project.projectStatus?.id === 'number' ? project.projectStatus.id : 1,
      reason: ''
    }))
    totalPages.value = result.pagination.totalPages
    currentPage.value = result.pagination.currentPage
  } catch (err) {
    console.error('載入失敗', err)
  }
}

function viewDetails(project) {
  selectedProject.value = project
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
  if (project.status_id === 3 && !project.reason){
    project.reason = ''
  }
}

function statusClass(status) {
  switch(status) {
    case 2:
      return "status-approved"
    case 3:
      return "status-rejected"
    case 1:
    default:
      return "status-pending"
  }
}

async function submitAllUpdates() {
  const token = userStore.token

  try {
    for (const project of projects.value) {
      const status = project.status_id
      if (![2,3].includes(status)) {
        continue // 只送出通過或退回
      }
      const payload = { status }
      if (status === 3) {
        if (!project.reason.trim()) {
          alert(`請填寫提案 ${project.id} 的退回原因`)
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
  } catch (error) {
    console.error('更新失敗', error)
    alert('更新失敗，請稍後再試')
  }
}

</script>

<style scoped>
.project-table th, .project-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: none; /* 先不設底線 */
  background-color: #fff;
}

/* 交替列底色 */
.project-table tbody tr:nth-child(even) td {
  background-color: #eee; /* 偶數行淡灰底 */
}

.project-table th {
  background-color: #ddd;
  border-bottom: 2px solid #ccc;
}


/* 分頁區域置中 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 8px;
}

/* 分頁按鈕樣式 */
.pagination button {
  padding: 6px 12px;
  border: 1px solid #aaa;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.pagination button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.pagination button:hover {
  background-color: #e0e0e0;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保在最上層 */
}

.modal-card {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 80%;
  box-shadow: -2px 0 10px rgba(0,0,0,0.3);
  position: relative;
  max-height: 80vh; /* 限制最大高度不超過視窗高度 */
  overflow-y: auto; /* 超出時可滾動 */
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

</style>

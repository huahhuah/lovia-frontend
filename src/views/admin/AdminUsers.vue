<template>
  <div class="admin-container">
    <h2 class="page-title">使用者資料管理</h2>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>帳號</th>
            <th>使用者名稱</th>
            <th>聯絡電話</th>
            <th>生日</th>
            <th>性別</th>
            <th>權限</th>
            <th>會員狀態</th>
            <th>查看詳情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.account">
            <td>{{ user.account }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.phone || '-' }}</td>
            <td>{{ user.birthday || '-' }}</td>
            <td>{{ user.gender || '-' }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
            <td>
              <button class="action-btn" @click="viewDetails(user)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button 
        v-for="n in totalPages" 
        :key="n" 
        :class="{active: n === currentPage}"
        @click="changePage(n)"
      >{{ n }}</button>
    </div>

    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-card">
        <button class="close-btn" @click="closeDetailModal"> ❌ </button>
        <h3>會員詳細資料</h3>
        <ul class="detail-list">
          <li><strong>帳號：</strong>{{ selectedUser.account }}</li>
          <li><strong>會員名稱：</strong>{{ selectedUser.username }}</li>
          <li><strong>會員ID：</strong>{{ selectedUser.id }}</li>
          <li><strong>電話：</strong>{{ selectedUser?.phone || '-' }}</li>
          <li><strong>生日：</strong>{{ selectedUser?.birthday || '-' }}</li>
          <li><strong>性別：</strong>{{ selectedUser?.gender?.gender || '-' }}</li>
          <li><strong>註冊時間：</strong>{{ selectedUser.created_at }}</li>
          <li><strong>前次登入時間：</strong>{{ selectedUser?.last_login || '-' }}</li>
          <li><strong>角色：</strong>{{ selectedUser.role.role_type }}</li>
          <li><strong>帳號狀態：</strong>{{ selectedUser.status.status }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { allUsers as getUsers } from '@/api/admin'
import axios from 'axios'

const userStore = useUserStore()
const users = ref([])
const currentPage = ref(1) // 建立可追蹤變數，起始值為1，故預設第1頁
const totalPages = ref(1)
const showDetailModal = ref(false)
const selectedUser = ref(null)

async function getAllUsers( page = 1){
  try {
    const token = userStore.token
    const res = await getUsers(token, page)
    const result = res.data.data.result

    users.value = result.data
    totalPages.value = result.pagination.totalPages
    currentPage.value = result.pagination.currentPage
  } catch (err) {
    console.error('載入失敗', err)
  }
}

async function viewDetails (user){
  try{
    const token = userStore.token
    const res = await axios.get(`https://lovia-backend-xl4e.onrender.com/api/v1/admins/users/${user.id}`,
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )
    selectedUser.value = res.data.data
    showDetailModal.value = true
  } catch (err){
    console.error('載入失敗', err)
  }
}

async function closeDetailModal (){
  showDetailModal.value = false
  selectedUser.value = null  
}

onMounted(() => {
  getAllUsers()
})

const changePage = (page) =>{
  if (page >= 1 && page <= totalPages.value){
    getAllUsers(page)
  }
}
</script>

<style scoped>
.admin-container {
  padding: 4rem;
  max-width: 100%;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}

.user-table thead {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ccc;
}

.user-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.action-btn {
  padding: 4px 8px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #0056b3;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
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
  inset: 0;
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
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.detail-list {
  margin-top: 1rem;
  list-style: none;
  padding: 0;
}

.detail-list li {
  padding: 4px 0;
}

.user-table td:nth-child(1), /* 帳號 */
.user-table td:nth-child(2) { /* 使用者名稱或信箱 */
  word-break: break-all; /* 自動斷行 */
  max-width: 200px; /* 設定最大寬度 */
  white-space: normal;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 2rem 1rem;
  }

  .table-wrapper {
    box-shadow: none;
    border-radius: 0;
  }

  .user-table,
  .user-table thead,
  .user-table tbody,
  .user-table th,
  .user-table td,
  .user-table tr {
    display: block;
    width: 100%;
  }

  .user-table thead tr {
    display: none;
  }

  .user-table tbody tr {
    margin-bottom: 1rem;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    padding: 1rem;
    border-radius: 6px;
  }

  .user-table td {
    position: relative;
    padding-left: 50%;
    text-align: left;
    white-space: normal;
    word-break: break-word;
    font-size: 14px;
  }

  .user-table td::before {
    position: absolute;
    top: 12px;
    left: 16px;
    width: 45%;
    font-weight: bold;
    white-space: nowrap;
  }

  .user-table td:nth-child(1)::before { content: "帳號"; }
  .user-table td:nth-child(2)::before { content: "使用者名稱"; }
  .user-table td:nth-child(3)::before { content: "聯絡電話"; }
  .user-table td:nth-child(4)::before { content: "生日"; }
  .user-table td:nth-child(5)::before { content: "性別"; }
  .user-table td:nth-child(6)::before { content: "權限"; }
  .user-table td:nth-child(7)::before { content: "會員狀態"; }
  .user-table td:nth-child(8)::before { content: "查看詳情"; }

  .action-btn {
    width: 100%;
    margin-top: 0.5rem;
    font-size: 14px;
  }
}
</style>

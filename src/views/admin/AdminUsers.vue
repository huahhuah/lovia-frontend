<template>
  <div class="container py-5">
    <h1 class="mb-4">管理員後台</h1>
    <p>這是只有管理員才能看到的內容。</p>
    <table border="1" style="width: 100%" class="user-table">
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
          <td><button @click="viewDetails(user)">🔍</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination mt-3">
    <button 
    v-for="n in totalPages" 
    :key="n" 
    :class="{active: n === currentPage}"
    @click="changePage(n)">{{ n }}</button>
  </div>
  <div v-if="showDetailModal" class="modal-overlay">
    <div class="modal-card">
      <button class="close-btn" @click="closeDetailModal"> ❌ </button>
      <h2>會員詳細資料</h2>
      <p><strong>帳號：</strong>{{selectedUser.account}}</p>
      <p><strong>會員名稱：</strong>{{selectedUser.username}}</p>
      <p><strong>會員ID：</strong>{{selectedUser.id}}</p>
      <p><strong>電話：</strong>{{selectedUser?.phone || '-'}}</p>
      <p><strong>生日：</strong>{{selectedUser?.birthday || '-'}}</p>
      <p><strong>性別：</strong>{{selectedUser?.gender?.gender || '-'}}</p>
      <p><strong>註冊時間：</strong>{{selectedUser.created_at}}</p>
      <p><strong>前次登入時間：</strong>{{selectedUser?.last_login || '-'}}</p>
      <p><strong>角色：</strong>{{selectedUser.role.role_type}}</p>
      <p><strong>帳號狀態：</strong>{{selectedUser.status.status}}</p>
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
.user-table th, .user-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: none; /* 先不設底線 */
  background-color: #fff;
}

/* 交替列底色 */
.user-table tbody tr:nth-child(even) td {
  background-color: #eee; /* 偶數行淡灰底 */
}

.user-table th {
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
  max-width: 600px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  position: relative;
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
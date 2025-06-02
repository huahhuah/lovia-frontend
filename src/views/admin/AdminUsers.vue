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
          <td><button @click="viewDetails(user)">圖示?!</button></td>
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
</template>

<script setup>
import { useUserStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { allUsers as getUsers } from '@/api/admin'

const userStore = useUserStore()
const users = ref([])
const currentPage = ref(1) // 建立可追蹤變數，起始值為1，故預設第1頁
const totalPages = ref(1)

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

onMounted(() => {
  getAllUsers()
})

const changePage = (page) =>{
  if (page >= 1 && page <= totalPages.value){
    getAllUsers(page)
  }
}

const viewDetails = (user) => {
  console.log('查看詳情，我還沒寫', user)
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
</style>
<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <h2 class="text-xl font-bold mb-4">申請資料審核</h2>

    <div
      v-for="(item, index) in paginatedData"
      :key="item.user_id"
      class="bg-white p-4 mb-2 rounded border"
    >
      <p><strong>申請人：</strong>{{ item.user.username }}</p>
      <p>
        <strong>勸募許可網址：</strong>
        <a :href="item.url" class="text-blue-600 underline" target="_blank">{{ item.url }}</a>
      </p>
      <p>
        <strong>活動專戶：</strong>
        <span v-html="formatFundingAccount(item.funding_account)"></span>
      </p>

      <label class="block mt-2">
        <strong>審核狀態：</strong>
        <select v-model="item.selectedStatus" class="border rounded p-1">
          <option value="1">審核中</option>
          <option value="2">准許</option>
          <option value="3">駁回</option>
        </select>
      </label>
      <p>
        <strong>駁回理由：</strong>
        <textarea v-model="item.reason" class="w-full border rounded p-1 mt-1" placeholder="請輸入駁回理由"></textarea>
      </p>
    </div>

    <!-- 頁碼與送出按鈕同一排 -->
    <div class="pagination-container">
      <div class="pagination">
        <button
          v-for="n in totalPages"
          :key="n"
          :class="{ active: n === currentPage }"
          @click="changePage(n)"
        >
          {{ n }}
        </button>
      </div>

      <button @click="submitReview" class="submit-btn">
        確認送出
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const allData = ref([])
const paginatedData = ref([])

const currentPage = ref(1)
const perPage = 10

const formatFundingAccount = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

const totalPages = computed(() =>
  Math.ceil(allData.value.length / perPage)
)

const updatePaginatedData = () => {
  const start = (currentPage.value - 1) * perPage
  paginatedData.value = allData.value.slice(start, start + perPage)
}

const submitReview = () => {
  const token = localStorage.getItem('token')
  const payload = allData.value.map(item => ({
    user_id: item.user_id,
    new_status: item.selectedStatus,
    reason: item.reason || null,
  }))
  console.log("送出 PATCH payload:", payload)
  axios.patch('https://lovia-backend-xl4e.onrender.com/api/v1/admins/proposerStatus',
  payload,
  {
    headers:{
      Authorization: `Bearer ${token}`,
    }
  }).then(response => {
    console.log('更新成功', response.data)
  }).catch(error =>{
    console.log('更新失敗', error)
  })
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token') 
    const res = await axios.get('https://lovia-backend-xl4e.onrender.com/api/v1/admins/proposerApplication', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const fetched = res.data.data || []
    allData.value = fetched
      .map(item => ({
        ...item,
        selectedStatus: String(item.proposerStatuses?.id || "1"),
      }))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    updatePaginatedData()
  } catch (err) {
    console.error('取得申請資料失敗', err)
  }
})
</script>

<style scoped>
/* 分頁區域置中，並且送出按鈕靠右 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

/* 分頁按鈕樣式 */
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

/* 送出按鈕 */
.submit-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>

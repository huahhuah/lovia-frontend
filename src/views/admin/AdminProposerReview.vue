<template>
  <div class="container py-5">
    <div class="w-full mx-auto p-4 bg-gray-100 min-h-screen">
      <h2 class="text-xl font-bold mb-4">申請資料審核</h2>

      <div
        v-for="(item, index) in paginatedData"
        :key="item.user_id"
        class="bg-white p-4 mb-2 rounded border w-full"
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

        <div class="mt-4">
          <label class="block font-semibold mb-1">審核狀態：</label>
          <select v-model="item.selectedStatus" class="w-full border rounded p-1">
            <option value="1">審核中</option>
            <option value="2">准許</option>
            <option value="3">駁回</option>
          </select>
        </div>

        <div class="mt-4" v-if="item.selectedStatus === '3'">
          <label class="block font-semibold mb-1">駁回理由：</label>
          <input
            type="text"
            v-model="item.reason"
            class="w-full border rounded p-1"
            placeholder="請輸入駁回理由"
            style="width: 80%"
          />
        </div>
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

        <button @click="submitReview" class="submit-btn">確認送出</button>
      </div>
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

const totalPages = computed(() => Math.ceil(allData.value.length / perPage))

const updatePaginatedData = () => {
  const start = (currentPage.value - 1) * perPage
  paginatedData.value = allData.value.slice(start, start + perPage)
}

const submitReview = () => {
  const token = localStorage.getItem('token')
  const payload = allData.value.map((item) => ({
    user_id: item.user_id,
    new_status: item.selectedStatus,
    reason: item.reason || null,
  }))
  axios
    .patch('https://lovia-backend-xl4e.onrender.com/api/v1/admins/proposerStatus', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log('更新成功', response.data)
      alert('審核完成，資料已更新')
    })
    .catch((error) => {
      console.log('更新失敗', error)
      alert('更新失敗，請稍後再試')
    })
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(
      'https://lovia-backend-xl4e.onrender.com/api/v1/admins/proposerApplication',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const fetched = res.data.data || []
    allData.value = fetched
      .map((item) => ({
        ...item,
        selectedStatus: String(item.proposerStatuses?.id || '1'),
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

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .pagination {
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  .submit-btn {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    padding: 14px;
    border-radius: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    margin-top: 16px;
  }

  .submit-btn:hover {
    background-color: #0056b3;
  }

  /* 卡片排版調整 */
  .bg-white.p-4 {
    padding: 1.25rem !important;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;
  }

  p, label {
    font-size: 15px;
  }

  select,
  input[type='text'] {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-top: 6px;
    margin-bottom: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  a {
    word-break: break-word;
    font-size: 14px;
  }

  /* label 與欄位間距一致 */
  .mt-4 {
    margin-top: 1rem;
  }

  /* 單獨讓駁回理由更清楚 */
  input[placeholder="請輸入駁回理由"] {
    background-color: #f9f9f9;
  }
}
</style>
<template>
  <div class="container py-5">
    <h2 class="mb-4">步驟 1 / 2：發起提案</h2>

    <form @submit.prevent="submitForm">
      <!-- 專案標題 -->
      <div class="mb-3">
        <label class="form-label">專案標題</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <!-- 分類 -->
      <div class="mb-3">
        <label class="form-label">分類</label>
        <select v-model.number="form.category_id" class="form-select" required>
          <option disabled value="">請選擇分類</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- 金額與時間 -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">目標金額</label>
          <input v-model.number="form.total_amount" type="number" class="form-control" required />
        </div>
        <div class="col-md-3">
          <label class="form-label">開始時間</label>
          <input v-model="form.start_time" type="date" class="form-control" required />
        </div>
        <div class="col-md-3">
          <label class="form-label">結束時間</label>
          <input v-model="form.end_time" type="date" class="form-control" required />
        </div>
      </div>

      <!-- 封面圖 -->
      <div class="mb-3">
        <label class="form-label">封面圖片網址</label>
        <input v-model="form.cover" type="text" class="form-control" />
      </div>

      <!-- 摘要 -->
      <div class="mb-3">
        <label class="form-label">摘要</label>
        <textarea v-model="form.summary" class="form-control" rows="3" required></textarea>
      </div>

      <!-- 完整內容 -->
      <div class="mb-3">
        <label class="form-label">完整內容</label>
        <textarea v-model="form.full_content" class="form-control" rows="5" required></textarea>
      </div>

      <!-- 提案團隊 -->
      <div class="mb-3">
        <label class="form-label">提案團隊</label>
        <input v-model="form.project_team" type="text" class="form-control" />
      </div>

      <!-- 常見問答 -->
      <div class="mb-3">
        <label class="form-label">常見問答</label>
        <textarea v-model="form.faq" class="form-control" rows="3"></textarea>
      </div>

      <!-- 下一步按鈕 -->
      <div class="text-center mt-4">
        <button type="submit" class="btn btn-danger px-5 py-2">下一步：填寫回饋方案</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { projectAPI } from '@/api/project' // ✅ 改這裡

const router = useRouter()

// 分類選項（靜態）
const categories = [
  { id: 1, name: '人文' },
  { id: 2, name: '環境' },
  { id: 3, name: '動物' },
  { id: 4, name: '醫療' },
  { id: 5, name: '救援' },
]

// 表單資料
const form = reactive({
  title: '',
  category_id: null,
  total_amount: null,
  start_time: '',
  end_time: '',
  cover: '',
  summary: '',
  full_content: '',
  project_team: '',
  faq: '',
})

// 送出表單
async function submitForm() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('未登入或 token 遺失')
      return
    }

    const res = await projectAPI.create(form, token) // 使用模組化函式
    const newProjectId = res.data.data?.project_id

    if (!newProjectId) {
      alert('建立成功但未取得專案 ID')
      return
    }

    alert('專案建立成功，請繼續填寫回饋方案')
    router.push(`/projects/${newProjectId}/plans`)
  } catch (err) {
    console.error('建立專案失敗', err)
    alert('建立專案失敗，請確認欄位是否填寫完整')
  }
}
</script>

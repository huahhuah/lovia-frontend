<template>
  <div class="project-form">
    <h2>新增專案</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>標題</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div>
        <label>摘要</label>
        <textarea v-model="form.summary" required />
      </div>

      <div>
        <label>分類 ID</label>
        <input v-model.number="form.category_id" type="number" required />
      </div>

      <div>
        <label>目標金額</label>
        <input v-model.number="form.total_amount" type="number" required />
      </div>

      <div>
        <label>開始時間</label>
        <input v-model="form.start_time" type="date" required />
      </div>

      <div>
        <label>結束時間</label>
        <input v-model="form.end_time" type="date" required />
      </div>

      <div>
        <label>封面圖片網址</label>
        <input v-model="form.cover" type="text" />
      </div>

      <div>
        <label>完整內容</label>
        <textarea v-model="form.full_content" />
      </div>

      <div>
        <label>提案團隊</label>
        <textarea v-model="form.project_team" />
      </div>

      <div>
        <label>常見問答</label>
        <textarea v-model="form.faq" />
      </div>

      <button type="submit">送出專案</button>
    </form>
  </div>
</template>

<script>
import { createProject } from '@/api/project'
import { useUserStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'ProjectForm',
  data() {
    return {
      form: {
        user_id: '',
        title: '',
        summary: '',
        category_id: 1,
        total_amount: 1000,
        start_time: '',
        end_time: '',
        cover: '',
        full_content: '',
        project_team: '',
        faq: '',
        plans: [],
      },
    }
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    return { userStore, router }
  },
  methods: {
    async submitForm() {
      try {
        this.form.user_id = this.userStore.user?.id
        const res = await createProject(this.form, this.userStore.token)
        console.log('專案成功', res.data)
        alert('專案建立成功！')

        // 跳轉到 ProjectPlan 頁面並傳遞資料
        this.$router.push({
          name: 'ProjectPlan',
          params: { id: res.data.id }, // res.data.id 是從創建專案後返回的專案 ID
        })
      } catch (err) {
        console.error('專案失敗', err.response?.data || err)
        alert('專案失敗：' + (err.response?.data?.message || err.message))
      }
    },
  },
}
</script>

<style scoped>
.project-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}
.project-form form > div {
  margin-bottom: 1rem;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #1d4ed8;
}
</style>

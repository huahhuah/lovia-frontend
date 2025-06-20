<template>
  <div class="my-questions">
    <h2 class="section-title">我的全部提問</h2>

    <div v-if="error" class="loading" style="color: red">{{ error }}</div>
    <div v-else-if="loading" class="loading">讀取中...</div>
    <div v-else>
      <div v-if="questions.length === 0" class="no-projects">目前沒有任何提問。</div>
      <div v-else class="card-wrapper">
        <div class="table-card">
          <table class="project-table">
            <thead>
              <tr>
                <th>提問內容</th>
                <th>專案名稱</th>
                <th>提問時間</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in questions" :key="question.comment_id">
                <td>{{ question.content }}</td>
                <td>
                  <router-link
                    v-if="question.project"
                    :to="`/projects/${question.project.id}`"
                    class="project-link"
                  >
                    {{ question.project.title }}
                  </router-link>
                  <span v-else>無專案資料</span>
                </td>
                <td>{{ new Date(question.created_at).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MyQuestions',
  data() {
    return {
      questions: [],
      loading: false,
      error: null,
    }
  },
  methods: {
    async fetchQuestions() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/api/v1/projects/my-questions', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.status) {
          this.questions = res.data.data
        } else {
          this.error = res.data.message || '取得提問失敗'
        }
      } catch (err) {
        this.error = '取得提問發生錯誤'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.fetchQuestions()
  },
}
</script>

<style scoped>
.my-questions {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  margin-left: 18px;
  text-align: left;
}

.loading,
.no-projects {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.card-wrapper {
  display: flex;
  justify-content: center;
}

.table-card {
  background: transparent;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;
}

.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.project-table th {
  background-color: #ffd2cf;
  white-space: nowrap;
  font-weight: 600;
  color: #333;
}

.project-table th,
.project-table td {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  text-align: left;
  vertical-align: middle;
}

.project-table tbody tr:hover {
  background-color: #f8f9fa;
}

/* 專案名稱連結樣式 */
.project-link {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.project-link:hover {
  text-decoration: underline;
}
</style>

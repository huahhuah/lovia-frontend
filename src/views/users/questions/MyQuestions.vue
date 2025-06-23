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
                <th>回覆狀態</th>
                <th>提問時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="question in questions" :key="question.comment_id">
                <!-- 提問列 -->
                <tr>
                  <td class="question-content">{{ question.content }}</td>
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
                  <td>
                    <span :class="['status-badge', hasReply(question) ? 'replied' : 'pending']">
                      {{ hasReply(question) ? '已回覆' : '待回覆' }}
                    </span>
                  </td>
                  <td>{{ new Date(question.created_at).toLocaleString() }}</td>
                  <td>
                    <button
                      @click="toggleReply(question.comment_id)"
                      class="toggle-btn"
                      v-if="hasReply(question)"
                    >
                      {{ expandedReplies.includes(question.comment_id) ? '隱藏回覆' : '查看回覆' }}
                    </button>
                  </td>
                </tr>

                <!-- 回覆列 -->
                <tr
                  v-if="expandedReplies.includes(question.comment_id) && hasReply(question)"
                  :key="`reply-${question.comment_id}`"
                  class="reply-row"
                >
                  <td colspan="5" class="reply-content">
                    <div class="reply-wrapper">
                      <h4 class="reply-title">回覆內容：</h4>
                      <div class="reply-text">
                        {{ getReplyContent(question) }}
                      </div>
                      <div class="reply-time" v-if="getReplyTime(question)">
                        回覆時間：{{ new Date(getReplyTime(question)).toLocaleString() }}
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'

export default {
  name: 'MyQuestions',
  data() {
    return {
      questions: [],
      loading: false,
      error: null,
      expandedReplies: [], // 記錄展開的回覆
    }
  },
  methods: {
    async fetchQuestions() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${BASE_URL}/projects/my-questions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.status) {
          this.questions = res.data.data.filter((q) => q.project !== null)
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
    hasReply(question) {
      return question.reply_content !== null && question.reply_content !== ''
    },
    getReplyContent(question) {
  console.log('回覆內容檢查', {
    comment_id: question.comment_id,
    reply_content: question.reply_content,
  })
  return question.reply_content || '無回覆內容'
},
    getReplyTime(question) {
      return question.reply_at || null
    },
    toggleReply(commentId) {
      const index = this.expandedReplies.indexOf(commentId)
      if (index > -1) {
        this.expandedReplies.splice(index, 1)
      } else {
        this.expandedReplies.push(commentId)
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
  background: linear-gradient(135deg, #fc7d9d05, #ffc44305);
  min-height: 100vh;
}

.section-title {
  font-size: 16px;
  font-weight: 400;
  color: black;
  margin-left: 18px;
  text-align: left;
  margin-bottom: 30px;
}

.loading,
.no-projects {
  text-align: center;
  padding: 40px;
  color: #fc7d9d;
  font-size: 18px;
  font-weight: 500;
  background: rgba(255, 196, 67, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(252, 125, 157, 0.3);
}

.card-wrapper {
  display: flex;
  justify-content: center;
}

.table-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  padding: 2rem;
  border-radius: 20px;
  box-shadow:
    0 10px 30px rgba(252, 125, 157, 0.15),
    0 5px 15px rgba(255, 196, 67, 0.1);
  width: 100%;
  overflow-x: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 125, 157, 0.2);
}

.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border-radius: 15px;
  overflow: hidden;
}

.project-table th {
  background:  rgba(252, 91, 83, 0.4);
  color: rgba(95, 99, 104, 1);
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 1px ;
  position: relative;
}

.project-table th::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
}

.project-table th,
.project-table td {
  padding: 16px 12px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid rgba(252, 125, 157, 0.1);
}

.project-table tbody tr {
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.project-table tbody tr:nth-child(even) {
  background: rgba(255, 196, 67, 0.05);
}

.project-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(252, 125, 157, 0.1), rgba(255, 196, 67, 0.1));
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(252, 125, 157, 0.2);
}

/* 專案名稱連結樣式 */
.project-link {
  color: blue;
  text-decoration: none;
  cursor: pointer;
  font-weight: 400;
  position: relative;
  transition: all 0.3s ease;
}

.project-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #fc7d9d, #ffc443);
  transition: width 0.3s ease;
}

.project-link:hover {
  color: rgba(26, 26, 26, 0.4);
  transform: translateY(-1px);
}

.project-link:hover::after {
  width: 100%;
}

/* 狀態標籤樣式 */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  min-width: 60px;
}

.status-badge.replied {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.status-badge.pending {
  background: linear-gradient(135deg, #ff9800, #ffb74d);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

/* 按鈕樣式 */
.toggle-btn {
  background: black;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(252, 125, 157, 0.3);
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(252, 125, 157, 0.4);
}

/* 回覆內容樣式 */
.reply-row {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.05),
    rgba(129, 199, 132, 0.05)
  ) !important;
}

.reply-content {
  padding: 0 !important;
}

.reply-wrapper {
  padding: 20px;
  margin: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  border-left: 4px solid #4caf50;
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.1);
}

.reply-title {
  color: #4caf50;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.reply-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 8px;
}

.reply-time {
  font-size: 12px;
  color: #666;
  text-align: right;
}

/* 問題內容樣式 */
.question-content {
  max-width: 250px;
  word-wrap: break-word;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .section-title {
    font-size: 24px;
    margin-left: 10px;
  }

  .table-card {
    padding: 1rem;
    margin: 0 10px;
  }

  .project-table th,
  .project-table td {
    padding: 12px 8px;
    font-size: 14px;
  }

  .question-content {
    max-width: 200px;
  }
}

/* 載入動畫 */
.loading {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* 表格內容樣式優化 */
.project-table td {
  color: #333;
  font-weight: 500;
}
</style>

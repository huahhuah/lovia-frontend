<template>
  <div class="question-management">
    <div class="container py-5">
      <h2 class="page-title">提問管理</h2>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>載入中...</p>
      </div>

      <div v-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
      </div>

      <div v-if="!loading && questions.length === 0" class="no-data-container">
        <div class="no-data-icon">💬</div>
        <p>目前沒有任何提問</p>
        <small>當有用戶對您的專案提問時，會顯示在這裡</small>
      </div>

      <div v-if="questions.length > 0" class="questions-container">
        <div class="questions-grid">
          <div v-for="q in questions" :key="q.id" class="question-card" :class="{ 'has-reply': q.reply }">
            <div class="question-card-header">
              <div class="project-badge">
                <span class="project-icon">🎯</span>
                {{ q.project?.title }}
              </div>
              <div class="header-right">
                <div v-if="q.reply" class="reply-status-badge">
                  <span class="status-icon">✅</span>
                  已回覆
                </div>
                <div v-else class="reply-status-badge pending">
                  <span class="status-icon">⏳</span>
                  待回覆
                </div>
                <div class="question-time">
                  {{ new Date(q.created_at).toLocaleString() }}
                </div>
              </div>
            </div>

            <div class="question-card-body">
              <div class="questioner-info">
                <div class="questioner-avatar">
                  {{ (q.user?.name || q.user?.email || '匿名')[0].toUpperCase() }}
                </div>
                <div class="questioner-details">
                  <strong>{{ q.user?.name || q.user?.email || '匿名' }}</strong>
                  <small>提問者</small>
                </div>
              </div>

              <div class="question-content">
                <div class="content-label">提問內容</div>
                <p>{{ q.comment || q.content || '無內容' }}</p>
              </div>

              <!-- 顯示回覆內容 -->
              <div v-if="q.reply" class="reply-content">
                <div class="content-label">您的回覆</div>
                <div class="reply-text">
                  <div class="reply-avatar">
                    <span class="reply-icon">👤</span>
                  </div>
                  <div class="reply-body">
                    <div class="reply-meta">
                      <strong>您的回覆</strong>
                      <small>{{ new Date(q.reply.created_at).toLocaleString() }}</small>
                    </div>
                    <p>{{ q.reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="question-card-footer">
              <button
                v-if="!q.reply"
                class="reply-btn"
                @click="openReplyModal(q)"
              >
                <span class="reply-icon">💬</span>
                回覆提問
              </button>
              <button
                v-else
                class="reply-btn replied"
                @click="openReplyModal(q)"
              >
                <span class="reply-icon">✏️</span>
                修改回覆
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        class="custom-modal"
        :class="{ 'modal-show': showModal }"
        v-if="showModal"
        @click.self="closeReplyModal"
      >
        <div class="modal-container">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <span class="modal-icon">💬</span>
                {{ currentQuestion?.reply ? '修改回覆' : '回覆提問' }}
              </h5>
              <button type="button" class="modal-close-btn" @click="closeReplyModal">
                <span>✕</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="question-summary">
                <div class="summary-item">
                  <span class="summary-label">專案</span>
                  <span class="summary-value">{{ currentQuestion?.project?.title }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">提問內容</span>
                  <div class="summary-content">{{ currentQuestion?.comment || currentQuestion?.content }}</div>
                </div>

                <!-- 顯示目前的回覆（如果有的話） -->
                <div v-if="currentQuestion?.reply" class="summary-item">
                  <span class="summary-label">目前回覆</span>
                  <div class="current-reply">{{ currentQuestion.reply.content }}</div>
                </div>
              </div>

              <div class="reply-input-container">
                <label class="reply-label">
                  {{ currentQuestion?.reply ? '修改您的回覆' : '您的回覆' }}
                </label>
                <textarea
                  v-model="replyContent"
                  rows="4"
                  class="reply-textarea"
                  placeholder="請輸入您的回覆內容..."
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" @click="closeReplyModal">取消</button>
              <button class="btn-submit" @click="submitReply">
                <span class="submit-icon">📤</span>
                {{ currentQuestion?.reply ? '更新回覆' : '送出回覆' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()
const BASE_URL = 'https://lovia-backend-xl4e.onrender.com/api/v1'
const questions = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const currentQuestion = ref(null)
const replyContent = ref('')

async function loadQuestions() {
  loading.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${BASE_URL}/projects/my-projects/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.data.status) {
      questions.value = res.data.data
        .filter(q => q.project !== null)
        .map(q => ({
          ...q,
          id: q.comment_id,
          reply: q.reply_content
            ? {
                content: q.reply_content,
                at: q.reply_at,
              }
            : null,
        }))
    } else {
      error.value = res.data.message || '讀取資料失敗'
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || '發生錯誤'
  } finally {
    loading.value = false
  }
}

function openReplyModal(question) {
  currentQuestion.value = question
  // 如果已有回覆，預填入現有內容
  replyContent.value = question.reply ? question.reply.content : ''
  showModal.value = true
}

function closeReplyModal() {
  showModal.value = false
  currentQuestion.value = null
  replyContent.value = ''
}

async function submitReply() {
  if (!replyContent.value.trim()) {
    alert('請輸入回覆內容')
    return
  }
  try {
    const token = localStorage.getItem('token')
    const endpoint = `${BASE_URL}/projects/comments/${currentQuestion.value.id}/reply`

await axios.post(
  endpoint,
  { content: replyContent.value },
  { headers: { Authorization: `Bearer ${token}` } }
)

    alert(currentQuestion.value.reply ? '回覆更新成功' : '回覆成功')
    closeReplyModal()
    loadQuestions()
  } catch (err) {
    alert(err.response?.data?.message || '操作失敗')
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.question-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef7f0 0%, #fdf2f8 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(252, 125, 157, 0.1);
}

/* Loading Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #FC7D9D;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(252, 125, 157, 0.2);
  border-top: 4px solid #FC7D9D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Styles */
.error-container {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 2px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  color: #dc2626;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* No Data Styles */
.no-data-container {
  background: linear-gradient(135deg, rgba(252, 125, 157, 0.05) 0%, rgba(255, 196, 67, 0.05) 100%);
  border: 2px dashed rgba(252, 125, 157, 0.3);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: #FC7D9D;
}

.no-data-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-data-container p {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.no-data-container small {
  color: rgba(252, 125, 157, 0.7);
  font-size: 14px;
}

/* Questions Container */
.questions-container {
  margin-top: 30px;
}

.questions-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
}

/* Question Card */
.question-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(252, 125, 157, 0.1);
  box-shadow:
    0 20px 40px rgba(252, 125, 157, 0.1),
    0 10px 20px rgba(255, 196, 67, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

.question-card.has-reply {
  border-left: 6px solid #10b981;
  box-shadow:
    0 20px 40px rgba(16, 185, 129, 0.1),
    0 10px 20px rgba(252, 125, 157, 0.05);
}

.question-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 30px 60px rgba(252, 125, 157, 0.15),
    0 15px 30px rgba(255, 196, 67, 0.1);
}

.question-card.has-reply:hover {
  box-shadow:
    0 30px 60px rgba(16, 185, 129, 0.15),
    0 15px 30px rgba(252, 125, 157, 0.1);
}

.question-card-header {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  padding: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.question-card.has-reply .question-card-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.project-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.project-icon {
  font-size: 18px;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.reply-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reply-status-badge.pending {
  background: rgba(255, 193, 7, 0.3);
  color: #fff3cd;
}

.status-icon {
  font-size: 14px;
}

.question-time {
  font-size: 12px;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
}

.question-card-body {
  padding: 24px;
}

.questioner-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(252, 125, 157, 0.1);
}

.questioner-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(252, 125, 157, 0.3);
}

.questioner-details strong {
  display: block;
  color: #2d3748;
  margin-bottom: 4px;
}

.questioner-details small {
  color: #718096;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.question-content {
  background: rgba(252, 125, 157, 0.02);
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid #FC7D9D;
  margin-bottom: 20px;
}

.content-label {
  font-size: 12px;
  font-weight: 600;
  color: #FC7D9D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.question-content p {
  margin: 0;
  line-height: 1.6;
  color: #2d3748;
}

/* Reply Content Styles */
.reply-content {
  background: rgba(16, 185, 129, 0.02);
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid #10b981;
}

.reply-content .content-label {
  color: #10b981;
}

.reply-text {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.reply-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.reply-body {
  flex: 1;
}

.reply-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-meta strong {
  color: #10b981;
  font-size: 14px;
}

.reply-meta small {
  color: #6b7280;
  font-size: 12px;
}

.reply-body p {
  margin: 0;
  line-height: 1.6;
  color: #2d3748;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.question-card-footer {
  padding: 20px 24px;
  background: rgba(252, 125, 157, 0.02);
  border-top: 1px solid rgba(252, 125, 157, 0.1);
}

.question-card.has-reply .question-card-footer {
  background: rgba(16, 185, 129, 0.02);
  border-top: 1px solid rgba(16, 185, 129, 0.1);
}

.reply-btn {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(252, 125, 157, 0.3);
  position: relative;
  overflow: hidden;
}

.reply-btn.replied {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.reply-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.reply-btn:hover::before {
  left: 100%;
}

.reply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(252, 125, 157, 0.4);
}

.reply-btn.replied:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.reply-icon {
  font-size: 16px;
}

/* Modal Styles */
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal-show {
  opacity: 1;
  visibility: visible;
}

.modal-container {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.modal-show .modal-container {
  transform: translateY(0);
}

.modal-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 24px;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 32px;
}

.question-summary {
  background: rgba(252, 125, 157, 0.03);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(252, 125, 157, 0.1);
}

.summary-item {
  margin-bottom: 16px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #FC7D9D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  background: rgba(252, 125, 157, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.summary-value {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-top: 8px;
}

.summary-content {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #FC7D9D;
  margin-top: 8px;
  line-height: 1.6;
  color: #2d3748;
}

.current-reply {
  background: rgba(16, 185, 129, 0.05);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #10b981;
  margin-top: 8px;
  line-height: 1.6;
  color: #2d3748;
  font-style: italic;
}

.reply-input-container {
  margin-top: 24px;
}

.reply-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.reply-textarea {
  width: 100%;
  border: 2px solid rgba(252, 125, 157, 0.2);
  border-radius: 16px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  background: rgba(252, 125, 157, 0.02);
}

.reply-textarea:focus {
  outline: none;
  border-color: #FC7D9D;
  box-shadow: 0 0 0 3px rgba(252, 125, 157, 0.1);
  background: white;
}

.modal-footer {
  padding: 24px 32px;
  background: rgba(252, 125, 157, 0.02);
  border-top: 1px solid rgba(252, 125, 157, 0.1);
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: 2px solid rgba(252, 125, 157, 0.3);
  color: #FC7D9D;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(252, 125, 157, 0.1);
  border-color: #FC7D9D;
}

.btn-submit {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(252, 125, 157, 0.3);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(252, 125, 157, 0.4);
}

.submit-icon {
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }

  .page-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .questions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .question-card-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-right {
    align-items: flex-start;
    width: 100%;
  }

  .question-card-body {
    padding: 20px;
  }

  .questioner-info {
    gap: 12px;
  }

  .questioner-avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .reply-text {
    flex-direction: column;
    gap: 12px;
  }

  .modal-container {
    width: 95%;
    margin: 20px;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 20px 24px;
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
    justify-content: center;
  }
}

/* Custom Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: rgba(252, 125, 157, 0.1);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FC7D9D 0%, #FFC443 100%);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e91e63 0%, #f59e0b 100%);
}
</style>

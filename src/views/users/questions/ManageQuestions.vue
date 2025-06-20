<template>
  <div class="container py-5">
    <h2>提問管理</h2>

    <div v-if="loading">載入中...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>
    <div v-if="!loading && questions.length === 0">目前沒有任何提問</div>

    <ul v-if="questions.length > 0" class="list-group">
      <li v-for="q in questions" :key="q.id" class="list-group-item">
        <strong>專案：</strong> {{ q.project?.title }}<br />
        <strong>提問者：</strong> {{ q.user?.name || q.user?.email || '匿名' }}<br />
        <strong>提問內容：</strong> {{ q.comment || q.content || '無內容' }}<br />
        <small class="text-muted">提問時間：{{ new Date(q.created_at).toLocaleString() }}</small>

        <button
          class="btn btn-outline-primary btn-sm mt-2"
          @click="openReplyModal(q)"
        >
          回覆提問
        </button>
      </li>
    </ul>

    <!-- Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      style="display: block;"
      v-if="showModal"
      @click.self="closeReplyModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">回覆提問</h5>
            <button type="button" class="btn-close" @click="closeReplyModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>專案：</strong> {{ currentQuestion.project?.title }}</p>
            <p><strong>提問內容：</strong> {{ currentQuestion.comment || currentQuestion.content }}</p>

            <textarea
              v-model="replyContent"
              rows="4"
              class="form-control"
              placeholder="請輸入回覆內容"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeReplyModal">取消</button>
            <button class="btn btn-primary" @click="submitReply">送出回覆</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

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
  replyContent.value = ''
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
    await axios.post(
      `${BASE_URL}/projects/comments/${currentQuestion.value.id}/reply`,
      { content: replyContent.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert('回覆成功')
    closeReplyModal()
    loadQuestions()
  } catch (err) {
    alert(err.response?.data?.message || '回覆失敗')
  }
}

onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  margin-top: 10vh;
}
</style>

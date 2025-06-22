<template>
  <div class="qna-wrapper">
    <!-- 🟢 提問區 -->
    <div v-if="props.isLogin" class="comment-box border p-4 mb-4 rounded-4">
      <div class="d-flex mb-2">
        <!-- 使用者大頭貼 -->
        <img
          :src="user?.avatar_url || '/default-avatar.png'"
          alt="使用者頭像"
          class="rounded-circle me-3"
          style="width: 44px; height: 44px; object-fit: cover"
        />
        <!-- textarea -->
        <textarea
          v-model="newQuestion"
          placeholder="有任何疑問想更了解的細節嗎？歡迎留言提問！"
          class="form-control"
          rows="3"
        ></textarea>
      </div>
      <div class="text-end">
        <button class="btn btn-dark rounded-pill px-4" @click="handleSubmit">提問</button>
      </div>
    </div>

    <!-- 🔵 問與答列表 -->
    <div class="qa-card border rounded-4 p-4 mb-4" v-for="qa in questions" :key="qa.id">
      <!-- 提問者 -->
      <div class="qa-question mb-3">
        <div class="d-flex align-items-center mb-1">
          <img
            :src="qa.userAvatar || '/default-avatar.png'"
            class="rounded-circle me-2"
            style="width: 36px; height: 36px; object-fit: cover"
          />
          <strong>{{ qa.userName }}</strong>
          <small class="text-muted ms-auto">{{ qa.date }}</small>
        </div>
        <p class="mb-0">{{ qa.content }}</p>
      </div>

      <!-- 回覆 -->
      <div class="qa-reply mt-3" v-for="reply in qa.replies" :key="reply.id">
        <div class="d-flex align-items-center mb-1">
          <img
            v-if="reply.avatar_url"
            :src="reply.avatar_url"
            class="rounded-circle me-2"
            style="width: 32px; height: 32px; object-fit: cover"
          />
          <strong>{{ reply.adminName }}</strong>
          <small class="text-muted ms-auto">{{ reply.date }}</small>
        </div>
        <p class="mb-0">{{ reply.content }}</p>
      </div>
    </div>
    <p v-if="questions.length === 0" class="text-muted text-center">尚無留言，歡迎提出您的問題！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createProjectComment, getProjectComments } from '@/api/project'

const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  isLogin: {
    type: Boolean,
    required: true,
  },
})

const newQuestion = ref('')
const questions = ref([])
const user = ref({})

// 取得 localStorage 使用者資料
try {
  const raw = localStorage.getItem('user')
  user.value = raw ? JSON.parse(raw) : {}
} catch (e) {
  console.error('localStorage user parse 錯誤', e)
  user.value = {}
}

async function fetchComments() {
  try {
    const res = await getProjectComments(props.projectId)
    questions.value = res.data.data.map((comment) => ({
      id: comment.comment_id,
      userName: comment.user.name,
      userAvatar: comment.user.avatar_url || '/default-avatar.png',
      date: new Date(comment.created_at).toLocaleString(),
      content: comment.content,
      replies: comment.reply_content
        ? [
            {
              id: comment.comment_id,
              adminName: '提案者',
              content: comment.reply_content,
              date: new Date(comment.reply_at).toLocaleString(),
            },
          ]
        : [],
    }))
  } catch (err) {
    console.error('取得留言失敗', err)
    questions.value = []
  }
}

async function handleSubmit() {
  if (!newQuestion.value.trim()) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('未登入，無法留言')

    await createProjectComment(props.projectId, newQuestion.value, token)
    newQuestion.value = ''
    await fetchComments() // 提交後重新取得留言
  } catch (err) {
    console.error('留言失敗', err)
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.qna-wrapper {
  margin-top: 2rem;
}

/* 提問區 */
.comment-box {
  background-color: #fff8f9;
  border-radius: 1rem;
  border: 1px solid #ddd;
}

.comment-box textarea {
  background-color: #fff8f9;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* 問與答主體 */
.qa-card {
  background-color: #fff8f9;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* 提問內文對齊 */
.qa-question p {
  margin-left: 45px;
  margin-bottom: 0.5rem;
}

.qa-question {
  position: relative;
  padding-bottom: 1rem;
}

/* 回覆區塊：無背景無框線，僅左側色條 */
.qa-reply {
  margin-left: 30px;
  padding-left: 1rem;
  margin-top: 1rem;
  position: relative;
}
</style>

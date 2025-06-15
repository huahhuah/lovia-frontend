<template>
  <div class="qna-wrapper">
    <!-- 🟢 提問區 -->
    <div class="comment-box border p-4 mb-4 rounded-4">
      <div class="d-flex mb-2">
        <!-- 使用者大頭貼 -->
        <img
          src="/使用者.png"
          alt="avatar"
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
    <div
      class="qa-card border rounded-4 p-4 mb-4"
      v-for="qa in questions"
      :key="qa.id"
    >
      <!-- 提問者 -->
      <div class="qa-question mb-3">
        <div class="d-flex align-items-center mb-1">
          <img :src="qa.userAvatar || '/default-avatar.png'" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover" />
          <strong>{{ qa.userName }}</strong>
          <small class="text-muted ms-auto">{{ qa.date }}</small>
        </div>
        <p class="mb-0">{{ qa.content }}</p>
      </div>

      <!-- 回覆 -->
      <div
        class="qa-reply mt-3"
        v-for="reply in qa.replies"
        :key="reply.id"
      >
        <div class="d-flex align-items-center mb-1">
          <img :src="reply.adminAvatar || '/default-admin.png'" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover" />
          <strong>{{ reply.adminName }}</strong>
          <small class="text-muted ms-auto">{{ reply.date }}</small>
        </div>
        <p class="mb-0">{{ reply.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newQuestion = ref('')

const questions = ref([
  {
    id: 1,
    userName: '李子北',
    userAvatar: '/使用者1.png',
    date: '2025/4/18 7:44',
    content: '回饋品裡的感謝卡真的是孩子親手寫的嗎？還是印製出來的呢？',
    replies: [
      {
        id: 1,
        adminName: '晨曦希望協會',
        adminAvatar: '/協會.png',
        date: '2025/4/18 15:25',
        content:
          '感謝您提問！每張感謝卡的插圖都是孩子們親手繪製的，我們會統一掃描印製，讓每位贊助者都能收到孩子的畫作。文字部分由協會統一編寫，內容會根據孩子的想法做調整。',
      },
    ],
  },
])

function handleSubmit() {
  if (!newQuestion.value.trim()) return

  questions.value.push({
    id: Date.now(),
    userName: '匿名使用者',
    userAvatar: '',
    date: new Date().toLocaleString(),
    content: newQuestion.value,
    replies: [],
  })

  newQuestion.value = ''
}
</script>

<style scoped>

.qna-wrapper {
  margin-top: 2rem;
}

/* 提問區 */
.comment-box {
  background-color: #FFF8F9;
  border-radius: 1rem;
  border: 1px solid #ddd;
}

.comment-box textarea {
  background-color: #FFF8F9;
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* 問與答主體 */
.qa-card {
  background-color: #FFF8F9;
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

.qa-question::after {
  content: '';
  position: absolute;
  left: 18px; /* 頭貼一半寬度 + 邊距微調 */
  top: 48px;  /* 頭貼底部 + 一點距離 */
   height: calc(100% - -50px);
  width: 1px;
  border-left: 1px dashed #ccc;
}

.qa-question {
  position: relative;
  padding-bottom: 1rem; /* 預留空間讓虛線不會太短 */
}

</style>

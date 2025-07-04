<template>
  <div>
    <!-- 小圓按鈕 -->
    <div class="chat-toggle-btn" @click="toggleChat">
      <img src="/public/small-logo.png" alt="Lovia Logo" style="width: 30px" />
    </div>

    <!-- 浮動對話框 -->
    <div v-if="showChat" class="ai-chat-widget shadow">
      <div class="chat-header">
        <span>Lovia 客服中心</span>
        <span class="close-btn" @click="toggleChat">&times;</span>
      </div>

      <div class="chat-history">
        <div v-for="(msg, idx) in chatHistory" :key="idx" class="message-row" :class="msg.sender">
          <div class="bubble-wrapper">
            <img v-if="msg.sender === 'ai'" src="/public/small-logo.png" class="avatar" />
            <div class="bubble">{{ msg.text }}</div>
          </div>
          <div class="chat-time">{{ msg.time }}</div>
        </div>
      </div>

      <div class="service-time">服務時間：週一至週日 09:00~18:00</div>

      <div class="input-area">
        <textarea
          v-model="input"
          :disabled="!withinServiceHours"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.shift.enter.stop
          class="form-control"
          placeholder="請輸入您的問題..."
          rows="1"
        ></textarea>

        <button @click="sendMessage" class="send-btn" :disabled="!withinServiceHours">➤</button>
      </div>

      <!-- 非服務時間顯示 lock icon 與提示 -->
      <div v-if="!withinServiceHours" class="service-lock-msg">
        🔒 目前非服務時間（09:00~18:00），請稍後再與我們聯繫
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

const input = ref('')
const chatHistory = ref([
  {
    sender: 'ai',
    text: '您好！我是 Lovia 募資平台的AI客服小幫手，請問有什麼可以協助您的嗎？',
    time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
  },
])

const showChat = ref(false)

// 改為：週一到週日 09:00~18:00
function isWithinServiceHours() {
  const now = new Date()
  const hour = now.getHours()
  return hour >= 9 && hour < 18
}
const withinServiceHours = computed(() => isWithinServiceHours())

function toggleChat() {
  showChat.value = !showChat.value
  scrollToBottom()
}

async function sendMessage() {
  if (!input.value.trim()) return
  const baseURL = 'https://lovia-backend-xl4e.onrender.com/api/v1'
  const now = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
  const userMsg = input.value
  input.value = ''

  chatHistory.value.push({ sender: 'user', text: userMsg, time: now })
  await nextTick()
  scrollToBottom()

  try {
    const res = await axios.post('${baseURL}/api/v1/gemini-chat', {
      message: `你是 Lovia 募資平台的客服 AI，請用親切簡短的方式回答：${userMsg}`,
    })
    chatHistory.value.push({
      sender: 'ai',
      text: res.data.message,
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    })
  } catch (err) {
    console.error('AI 聊天錯誤', err)
    chatHistory.value.push({
      sender: 'ai',
      text: '抱歉，AI 小幫手暫時無法回應。',
      time: now,
    })
  }

  await nextTick()
  scrollToBottom()
}

function scrollToBottom() {
  const historyEl = document.querySelector('.chat-history')
  if (historyEl) historyEl.scrollTop = historyEl.scrollHeight
}

function handleKeydown(e) {
  if (e.key === 'Escape') showChat.value = false
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #fff5f7, #fbd8df, #f7c4d1);
  border: 3px solid #d56464;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.3s ease;
}
.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(253, 160, 180, 0.4);
  background: linear-gradient(135deg, #ffe6eb, #fbc6d2, #f6a5bb);
}
.chat-toggle-btn::after {
  content: '客服';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #555;
}

.ai-chat-widget {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 380px;
  max-height: 550px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.chat-header {
  background: #db7093;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  font-size: 22px;
  cursor: pointer;
}

.chat-history {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  background: #fafafa;
}

.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  max-width: 75%;
}
.message-row.ai {
  align-items: flex-start;
}
.message-row.user {
  align-items: flex-end;
  margin-left: auto;
}

/* 泡泡與時間組成一個column，保持時間在下方 */
.bubble-wrapper {
  display: flex;
  flex-direction: column;
}

.bubble {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-line; /* 保持手動換行 */
}

.message-row.ai .bubble {
  background: #f1f1f1;
  color: #333;
}
.message-row.user .bubble {
  background: #ffecec;
  color: #333;
}

/* 時間在泡泡下方左或右 */
.chat-time {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
}
.message-row.user .chat-time {
  text-align: right;
}

.avatar {
  width: 28px;
  height: 28px;
  margin-bottom: 4px;
}

.service-time {
  background: #fff5f0;
  color: rgb(239, 160, 153);
  font-size: 14px;
  text-align: center;
  padding: 5px;
}

/* 輸入區 */
.input-area {
  display: flex;
  border-top: 1px solid #eee;
}
.input-area textarea {
  flex: 1;
  border: none;
  padding: 10px;
  resize: none;
  min-height: 36px;
  line-height: 1.4;
}
.input-area textarea:focus {
  outline: none;
}
.input-area .send-btn {
  background: none;
  border: none;
  color: #db7093;
  font-size: 20px;
  cursor: pointer;
  padding: 0 10px;
}
.service-lock-msg {
  text-align: center;
  font-size: 13px;
  color: #db7093;
  font-weight: 600;
  margin-top: 6px;
}
</style>

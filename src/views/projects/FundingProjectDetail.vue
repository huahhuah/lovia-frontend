<template>
  <div class="container py-5" v-if="project">
    <!-- 上方 Banner -->
    <div
      v-if="!project"
      class="skeleton-banner mb-4 rounded bg-secondary bg-opacity-10"
      style="height: 300px"
    ></div>
    <ProjectBanner v-else :project="project" />

    <!-- 分頁切換區塊 -->
    <div class="row mt-5">
      <!-- 左側內容區 -->
      <div class="col-lg-8">
        <!-- 自訂 tabs 樣式 -->
        <ul class="custom-tabs d-flex gap-4 mb-4">
          <li
            v-for="tab in tabs"
            :key="tab"
            :class="['tab-item', { active: activeTab === tab }]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </li>
        </ul>

        <!-- 切換對應內容 -->
        <div class="bg-white p-4 rounded-4 shadow-sm">
          <div v-if="activeTab === '提案內容'">
            <p class="text-muted" style="white-space: pre-line">
              {{ project?.full_content || '尚無提案內容。' }}
            </p>
          </div>

          <div v-else-if="activeTab === '問與答'">
            <!-- 問與答留言輸入區塊 -->
            <div
              v-if="isLogin"
              class="comment-box d-flex p-4 rounded-4 mb-4"
              style="background-color: #fff8f5"
            >
              <!-- 使用者頭像 -->
              <img
                :src="user?.avatar || '/default-avatar.png'"
                @error="(e) => (e.target.src = '/default-avatar.png')"
                alt="user avatar"
                class="rounded-circle me-3"
                style="width: 44px; height: 44px; object-fit: cover"
              />

              <!-- 輸入框 + 按鈕 -->
              <div class="flex-grow-1 d-flex flex-column">
                <textarea
                  v-model="commentContent"
                  rows="3"
                  placeholder="有任何疑問或想了解的細節嗎？歡迎留言提問！"
                  class="form-control border-0 rounded-4 px-3 py-2 mb-2"
                  style="background-color: #fdf9f8"
                ></textarea>

                <div class="text-end">
                  <button class="btn btn-dark rounded-pill px-4" @click="handleSubmitComment">
                    提問
                  </button>
                </div>
              </div>
            </div>

            <!-- 未登入時顯示提示 -->
            <div v-else class="text-muted fst-italic">請先登入後才能留言。</div>
          </div>

          <div v-else-if="activeTab === '常見問題'">
            <p class="text-muted">尚未提供 常見問題 資料。</p>
          </div>

          <div v-else-if="activeTab === '進度分享'">
            <p class="text-muted">尚未發布任何更新內容。</p>
          </div>
        </div>
      </div>

      <!-- 右側方案卡片 -->
      <div class="col-lg-4 mt-5 mt-lg-0 border-start ps-3">
        <div v-if="plans.length === 0">
          <div
            v-for="n in 2"
            :key="n"
            class="card mb-3 p-4 bg-secondary bg-opacity-10 rounded-4"
            style="height: 180px"
          ></div>
        </div>
        <ProjectPlans v-else :plans="plans" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProjectBanner from '@/components/ProjectBanner.vue'
import ProjectPlans from '@/components/ProjectPlans.vue'
import { createProjectComment, getProjectOverview, getProjectPlans } from '@/api/project'

const route = useRoute()
const projectId = route.params.id
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const isLogin = !!localStorage.getItem('token')

const project = ref(null)
const plans = ref([])
const activeTab = ref('提案內容')
const tabs = ['提案內容', '問與答', '常見問題', '進度分享']

//留言內容
const commentContent = ref('')
const commentSuccess = ref(false)
const commentError = ref('')
//提交留言
const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) {
    commentError.value = '留言內容不能為空'
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    commentError.value = '請先登入後再留言'
    return
  }

  try {
    await createProjectComment(projectId, commentContent.value, token)
    commentSuccess.value = true
    commentContent.value = ''
    commentError.value = ''
  } catch (err) {
    commentError.value = '留言失敗，請稍後再試'
    console.error(err)
  }
}

onMounted(async () => {
  const projectId = parseInt(route.params.id)
  if (isNaN(projectId)) return

  try {
    const resOverview = await getProjectOverview(projectId)
    project.value = resOverview.data.data

    const resPlans = await getProjectPlans(projectId)
    plans.value = resPlans.data.data
    console.log(' plans:', plans.value)
  } catch (err) {
    console.error('讀取專案資料失敗', err)
  }
})
</script>

<style scoped>
.container {
  max-width: 1140px;
}

.custom-tabs {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.tab-item {
  cursor: pointer;
  padding-bottom: 8px;
  font-weight: 500;
  position: relative;
  color: #333;
}

.tab-item.active {
  color: #e74c3c;
  font-weight: 700;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #e74c3c;
  border-radius: 6px;
}
.comment-box {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
</style>

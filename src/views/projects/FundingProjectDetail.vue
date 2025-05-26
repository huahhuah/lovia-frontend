<template>
  <div class="container py-5" v-if="project">
    <!-- 上方 Banner -->
    <ProjectBanner :project="project" @scrollToSponsor="scrollToSponsorSection" />

    <!-- 滾動目標: 放在 row -->
    <div ref="sponsorSection"></div>

    <!-- 分頁切換區塊 -->
    <div class="row mt-5">
      <!-- 左側內容 -->
      <div class="col-lg-8">
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

        <div class="bg-white p-4 rounded-4 shadow-sm">
          <p v-if="activeTab === '提案內容'" class="text-muted" style="white-space: pre-line">
            {{ project.full_content || '尚無提案內容。' }}
          </p>

          <div v-else-if="activeTab === '問與答'">
            <div
              v-if="isLogin"
              class="comment-box d-flex p-4 rounded-4 mb-4"
              style="background-color: #fff8f5"
            >
              <img
                :src="user?.avatar || '/default-avatar.png'"
                alt="user avatar"
                class="rounded-circle me-3"
                style="width: 44px; height: 44px; object-fit: cover"
              />
              <div class="flex-grow-1 d-flex flex-column">
                <textarea
                  v-model="commentContent"
                  rows="3"
                  class="form-control border-0 rounded-4 px-3 py-2 mb-2"
                  style="background-color: #fdf9f8"
                  placeholder="歡迎留言提問"
                ></textarea>
                <div class="text-end">
                  <button class="btn btn-dark rounded-pill px-4" @click="handleSubmitComment">
                    提問
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-muted fst-italic">請先登入後才能留言。</div>
          </div>

          <p v-else-if="activeTab === '常見問題'" class="text-muted">尚未提供 常見問題 資料。</p>
          <p v-else-if="activeTab === '進度分享'" class="text-muted">尚未發布任何更新內容。</p>
        </div>
      </div>

      <!-- 右側方案卡片 -->
      <div class="col-lg-4 mt-5 mt-lg-0 border-start ps-3">
        <div v-if="!plans || plans.length === 0">
          <!-- 預設空狀態的骨架畫面 -->
          <div
            v-for="n in 2"
            :key="n"
            class="card mb-3 p-4 bg-secondary bg-opacity-10 rounded-4"
            style="height: 180px"
          ></div>
        </div>

        <!-- 即使 project.id 還沒回來也先傳入 route 轉換的 projectId -->
        <ProjectPlans
          v-if="plans && plans.length > 0"
          :plans="plans"
          :projectId="projectId"
          :projectType="project?.project_type || ''"
        />
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
const projectId = parseInt(route.params.id)
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const isLogin = !!localStorage.getItem('token')

const project = ref(null)
const plans = ref([])
const commentContent = ref('')
const activeTab = ref('提案內容')
const tabs = ['提案內容', '問與答', '常見問題', '進度分享']

//滾動到贊助區塊
const sponsorSection = ref(null)
function scrollToSponsorSection() {
  setTimeout(() => {
    const offset = 100
    const el = sponsorSection.value
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      console.warn('找不到 sponsorSection')
    }
  }, 300)
}

const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) return
  try {
    await createProjectComment(projectId, commentContent.value, localStorage.getItem('token'))
    commentContent.value = ''
  } catch (err) {
    console.error('留言失敗', err)
  }
}

onMounted(async () => {
  if (isNaN(projectId)) {
    console.error('無效的 route.params.id:', route.params.id)
    return
  }

  try {
    const resOverview = await getProjectOverview(projectId)
    project.value = resOverview.data.data

    const resPlans = await getProjectPlans(projectId)
    plans.value = resPlans.data.data || []
  } catch (err) {
    console.error(' 讀取專案資料失敗', err)
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
  border-bottom: 1px solid #eee;
}
.tab-item {
  cursor: pointer;
  padding-bottom: 8px;
  font-weight: 500;
  color: #333;
  position: relative;
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

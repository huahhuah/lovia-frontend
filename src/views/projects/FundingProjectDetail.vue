<template>
  <div class="page-wrapper" v-if="project">
    <div class="container">
      <!-- ✅ 將 ProjectBanner 放在整個 row 裡 -->
      <div class="row">
        <ProjectBanner :project="project" />
      </div>

      <!-- 分頁區塊 -->
      <div class="row mt-5">
        <!-- 左側主要內容（col-lg-8） -->
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

          <div class="project-content-box p-4 rounded-4 shadow-sm">
            <div v-if="activeTab === '專案介紹'">
              <div
                class="text-muted project-description mb-4"
                :class="{ collapsed: !isContentExpanded }"
                style="white-space: pre-line"
              >
                {{ project.full_content || '尚無提案內容。' }}
              </div>

              <!-- ✅ 手機版虛線與展開按鈕（桌機不顯示） -->
              <div class="text-center mt-3 d-lg-none">
                <div class="divider-with-button">
                  <hr class="dashed-line" />
                  <button
                    class="expand-btn btn btn-dark rounded-pill px-4 py-2 fw-bold shadow-sm"
                    @click="isContentExpanded = !isContentExpanded"
                  >
                    {{ isContentExpanded ? '收起內容' : '查看完整內容' }}
                  </button>
                </div>
              </div>
            </div>

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
                <div class="flex-grow-1">
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

            <p v-else-if="activeTab === '常見問題'" class="text-muted">尚未提供常見問題資料。</p>
            <p v-else-if="activeTab === '進度分享'" class="text-muted">尚未發布任何更新內容。</p>
          </div>
        </div>

        <!-- 右側回饋方案（col-lg-4） -->
        <div class="col-lg-4 mt-5 mt-lg-0 ps-3">
          <div v-if="!plans || plans.length === 0">
            <div
              v-for="n in 2"
              :key="n"
              class="card mb-3 p-4 bg-secondary bg-opacity-10 rounded-4"
              style="height: 180px"
            ></div>
          </div>

          <ProjectPlans
            v-else
            :plans="plans"
            :projectId="projectId"
            :projectType="project?.project_type || ''"
          />
        </div>
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
const activeTab = ref('專案介紹')
const tabs = ['專案介紹', '問與答', '常見問題', '進度分享']
const isContentExpanded = ref(false)

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
    console.error('讀取專案資料失敗', err)
  }
})
</script>

<style>
.page-wrapper {
  padding-top: 100px;
  background-image: linear-gradient(to right, #FFEDF2, #FFF6E3);
  min-height: 100vh;
}

.container {
  max-width: 1140px;
}

.custom-tabs {
  list-style: none;
  padding: 0;
  border-bottom: none;
}

.tab-item {
  cursor: pointer;
  padding-bottom: 8px;
  font-weight: 400;
  color: #333;
  position: relative;
}

.tab-item.active {
  color: #FC5B53;
  font-weight: 400;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background-color: #FC5B53;
}

.comment-box {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.project-content-box {
  background-color: rgba(255, 248, 249, 0.4);
}

.project-description.collapsed {
  max-height: 300px;
  overflow: hidden;
  position: relative;
}

.divider-with-button {
  position: relative;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.dashed-line {
  border-top: 1px dashed #ccc;
  margin: 0;
}

.expand-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: #000;
  color: #fff;
}
</style>

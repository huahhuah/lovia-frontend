<template>
  <div class="page-wrapper" v-if="project">
    <div class="container py-5">
      <!-- Banner -->
      <ProjectBanner :project="project" @scrollToSponsor="scrollToSponsorSection" />

      <!-- 滾動目標 -->
      <div ref="sponsorSection"></div>

      <!-- 分頁區塊 -->
      <div class="row mt-5">
        <!-- 左側主要內容 -->
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

          <!-- ✅ 專案介紹使用背景框 -->
          <div v-if="activeTab === '專案介紹'" class="project-content-box p-4 rounded-4 shadow-sm">
            <div
              class="text-muted project-description mb-4"
              :class="{ collapsed: !isContentExpanded && isMobile }"
              style="white-space: pre-line"
            >
              {{ project.full_content || '尚無提案內容。' }}
            </div>

            <!-- 手機版展開/收起按鈕 -->
            <div class="text-center mt-3 d-lg-none">
              <div class="divider-with-button">
                <hr class="dashed-line" />
                <button
                  class="expand-btn btn btn-dark rounded-pill px-4 py-2 shadow-sm"
                  @click="isContentExpanded = !isContentExpanded"
                >
                  {{ isContentExpanded ? '收起內容' : '查看完整內容' }}
                </button>
              </div>
            </div>
          </div>

          <!-- ❌ 問與答：不加背景框 -->
          <div v-else-if="activeTab === '問與答'">
            <QnaBlock :projectId="projectId" :isLogin="isLogin" />
          </div>

          <!-- ❌ 常見問題 -->
          <div v-else-if="activeTab === '常見問題'">
            <div v-if="faqs.length > 0">
              <div class="faq-box" v-for="(faq, index) in faqs" :key="index">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <img src="/layers.png" width="16" />
                  <h6 class="mb-0">{{ faq.question }}</h6>
                </div>
                <hr class="my-2" />
                <p class="text-secondary small mb-0">{{ faq.answer }}</p>
              </div>
            </div>
            <p v-else class="text-muted">尚未提供 常見問題 資料。</p>
          </div>

          <!-- ❌ 進度分享 -->
          <div v-else-if="activeTab === '進度分享'">
            <div v-if="progresses.length > 0" class="progress-card-list">
              <div v-for="(progress, index) in progresses" :key="index" class="progress-card">
                <h5 class="fw-bold">{{ progress.title }}</h5>
                <p class="progress-date">發佈日期：{{ progress.date }}</p>
                <p class="progress-content" style="white-space: pre-line">{{ progress.content }}</p>

                <div v-if="progress.fund_usages?.length">
                  <table class="progress-table table text-center align-middle small">
                    <thead>
                      <tr>
                        <th>匯款對象</th>
                        <th>資金用途</th>
                        <th>金額</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(usage, uIndex) in progress.fund_usages" :key="uIndex">
                        <td>{{ usage.recipient }}</td>
                        <td>{{ usage.usage }}</td>
                        <td>{{ usage.amount.toLocaleString() }}</td>
                        <td>{{ usage.status }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <p v-else class="text-muted">尚未發布任何更新內容。</p>
          </div>
        </div>

        <!-- 右側回饋方案 -->
        <div class="col-lg-4 mt-5 mt-lg-0 ps-3">
          <!-- 無回饋方案時顯示 placeholder -->
          <div v-if="!plans || plans.length === 0">
            <div
              v-for="n in 2"
              :key="n"
              class="card mb-3 p-4 bg-secondary bg-opacity-10 rounded-4"
              style="height: 180px"
            ></div>
          </div>
          <!-- 有回饋方案時，渲染 ProjectPlans 元件 -->
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
import QnaBlock from '@/components/QnaBlock.vue'
import {
  getProjectOverview,
  getProjectPlans,
  getProjectFaqs,
  getProjectProgresses,
} from '@/api/project'

const route = useRoute()
const projectId = ref(parseInt(route.params.id) || 0)
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const isLogin = !!localStorage.getItem('token')

const project = ref(null)
const plans = ref([])
const activeTab = ref('專案介紹')
const tabs = ['專案介紹', '問與答', '常見問題', '進度分享']
const isContentExpanded = ref(false)
const isMobile = ref(false)
const faqs = ref([])
const progresses = ref([])

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

async function loadData() {
  if (isNaN(projectId.value)) {
    console.error('無效的 route.params.id:', route.params.id)
    return
  }

  try {
    const [resOverview, resPlans, resFaqs, resProgresses] = await Promise.all([
      getProjectOverview(projectId.value),
      getProjectPlans(projectId.value),
      getProjectFaqs(projectId.value),
      getProjectProgresses(projectId.value),
    ])

    project.value = resOverview.data.data || null
    plans.value = resPlans.data.data || []
    faqs.value = resFaqs.data?.data || []
    progresses.value = resProgresses.data?.data || []
  } catch (err) {
    console.error('讀取專案資料失敗', err)
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth <= 991
  loadData()
})
</script>

<style>
.page-wrapper {
  padding-top: 100px;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
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
  color: #fc5b53;
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
  background-color: #fc5b53;
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
  border-top: 1px dashed #222;
  margin: 0;
}

.expand-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 180px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  font-weight: 400; /* 或改為 300 更細 */
  background-color: #000;
  color: #fff;
}
/* 常見問題 */
.faq-box {
  background-color: #FFF9F6;
  border-radius: 1rem;
  padding: 20px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.faq-box h6 {
  font-size: 16px;
  font-weight: normal;
  color: #1a1a1a;
  margin-bottom: 0;
}

.faq-box p {
  font-size: 14px;
  color: #666;
  white-space: pre-line;
  margin-left: 24px;
}

.faq-box hr {
  border: none;
  border-top: 1px dashed #888;
  margin: 8px 0;
}

/* 進度分享 */
.progress-card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.progress-card {
  background-color: #fff8f7;
  border-radius: 1rem;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  font-size: 15px;
  line-height: 1.6;
  border: 1px solid #ddd;
}

.progress-card h5 {
  color: #1a1a1a;
  margin-bottom: 8px;
}

.progress-date {
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
}

.progress-content {
  margin-bottom: 12px;
  color: #333;
}

.progress-table {
  background-color: #FFF8F9; /* 淺灰色底 */
  border-radius: 0.75rem;    /* 四個角圓角 */
  overflow: hidden;          /* 裁掉超出圓角的線 */
  border-collapse: separate; /* 為了讓 border-radius 生效 */
  border-spacing: 0;
  border: 1px solid #ddd;
}

.progress-table th,
.progress-table td {
  background-color: transparent; /* 避免內部重疊背景 */
}

.progress-table th {
  font-weight: 600;
  color: #444;
  background-color: #eaeaea;
}

.progress-table td {
  color: #333;
}
</style>

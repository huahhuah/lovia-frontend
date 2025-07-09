<template>
  <div class="page-wrapper" v-if="project">
    <div class="container py-5">
      <ProjectBanner :project="project" />

      <!-- 專案摘要資訊 -->
      <div class="project-content-box p-4 rounded-4 shadow-sm mb-4">
        <h1 class="fw-bold mb-3">{{ project.title }}</h1>
        <img :src="project.cover" alt="cover image" class="img-fluid rounded mb-3" />
        <p class="mb-2 text-muted">{{ project.summary }}</p>
        <p class="mb-2"><strong>分類:</strong> {{ project.category?.name || '無' }}</p>
        <p class="mb-2">
          <strong>募資目標:</strong>
          {{ project.total_amount ? project.total_amount.toLocaleString() : '無資料' }} 元
        </p>
        <p class="mb-0"><strong>期間:</strong> {{ project.start_time }} ~ {{ project.end_time }}</p>
      </div>

      <!-- 專案介紹與團隊介紹區塊 -->
      <div class="project-content-box p-4 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-3">完整介紹</h2>
        <p class="text-muted" style="white-space: pre-line">{{ project.full_content }}</p>
      </div>

      <div class="project-content-box p-4 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-3">團隊介紹</h2>
        <p class="text-muted" style="white-space: pre-line">{{ project.project_team }}</p>
      </div>

      <!-- 分頁區塊 -->
      <div class="row mt-4">
        <!-- 左側主要內容 -->
        <div class="col-lg-8">
          <!-- 專案進度 -->
          <div v-if="progresses.length" class="project-content-box p-4 rounded-4 shadow-sm">
            <h2 class="fw-bold mb-3">專案進度</h2>
            <div v-for="(progress, index) in progresses" :key="index" class="progress-card mb-4">
              <h5 class="fw-bold">{{ progress.title }} ({{ progress.date }})</h5>
              <p>{{ progress.content }}</p>
              <h6 class="fw-bold">資金使用</h6>
              <ul>
                <li v-for="(usage, index) in progress.fund_usages" :key="index">
                  <strong>受款方:</strong> {{ usage.recipient }} <br />
                  <strong>用途:</strong> {{ usage.usage }} <br />
                  <strong>金額:</strong> {{ usage.amount.toLocaleString() }} 元 <br />
                  <strong>狀態:</strong> {{ usage.status || '無狀態' }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 👉 留言與回覆 -->
          <div class="project-content-box p-4 rounded-4 shadow-sm mt-4" v-if="comments.length">
            <h2 class="fw-bold mb-3">提問與回覆</h2>
            <div
              v-for="comment in comments"
              :key="comment.comment_id"
              class="mb-4 border-bottom pb-3"
            >
              <p class="mb-1">
                <strong>{{ comment.user?.username || comment.user?.email || '匿名' }}：</strong>
                {{ comment.content }}
              </p>
              <p class="text-muted mb-1" style="font-size: 0.9rem">
                提問時間：{{ comment.created_at }}
              </p>

              <div v-if="comment.reply_content" class="bg-light p-3 mt-2 rounded">
                <strong>提案者回覆：</strong>
                <p class="mb-1">{{ comment.reply_content }}</p>
                <p class="text-muted mb-0" style="font-size: 0.8rem">
                  回覆時間：{{ comment.reply_at }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側回饋方案 -->
        <div class="col-lg-4 mt-5 mt-lg-0 ps-3">
          <div v-if="project.plans && project.plans.length">
            <div v-for="(plan, index) in project.plans" :key="index" class="progress-card mb-4">
              <h5 class="fw-bold mb-2">{{ plan.plan_name }}</h5>
              <img
                v-if="plan.feedback_img"
                :src="plan.feedback_img"
                class="img-fluid rounded mt-2"
              />
              <p><strong>金額:</strong> {{ plan.amount.toLocaleString() }} 元</p>
              <p><strong>回饋:</strong> {{ plan.feedback }}</p>
              <p><strong>出貨日期:</strong> {{ plan.delivery_date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="text-center mt-5">
        <!-- <router-link :to="`/edit-proposal/${project.id}`" class="btn btn-outline-dark me-3"
          >返回修改提案</router-link
        > -->
        <router-link to="/my-proposals" class="btn btn-danger">回到提案列表</router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <p>載入中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectById, getProgress, getProjectComments } from '../api/project.js'

const route = useRoute()
const project = ref(null)
const progresses = ref([])
const comments = ref([])

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await getProjectById(id)
    if (res.status === 200 && res.data.status === true) {
      project.value = res.data.data
    }

    const progressRes = await getProgress(id)
    if (progressRes.status === 200 && progressRes.data.status === true) {
      progresses.value = progressRes.data.data
    }

    const commentRes = await getProjectComments(id) // ✅ 修正這裡
    if (commentRes.status === 200 && commentRes.data.status === true) {
      comments.value = commentRes.data.data
    }
  } catch (err) {
    console.error('取得資料失敗', err)
  }
})
</script>

<style scoped>
.page-wrapper {
  padding-top: 100px;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  min-height: 100vh;
}

.project-content-box {
  background-color: #fff9f5;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.progress-card {
  background-color: #fff9f5;
  border-radius: 1rem;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
}
</style>

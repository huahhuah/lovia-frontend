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
          <div v-if="progresses.length" class="project-content-box p-4 rounded-4 shadow-sm">
            <h2 class="fw-bold mb-3">專案進度</h2>
            <div
              v-for="(progress, index) in progresses"
              :key="index"
              class="progress-card mb-4"
            >
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
        </div>

        <!-- 右側回饋方案 -->
        <div class="col-lg-4 mt-5 mt-lg-0 ps-3">
          <div v-if="project.plans && project.plans.length">
            <div v-for="(plan, index) in project.plans" :key="index" class="progress-card mb-4">
              <h5 class="fw-bold mb-2">{{ plan.plan_name }}</h5>
              <img v-if="plan.feedback_img" :src="plan.feedback_img" class="img-fluid rounded mt-2" />
              <p><strong>金額:</strong> {{ plan.amount.toLocaleString() }} 元</p>
              <p><strong>回饋:</strong> {{ plan.feedback }}</p>
              <p><strong>出貨日期:</strong> {{ plan.delivery_date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="text-center mt-5">
        <router-link :to="`/edit-proposal/${project.id}`" class="btn btn-outline-dark me-3">返回修改提案</router-link>
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
import { getProjectById, getProgress } from '../api/project.js'
import axios from 'axios'

const route = useRoute() // 取得當前路由
const project = ref(null) // 定義 project 資料
const progresses = ref([]) 

onMounted(async () => {
  // 專案資料取得(完整提案、進度)，缺意見、問題
  const id = route.params.id // 從路由參數取得專案 id
  try {
    const res = await getProjectById(id) // 呼叫 API 取得專案資料
    if (res.status === 200 && res.data.status === true) {
      project.value = res.data.data // 存儲資料
      console.log('專案資料', project.value)
    } else {
      console.error('API錯誤', res)
    }

    // 取得專案進度
    const progressRes = await getProgress(id) 
    if (progressRes.status === 200 && progressRes.data.status === true) {
      progresses.value = progressRes.data.data // 存儲進度資料
    } else {
      console.error('進度資料錯誤', progressRes)
    }
  } catch (err) {
    console.error('取得專案失敗', err)
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

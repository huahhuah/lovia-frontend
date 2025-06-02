
<template>
  <div v-if="project">
    <h1>{{ project.title }}</h1>
    <img :src="project.cover" alt="cover image" width="300" />

    <p>{{ project.summary }}</p>
    <p><strong>分類:</strong>{{ project.category?.name || '無' }}</p>
    <p>
      <strong>募資目標:</strong
      >{{ project.total_amount ? project.total_amount.toLocaleString() : '無資料' }} 元
    </p>
    <p><strong>期間</strong>{{ project.start_time }} ~ {{ project.end_time }}</p>

    <section>
      <h2>完整介紹</h2>
      <p>{{ project.full_content }}</p>
    </section>

    <section>
      <h2>團隊介紹</h2>
      <p>{{ project.project_team }}</p>
    </section>

    <section v-if="project.plans && project.plans.length">
      <h2>募資方案</h2>
      <div
        v-for="(plan, index) in project.plans"
        :key="index"
        style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem"
      >
        <h3>{{ plan.plan_name }}</h3>
        <p><strong>金額:</strong>{{ plan.amount }} 元</p>
        <p><strong>回饋:</strong>{{ plan.feedback }}</p>
        <img v-if="plan.feedback_img" :src="plan.feedback_img" alt="feedback image" width="200" />
        <p><strong>出貨日期:</strong>{{ plan.delivery_date }}</p>
      </div>
    </section>

    <!--顯示專案進度-->
    <section v-if="progresses.length">
      <h2>專案進度</h2>
      <div v-for="(progress, index) in progresses"
           :key="index"
           style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem"
      >
        <h3>{{ progress.title }} ({{progress.date}})</h3>
        <p>{{ progress.content }}</p>
        <h4>資金使用</h4>
        <ul>
          <li v-for="(usage, index) in progress.fund_usages" :key="index">
            <strong>受款方:</strong> {{ usage.recipient }} <br />
            <strong>用途:</strong> {{ usage.usage }} <br />
            <strong>金額:</strong> {{ usage.amount.toLocaleString() }} 元 <br />
            <strong>狀態:</strong> {{ usage.status || '無狀態' }}
          </li>
        </ul>
      </div>
    </section>

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

<template>
  <div v-if="project">
    <h1>{{ project.title }}</h1>
    <img :src="project.cover" alt="cover image" width="300" />

    <p>{{ project.summary }}</p>
    <p><strong>分類：</strong>{{ project.category?.name || '無' }}</p>
    <p><strong>募資目標：</strong>{{ project.total_amount ? project.total_amount.toLocaleString() : '無資料' }} 元</p>
    <p><strong>期間：</strong>{{ project.start_time }} ~ {{ project.end_time }}</p>

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
        style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;"
      >
        <h3>{{ plan.plan_name }}</h3>
        <p><strong>金額：</strong>{{ plan.amount }} 元</p>
        <p><strong>回饋：</strong>{{ plan.feedback }}</p>
        <img v-if="plan.feedback_img" :src="plan.feedback_img" alt="feedback image" width="200" />
        <p><strong>出貨日期：</strong>{{ plan.delivery_date }}</p>
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
import { getProjectById } from '../api/project.js'
import axios from 'axios'

const route = useRoute()  // 取得當前路由
const project = ref(null)  // 定義 project 資料

onMounted(async () => {
  const id = route.params.id  // 從路由參數取得專案 id
  try {
    const res = await getProjectById(id);  // 呼叫 API 取得專案資料
    if (res.status ===200 && res.data.status === true) {
      project.value = res.data.data  // 儲存資料
      console.log('專案資料',project.value)
    } else {
          console.error('API錯誤:', err) 
    }
  } catch (err) {
    console.error('取得專案失敗:', err) 
  }
})
</script>

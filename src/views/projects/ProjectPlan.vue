<template>
  <div class="plan-form">
    <h2>新增回饋方案 - {{ projectData.title }}</h2>
    <form @submit.prevent="submitPlans">
      <div v-for="(plan, index) in form.plans" :key="index" class="plan-section">
        <h4>回饋方案 {{ index + 1 }}</h4>
        <input v-model="plan.plan_name" placeholder="方案名稱" />
        <input v-model.number="plan.amount" type="number" placeholder="金額" />
        <input v-model.number="plan.quantity" type="number" placeholder="數量" />
        <input v-model="plan.feedback" placeholder="回饋內容" />
        <input v-model="plan.feedback_img" placeholder="回饋圖片網址" />
        <input v-model="plan.delivery_date" type="date" placeholder="出貨日" />
        <button type="button" @click="removePlan(index)" style="margin-top: 8px; background-color: #dc2626;">
          刪除此方案
        </button>
      </div>

      <button type="button" @click="addPlan">新增回饋方案</button>
      <button type="submit">送出回饋方案</button>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createProjectPlan, getProjectById } from '@/api/project'

export default {
  name: 'ProjectPlan',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const form = reactive({
      project_id: route.params.id || '',  // 從 route.params.id 取出專案 ID
      plans: [],
    })

    const projectData = reactive({
      title: '',
    })

    // 當頁面加載完成後，根據 project_id 獲取專案資料
    onMounted(async () => {
      try {
        const res = await getProjectById(form.project_id)  // 假設這是從 API 獲取專案資料的方法
        projectData.title = res.data.title  // 設置專案標題
      } catch (err) {
        console.error('獲取專案資料失敗', err)
        alert('無法獲取專案資料')
      }
    })

    const addPlan = () => {
      form.plans.push({
        plan_name: '',
        amount: 0,
        quantity: 1,
        feedback: '',
        feedback_img: '',
        delivery_date: '',
      })
    }

    const removePlan = (index) => {
      form.plans.splice(index, 1)
    }

    const submitPlans = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('未登入或 token 遺失')
          return
        }

        for (const plan of form.plans) {
          await createProjectPlan(form.project_id, plan, token)
        }

        alert('回饋方案提交成功！')
        router.push('/') // 提交後返回首頁或其他頁面
      } catch (err) {
        console.error('回饋方案提交失敗', err)
        alert('回饋方案提交失敗')
      }
    }

    return {
      form,
      addPlan,
      removePlan,
      submitPlans,
      projectData,
    }
  },
}
</script>

<style scoped>
.plan-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem;
}
.plan-form form > div {
  margin-bottom: 1rem;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #1d4ed8;
}
.plan-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 10px;
}
</style>

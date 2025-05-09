<template>
  <div class="container py-5">
    <h2 class="mb-4">新增回饋方案 - {{ projectData.title }}</h2>

    <form @submit.prevent="submitPlans">
      <!-- 方案區塊 -->
      <div
        v-for="(plan, index) in form.plans"
        :key="index"
        class="border rounded p-4 mb-4 bg-light"
      >
        <h5>回饋方案 {{ index + 1 }}</h5>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">方案名稱</label>
            <input
              v-model="plan.plan_name"
              type="text"
              class="form-control"
              placeholder="例如：感謝小卡"
              required
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">金額</label>
            <input
              v-model.number="plan.amount"
              type="number"
              class="form-control"
              min="1"
              required
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">數量</label>
            <input
              v-model.number="plan.quantity"
              type="number"
              class="form-control"
              min="1"
              required
            />
          </div>

          <div class="col-12">
            <label class="form-label">回饋說明</label>
            <textarea
              v-model="plan.feedback"
              class="form-control"
              rows="2"
              placeholder="我們將寄送手寫感謝卡"
              required
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">回饋圖片網址</label>
            <input
              v-model="plan.feedback_img"
              type="text"
              class="form-control"
              placeholder="https://example.com/thankyou.jpg"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">預計出貨日期</label>
            <input v-model="plan.delivery_date" type="date" class="form-control" required />
          </div>

          <div class="col-12 text-end">
            <button type="button" class="btn btn-outline-danger" @click="removePlan(index)">
              刪除此方案
            </button>
          </div>
        </div>
      </div>

      <!-- 新增方案按鈕 -->
      <div class="mb-4">
        <button type="button" class="btn btn-outline-secondary" @click="addPlan">
          ＋ 新增回饋方案
        </button>
      </div>

      <!-- 送出按鈕 -->
      <div class="text-center">
        <button type="submit" class="btn btn-danger px-5 py-2">送出回饋方案</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createProjectPlan } from '@/api/project' // ✅ 模組化 API 匯入

export default {
  name: 'ProjectPlan',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const form = reactive({
      project_id: route.params.id || '',
      plans: [],
    })

    const projectData = reactive({
      title: '',
    })

    // 初始化取得專案資訊
    onMounted(async () => {
      try {
        const res = await projectAPI.getById(form.project_id) // ✅ 改這裡
        projectData.title = res.data.title
      } catch (err) {
        console.error('獲取專案資料失敗', err)
        alert('無法獲取專案資料')
      }
    })

    // 新增一筆方案
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

    // 移除指定方案
    const removePlan = (index) => {
      form.plans.splice(index, 1)
    }

    // 提交所有方案
    const submitPlans = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('未登入或 token 遺失')
          return
        }

        for (const [i, plan] of form.plans.entries()) {
          if (
            !plan.plan_name ||
            !plan.amount ||
            !plan.quantity ||
            !plan.feedback ||
            !plan.feedback_img ||
            !plan.delivery_date
          ) {
            alert(`第 ${i + 1} 筆回饋方案未填寫完整`)
            return
          }
        }

        await Promise.all(
          form.plans.map((plan) => projectAPI.createPlan(form.project_id, plan, token)) // ✅ 改這裡
        )

        alert('回饋方案提交成功！')
        router.push(`/projects/${form.project_id}`)
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

<style scoped></style>

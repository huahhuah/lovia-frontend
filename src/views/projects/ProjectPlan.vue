<template>
  <div class="project-plan-wrapper py-5">
    <div class="container" style="max-width: 720px">
      <h3 class="text-center fw-bold mb-5">
        {{ isEdit ? '編輯回饋方案' : '新增回饋方案' }}
      </h3>

      <form @submit.prevent="submitPlans">
        <div
          v-for="(plan, index) in form.plans"
          :key="plan.id || index"
          class="rounded-4 p-4 shadow-sm mb-4 border border-light-subtle"
          style="background-color: #fff9f5"
        >
          <h6 class="fw-bold mb-3">方案 {{ index + 1 }}</h6>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label">方案名稱</label>
              <input v-model="plan.plan_name" type="text" class="form-control" required />
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">金額</label>
              <input v-model.number="plan.amount" type="number" class="form-control" required />
            </div>
            <div class="col-6 col-md-3">
              <label class="form-label">數量</label>
              <input v-model.number="plan.quantity" type="number" class="form-control" required />
            </div>

            <div class="col-12">
              <label class="form-label">回饋說明</label>
              <textarea v-model="plan.feedback" class="form-control" rows="2" required></textarea>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">回饋圖片</label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                class="form-control"
                @change="handlePlanImageUpload($event, index)"
              />
              <img
                v-if="plan.feedback_img"
                :src="plan.feedback_img"
                alt="圖片預覽"
                class="img-thumbnail mt-2"
                style="max-height: 150px"
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label">預計出貨日期</label>
              <input v-model="plan.delivery_date" type="date" class="form-control" required />
            </div>

            <div class="col-12 text-end">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="removePlan(index)"
              >
                刪除方案
              </button>
            </div>
          </div>
        </div>

        <div class="text-center mb-4">
          <button type="button" class="btn btn-outline-secondary" @click="addPlan">
            ＋ 新增方案
          </button>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-danger px-5 py-2" :disabled="isSubmitting">
            {{ isEdit ? '更新回饋方案' : '送出回饋方案' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getProjectById,
  createProjectPlan,
  getProjectPlans,
  updateProjectPlan,
} from '@/api/project'
import { deleteProjectPlan } from '@/api/project'
import { uploadImage } from '@/api/upload'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()
export default {
  name: 'ProjectPlan',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const project_id = route.params.project_id || ''
    const isEdit = route.query.isEdit === 'true'
    const token = localStorage.getItem('token')

    const form = reactive({
      project_id,
      plans: [],
    })

    const projectData = reactive({
      title: '',
    })

    const isSubmitting = ref(false)

    // 初始化取得專案資訊
    onMounted(async () => {
      try {
        const res = await getProjectById(form.project_id, token)
        projectData.title = res.data.data.title
        if (isEdit) {
          const planRes = await getProjectPlans(form.project_id, token)
          form.plans = planRes.data.data.map((plan) => ({
            id: plan.plan_id,
            plan_name: plan.plan_name,
            amount: plan.amount,
            quantity: plan.quantity,
            feedback: plan.feedback,
            feedback_img: plan.feedback_img,
            delivery_date: plan.delivery_date,
          }))
        } else {
          form.plans = []
        }
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
    const removePlan = async (index) => {
  const plan = form.plans[index]
  const confirmed = confirm(`確定要刪除方案「${plan.plan_name}」嗎？`)
  if (!confirmed) return

  if (plan.id) {
    // 舊資料 → 呼叫後端刪除
    try {
      await deleteProjectPlan(form.project_id, plan.id, token)
      form.plans.splice(index, 1)
      alert('方案已刪除')
    } catch (err) {
      console.error('刪除方案失敗', err)
      alert('刪除失敗，請稍後再試')
    }
  } else {
    // 還沒送出的新資料，直接從陣列中移除即可
    form.plans.splice(index, 1)
  }
}

    const handlePlanImageUpload = async (event, index) => {
      const file = event.target.files[0]
      if (!file) return

      // 限制檔案格式與大小
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('僅支援 JPG 或 PNG 格式')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('圖片大小不能超過 10MB')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await uploadImage(formData)
        form.plans[index].feedback_img = res.data.url
      } catch (err) {
        console.error('圖片上傳失敗', err)
        alert('圖片上傳失敗，請稍後再試')
      }
    }

    const submitPlans = async () => {
      if (!token) {
        alert('未登入或 token 遺失')
        return
      }
      isSubmitting.value = true
      try {
        for (const [i, plan] of form.plans.entries()) {
          if (
            !plan.plan_name ||
            !plan.amount ||
            !plan.quantity ||
            !plan.feedback ||
            !plan.feedback_img ||
            !plan.delivery_date ||
            plan.amount <= 0
          ) {
            alert(`第 ${i + 1} 筆回饋方案未填寫完整或金額錯誤`)
            isSubmitting.value = false
            return
          }
        }

        await Promise.all(
          form.plans.map((plan) => {
            const planPayload = {
              plan_name: plan.plan_name,
              amount: plan.amount,
              quantity: plan.quantity,
              feedback: plan.feedback,
              feedback_img: plan.feedback_img,
              delivery_date: plan.delivery_date,
            }
            if (plan.id) {
              return updateProjectPlan(form.project_id, plan.id, planPayload, token)
            } else {
              return createProjectPlan(form.project_id, planPayload, token)
            }
          })
        )

        alert('回饋方案提交成功！')
        router.push(`/projects/${form.project_id}`)
      } catch (err) {
        console.error('回饋方案提交失敗', err)
        alert('回饋方案提交失敗')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      addPlan,
      removePlan,
      submitPlans,
      projectData,
      isSubmitting,
      isEdit,
      handlePlanImageUpload,
    }
  },
}
</script>

<style scoped>
.project-plan-wrapper {
  padding-top: 100px !important; /* 根據 navbar 實際高度調整 */
  min-height: 100vh;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

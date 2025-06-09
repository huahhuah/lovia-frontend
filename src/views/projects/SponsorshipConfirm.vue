<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <h3 class="fw-bold mb-4">贊助確認頁</h3>

      <div v-if="project && selectedPlan" class="container py-5">
        <!-- 標題與金額 -->
        <div class="text-center mb-4">
          <h5 class="fw-bold">贊助專案名稱：{{ project.title }}</h5>
          <p class="fs-5 mt-2">方案金額 NT$ {{ selectedPlan.amount }}</p>
          <hr />
        </div>

        <div class="row">
          <!-- 左側 -->
          <div class="col-lg-8">
            <section class="mb-4">
              <h6 class="fw-bold">🎁 理念支持回饋品</h6>
              <p class="text-muted">{{ selectedPlan.feedback }}</p>
              <img
                :src="imgSrc"
                @error="onImageError"
                class="img-fluid mb-3"
                style="max-width: 300px"
              />
            </section>

            <section class="mb-3">
              <label class="form-label fw-bold">列名感謝顯示名稱</label>
              <input v-model="donorName" class="form-control" placeholder="請輸入希望公開的名稱" />
            </section>

            <section>
              <label class="form-label fw-bold">備註</label>
              <textarea
                v-model="note"
                class="form-control"
                rows="4"
                placeholder="如有特殊需求請填寫"
              ></textarea>
            </section>
          </div>

          <!-- 右側 -->
          <div class="col-lg-4">
            <div class="border rounded-4 p-4 shadow-sm">
              <p class="mb-1 fw-bold">方案金額：NT$ {{ selectedPlan.amount }}</p>

              <label class="form-label fw-bold mt-2">額外贊助金額（可輸入加碼）</label>
              <input
                type="number"
                min="0"
                step="1"
                v-model.number="extraAmount"
                class="form-control"
                :readonly="isLongTerm"
                placeholder="例如：100"
              />

              <div class="text-end mt-3 fs-5 fw-bold">總金額 NT$ {{ totalAmount }}</div>

              <button class="btn btn-primary w-100 mt-3" @click="confirmSponsorship">
                確認贊助
              </button>

              <p class="text-muted mt-3 small">備註：「確認贊助」即代表您同意平台付款條款。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectOverview, getProjectPlans, sponsorProjectPlan } from '@/api/project'
import defaultImg from '@/assets/images/default.png'
import { useUserStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useUserStore()
const user = authStore.user

const projectId = Number(route.query.projectId)
const planId = Number(route.query.planId)

const project = ref(null)
const selectedPlan = ref(null)
const donorName = ref('')
const note = ref('')
const imgSrc = ref(defaultImg)
const isLongTerm = ref(false)

const extraAmount = ref(0)
const totalAmount = computed(() =>
  selectedPlan.value ? selectedPlan.value.amount + extraAmount.value : 0
)

const onImageError = () => {
  imgSrc.value = defaultImg
}

onMounted(async () => {
  if (!projectId || !planId) {
    alert('參數錯誤，請重新進入頁面')
    router.push('/')
    return
  }

  try {
    const projectRes = await getProjectOverview(projectId)
    project.value = projectRes.data.data
    isLongTerm.value = project.value.project_type === '長期贊助'

    const plansRes = await getProjectPlans(projectId)
    const plans = Array.isArray(plansRes.data.data) ? plansRes.data.data : []

    selectedPlan.value = plans.find(
      (p) => Number(p.plan_id) === planId && Number(p.project_id) === projectId
    )

    if (!selectedPlan.value) {
      alert('找不到該專案對應的贊助方案，請重新選擇')
      router.push('/')
      return
    }

    if (selectedPlan.value.feedback_img) {
      const testImg = new Image()
      testImg.src = selectedPlan.value.feedback_img
      testImg.onload = () => (imgSrc.value = testImg.src)
    }
  } catch (err) {
    console.error(' 專案資料取得失敗', err)
    alert('找不到該專案，請重新操作')
    router.push('/')
  }
})

async function confirmSponsorship() {
  if (!authStore.token) {
    alert('請先登入才能贊助')
    router.push('/login')
    return
  }

  if (!selectedPlan.value) {
    alert('找不到對應的贊助方案，請重新操作')
    return
  }

  if (!Number.isInteger(extraAmount.value) || extraAmount.value < 0) {
    alert('額外贊助金額格式錯誤，請輸入正整數')
    return
  }

  const amount = selectedPlan.value.amount + extraAmount.value
  if (!Number.isInteger(amount) || amount <= 0) {
    alert('贊助金額必須為正整數')
    return
  }

  const payload = {
    sponsorship: {
      display_name: donorName.value.trim() || '匿名',
      note: note.value.trim(),
      quantity: 1,
      amount,
    },
    invoice: {
      type: 'donate',
      carrier_code: null,
      tax_id: null,
    },
    shipping: {
      name: user?.username || '未提供姓名',
      phone: '0912345678',
      address: '未填地址',
      note: '',
    },
  }

  console.log('傳送 payload:', JSON.stringify(payload, null, 2))

  try {
    const res = await sponsorProjectPlan(projectId, planId, payload, authStore.token)

    const sponsorData = {
      project_id: projectId,
      plan_id: selectedPlan.value.plan_id,
      display_name: payload.sponsorship.display_name,
      note: payload.sponsorship.note,
      account: user?.account || '',
      feedback: selectedPlan.value.feedback,
      base_amount: selectedPlan.value.amount,
      total_amount: amount,
      project_title: project.value.title,
      order_uuid: res.data?.order_uuid || '',
    }

    localStorage.setItem('sponsorFormData', JSON.stringify(sponsorData))

    router.push({
      path: '/checkout/order',
      query: {
        projectId: String(projectId),
        planId: String(selectedPlan.value.plan_id),
      },
    })
  } catch (error) {
    console.error('贊助失敗:', error)
    alert(error.response?.data?.message || '贊助過程發生錯誤，請稍後再試')
  }
}
</script>

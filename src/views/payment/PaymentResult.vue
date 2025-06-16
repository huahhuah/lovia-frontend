<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <h2 class="mb-4 fw-bold text-center">交易結果</h2>

      <!-- 載入中 -->
      <div v-if="loading" class="text-center py-5 fs-5">🔄 資料載入中，請稍候...</div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="text-center text-danger py-5">
        ⚠️ {{ error }}
        <div class="mt-4">
          <a href="/" class="btn btn-outline-secondary me-2">返回首頁</a>
          <a href="/#/checkout" class="btn btn-primary">重新贊助</a>
        </div>
      </div>

      <!-- 成功畫面 -->
      <div v-else>
        <div class="bg-light p-4 text-center mb-4 border rounded">
          <h4 class="fw-bold text-success mb-3">🎉 感謝您的贊助！</h4>
          <p class="text-muted">
            一封確認信已寄送至 <strong>{{ maskedEmail }}</strong
            >，請記得查收。
          </p>
        </div>

        <!-- 付款資料 -->
        <div class="bg-body-tertiary border p-4 mb-4 rounded">
          <h5 class="fw-bold mb-3">💳 付款資訊</h5>
          <p><strong>交易編號：</strong>{{ result.transactionId || '未提供' }}</p>
          <p><strong>付款金額：</strong>NT$ {{ result.amount || '未提供' }}</p>
          <p><strong>付款時間：</strong>{{ result.paidAt || '未提供' }}</p>
          <p><strong>付款方式：</strong>{{ result.paymentMethod || '未提供' }}</p>
        </div>

        <!-- 贊助人資料 -->
        <div class="bg-body-tertiary border p-4 rounded">
          <h5 class="fw-bold mb-3">🙋 贊助者資訊</h5>
          <p><strong>贊助姓名：</strong>{{ result.display_name || '未提供' }}</p>
          <p><strong>電子信箱：</strong>{{ result.email || '未提供' }}</p>
          <p><strong>收件人：</strong>{{ result.recipient || '未提供' }}</p>
          <p><strong>電話：</strong>{{ result.phone || '未提供' }}</p>
          <p><strong>地址：</strong>{{ result.address || '未提供' }}</p>
          <p><strong>備註：</strong>{{ result.note || '無' }}</p>
        </div>

        <div class="text-center mt-5">
          <router-link to="/" class="btn btn-outline-secondary me-2">返回首頁</router-link>
          <router-link to="/projects/mine" class="btn btn-success">查看我的贊助</router-link>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/auth'

const route = useRoute()
const userStore = useUserStore()
const orderId = route.params.orderId

//  嘗試從 localStorage/sessionStorage 還原 token
onMounted(() => {
  const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token')
  if (storedToken && !userStore.token) {
    userStore.setToken(storedToken)
    console.log(' token 已還原至 userStore')
  }
})

const token = computed(() => userStore.token || '') //  動態取得 token，避免為空

// 預設結果欄位，避免 undefined 報錯
const result = ref({
  transactionId: '',
  amount: '',
  paidAt: '',
  paymentMethod: '',
  display_name: '',
  email: '',
  recipient: '',
  phone: '',
  address: '',
  note: '',
})

const loading = ref(true)
const error = ref('')

// 當 token 有值時觸發 API 請求
watch(
  () => token.value,
  async (val) => {
    if (!val) return

    await nextTick()
    loading.value = true
    error.value = ''

    try {
      const res = await fetch(
        `https://lovia-backend-xl4e.onrender.com/api/v1/users/orders/${orderId}/payment/success`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${val}`,
          },
        }
      )
      const json = await res.json()
      console.log('付款成功資料：', json)
      if (!json.status || !json.data) throw new Error(json.message || '查無資料')

      result.value = {
        transactionId: json.order_uuid,
        amount: json.amount,
        paidAt: json.paid_at,
        paymentMethod: json.payment_method || '綠界 / LINE Pay',
        display_name: json.display_name || '匿名',
        email: json.email || '',
        recipient: json.shipping?.name || '',
        phone: json.shipping?.phone || '',
        address: json.shipping?.address || '',
        note: json.note || '',
      }
    } catch (err) {
      console.error('付款資料取得失敗:', err)
      error.value = err.message || '查詢付款結果失敗'
    } finally {
      loading.value = false
    }
  }
)

const maskedEmail = computed(() => {
  const email = result.value?.email || ''
  return email.replace(/^(.{3})(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`)
})
</script>

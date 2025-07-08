<!-- 填寫訂單 -->
<template>
  <SponsorshipLayout>
    <div class="container py-5">
      <div class="narrow-wrapper mx-auto">
        <div class="row">
          <div class="col-lg-8">
            <section class="mb-5">
              <h5 class="fw-bold">購買人（贊助人）</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">會員名稱</label>
                  <input v-model="form.name" class="form-control" placeholder="會員名稱" readonly />
                </div>
                <div class="col-md-6">
                  <label class="form-label">電子信箱</label>
                  <input
                    v-model="form.account"
                    class="form-control"
                    placeholder="電子信箱"
                    readonly
                  />
                </div>
              </div>
            </section>

            <section class="mb-5">
              <h5 class="fw-bold">收據類型</h5>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  value="email"
                  v-model="form.receiptType"
                  id="emailReceipt"
                />
                <label class="form-check-label" for="emailReceipt">
                  電子收據（寄送到 Email）
                </label>
              </div>

              <div class="form-check mt-2">
                <input
                  class="form-check-input"
                  type="radio"
                  value="paper"
                  v-model="form.receiptType"
                  id="paperReceipt"
                />
                <label class="form-check-label" for="paperReceipt"> 紙本收據（郵寄到地址） </label>
              </div>

              <p class="text-danger small mt-2" v-if="errors.receiptType">
                {{ errors.receiptType }}
              </p>
            </section>

            <section class="mb-5">
              <div class="form-group mt-2">
                <label class="form-label">身份證字號（用於申報所得稅扣除）</label>
                <input
                  v-model="form.idNumber"
                  class="form-control"
                  placeholder="例如 A123456789"
                  @input="errors.idNumber = ''"
                  maxlength="10"
                />
                <p class="text-danger small mt-1" v-if="errors.idNumber">{{ errors.idNumber }}</p>
                <small class="text-muted"> ※ 僅作為申報所得稅扣除使用，依個資法保護您的隱私 </small>
              </div>
            </section>

            <section class="mb-5">
              <h5 class="fw-bold">寄送資料</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <input
                    v-model="form.recipient"
                    class="form-control"
                    placeholder="收件人姓名"
                    @input="errors.recipient = ''"
                  />
                  <p class="text-danger small" v-if="errors.recipient">{{ errors.recipient }}</p>
                </div>
                <div class="col-md-6">
                  <input
                    v-model="form.phone"
                    class="form-control"
                    placeholder="聯絡電話"
                    @input="errors.phone = ''"
                  />
                  <p class="text-danger small" v-if="errors.phone">{{ errors.phone }}</p>
                </div>
              </div>
              <div class="row g-3 mt-3">
                <div class="col-md-4">
                  <input
                    v-model="form.zipcode"
                    class="form-control"
                    placeholder="郵遞區號"
                    @input="errors.zipcode = ''"
                  />
                  <p class="text-danger small" v-if="errors.zipcode">{{ errors.zipcode }}</p>
                  <p class="text-muted small mt-1" v-if="zipcodeDistrict">
                    郵遞區號對應行政區：{{ zipcodeDistrict }}
                  </p>
                </div>

                <div class="col-md-8">
                  <input
                    v-model="form.address"
                    class="form-control"
                    placeholder="地址"
                    @input="errors.address = ''"
                  />
                  <p class="text-danger small" v-if="errors.address">{{ errors.address }}</p>
                </div>
              </div>
              <textarea
                v-model="form.note"
                class="form-control mt-3"
                rows="3"
                placeholder="備註（選填）"
              ></textarea>
            </section>

            <section class="mb-5">
              <h5 class="fw-bold">付款方式</h5>
              <div class="row g-3">
                <div class="col-4" v-for="option in paymentList" :key="option.value">
                  <label
                    class="payment-radio w-100 d-flex flex-column align-items-center justify-content-center"
                    :class="{ active: form.payment === option.value }"
                  >
                    <input
                      type="radio"
                      class="d-none"
                      :value="option.value"
                      v-model="form.payment"
                      @change="errors.payment = ''"
                    />
                    <img
                      :src="option.icon"
                      :alt="option.label"
                      :class="['payment-icon', { 'large-linepay': option.value === 'linepay' }]"
                    />
                    <div>{{ option.label }}</div>
                  </label>
                </div>
              </div>
              <p class="text-danger small mt-2" v-if="errors.payment">{{ errors.payment }}</p>
            </section>
          </div>

          <div class="col-lg-4 d-flex justify-content-end">
            <div class="card p-4 shadow-sm" style="width: 100%; max-width: 320px">
              <h6 class="fw-bold">訂單明細</h6>
              <p class="mb-1">專案名稱: {{ sponsorData.project_title || '專案名稱載入中' }}</p>
              <p class="text-muted small">
                贊助方案：{{ sponsorData.feedback || '方案資訊載入中' }}（NT$ {{ baseAmount }}）
              </p>
              <hr />
              <div class="d-flex justify-content-between">
                <span>方案贊助</span>
                <span>NT$ {{ baseAmount }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>額外贊助</span>
                <span>NT$ {{ extraAmount }}</span>
              </div>
              <hr />
              <div class="d-flex justify-content-between fw-bold">
                <span>總計</span>
                <span>NT$ {{ totalAmount }}</span>
              </div>
              <button
                class="btn btn-primary w-100 mt-3"
                @click="submitOrder"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? '送出中...' : '送出訂單' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { createSponsorship } from '@/api/project'
import { useUserStore } from '@/stores/auth'
import { zipcodeMap, getDistrictByZipcode } from '@/utils/zipcodeMap'
import creditIcon from '@/assets/images/credit.png'
import atmIcon from '@/assets/icons/atm.png'
import linePayIcon from '@/assets/icons/LINE_Pay.png'
import { useRestoreAuth } from '@/composables/useRestoreAuth'

useRestoreAuth()

const paymentList = [
  { value: 'card', label: '信用卡', icon: creditIcon },
  { value: 'webatm', label: 'WebATM', icon: atmIcon },
  { value: 'linepay', icon: linePayIcon },
]

const authStore = useUserStore()
const router = useRouter()

const sponsorData = ref({})
const projectId = ref(null)
const planId = ref(null)

const form = ref({
  name: '',
  account: '',
  receiptType: 'email', // 新增，預設電子收據
  idNumber: '',
  recipient: '',
  phone: '',
  zipcode: '',
  address: '',
  note: '',
  payment: '',
})

const errors = ref({
  receiptType: '',
  idNumber: '',
  recipient: '',
  phone: '',
  zipcode: '',
  address: '',
  payment: '',
  note: '',
})

function isValidTaiwanID(id) {
  if (!/^[A-Z][12]\d{8}$/i.test(id)) return false

  const letters = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 34,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    O: 35,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    W: 32,
    X: 30,
    Y: 31,
    Z: 33,
  }
  id = id.toUpperCase()
  const code = letters[id[0]]
  const n1 = Math.floor(code / 10)
  const n2 = code % 10
  const nums = [n1, n2, ...id.slice(1).split('').map(Number)]

  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const sum = nums.reduce((acc, cur, idx) => acc + cur * weights[idx], 0)

  return sum % 10 === 0
}

// 驗證收據
function validateReceiptForm(form) {
  errors.value.receiptType = ''
  errors.value.idNumber = ''

  let isValid = true

  if (!form.receiptType) {
    errors.value.receiptType = '請選擇收據類型'
    isValid = false
  }

  if (form.idNumber && !isValidTaiwanID(form.idNumber.trim())) {
    errors.value.idNumber = '身份證號碼無效（檢碼錯誤）'
    isValid = false
  }

  return isValid
}

// 驗證寄送資料
function validateOrderForm(form) {
  errors.value.recipient = ''
  errors.value.phone = ''
  errors.value.zipcode = ''
  errors.value.address = ''
  errors.value.payment = ''

  let isValid = true

  if (!form.recipient.trim()) {
    errors.value.recipient = '請填寫收件人姓名'
    isValid = false
  }

  if (!/^09\d{8}$/.test(form.phone)) {
    errors.value.phone = '手機格式錯誤，請輸入 09 開頭的 10 碼號碼'
    isValid = false
  }

  if (!form.zipcode.trim()) {
    errors.value.zipcode = '請填寫郵遞區號'
    isValid = false
  } else if (!/^\d{3}$/.test(form.zipcode) || !(form.zipcode in zipcodeMap)) {
    errors.value.zipcode = '請輸入有效的郵遞區號'
    isValid = false
  }

  if (!form.address.trim()) {
    errors.value.address = '請填寫地址'
    isValid = false
  } else if (form.address.length < 6) {
    errors.value.address = '地址太短，請輸入完整地址'
    isValid = false
  } else if (/https?:\/\//i.test(form.address)) {
    errors.value.address = '地址格式錯誤，請勿輸入網址'
    isValid = false
  } else {
    const district = getDistrictByZipcode(form.zipcode)
    if (district && !form.address.includes(district)) {
      errors.value.address = `地址需包含所屬區域名稱：${district}`
      isValid = false
    }
  }

  if (!form.payment) {
    errors.value.payment = '請選擇付款方式'
    isValid = false
  }

  return isValid
}

// 方案原始金額
const baseAmount = computed(() => {
  const base = sponsorData.value.base_amount
  return Number.isFinite(base) ? base : 0
})

// 額外贊助金額：總金額 - 原始金額
const extraAmount = computed(() => {
  const total = sponsorData.value.total_amount
  const base = baseAmount.value
  return Number.isFinite(total) && total > base ? total - base : 0
})

// 顯示用總金額
const totalAmount = computed(() => {
  const total = sponsorData.value.total_amount
  return Number.isFinite(total) && total >= 0 ? total : baseAmount.value
})

const zipcodeDistrict = computed(() => {
  return getDistrictByZipcode(form.value.zipcode) || ''
})

onMounted(() => {
  //  強制還原 token（若沒有）以防刷新後失效
  if (!authStore.token) {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      authStore.setToken(storedToken)
    }
  }

  //  還原 user（optional，加強保險）
  if (!authStore.user) {
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      try {
        authStore.setUser(JSON.parse(rawUser))
        console.log(' user 還原成功')
      } catch (e) {
        console.warn(' user 還原失敗:', e)
      }
    }
  }

  // 取得 localStorage 贊助資料
  const raw = localStorage.getItem('sponsorFormData')
  if (!raw) {
    alert('找不到贊助資料，請重新操作')
    router.push('/checkout')
    return
  }

  const parsed = JSON.parse(raw)

  // 檢查 project_id 與 plan_id 是否存在
  if (!parsed.project_id || !parsed.plan_id) {
    alert('找不到專案資訊，請重新操作')
    router.push('/checkout')
    return
  }

  sponsorData.value = parsed

  // base_amount
  if (!Number.isFinite(sponsorData.value.base_amount)) {
    sponsorData.value.base_amount = parsed.base_amount || parsed.amount || 0
  }

  //  total_amount（包含額外贊助）
  if (!Number.isFinite(sponsorData.value.total_amount)) {
    sponsorData.value.total_amount = parsed.amount || sponsorData.value.base_amount
  }

  projectId.value = parsed.project_id
  planId.value = parsed.plan_id

  // 從會員資料預填
  form.value.name = authStore.user?.username || ''
  form.value.account = authStore.user?.account || ''
})

watchEffect(() => {
  if (authStore.user && authStore.user.account) {
    form.value.name = authStore.user.username || ''
    form.value.account = authStore.user.account || ''
  }
})

const isSubmitting = ref(false)

async function submitOrder() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const token = authStore.token
  if (!token) {
    alert('請先登入')
    router.push('/login')
    isSubmitting.value = false
    return
  }

  if (!projectId.value || !planId.value) {
    alert('找不到專案資訊，請重新操作')
    isSubmitting.value = false
    return
  }

  if (!validateReceiptForm(form.value) || !validateOrderForm(form.value)) {
    isSubmitting.value = false
    return
  }

  const amount = totalAmount.value
  if (!Number.isInteger(amount) || amount <= 0) {
    alert('贊助金額必須為正整數')
    isSubmitting.value = false
    return
  }

  const payload = {
    sponsorship: {
      display_name: sponsorData.value.display_name || form.value.name || '匿名',
      note: sponsorData.value.note || '',
      quantity: 1,
      amount,
    },
    shipping: {
      name: form.value.recipient,
      phone: form.value.phone,
      address: `${form.value.zipcode} ${form.value.address}`,
      note: form.value.note,
    },
    receipt: {
      type: form.value.receiptType,
      id_number: form.value.idNumber.trim() || null,
    },
  }

  try {
    const res = await createSponsorship(projectId.value, planId.value, payload, token)

    const orderId = res.data?.orderId || res.data?.order_uuid
    if (!orderId) {
      alert('建立訂單失敗，請稍後再試')
      return
    }

    localStorage.setItem(
      'checkoutOrderData',
      JSON.stringify({
        order_uuid: orderId,
        amount,
        name: form.value.name,
        email: form.value.account,
        recipient: form.value.recipient,
        phone: form.value.phone,
        zipcode: form.value.zipcode,
        address: form.value.address,
        note: form.value.note,
        display_name: sponsorData.value.display_name,
        project_title: sponsorData.value.project_title,
        feedback: sponsorData.value.feedback,
        base_amount: sponsorData.value.base_amount || amount,
        payment: form.value.payment || 'card',
        selectedPlan: {
          plan_name: sponsorData.value.plan_name || '',
          feedback: sponsorData.value.feedback || '',
        },
      })
    )

    router.push('/checkout/confirm')
  } catch (err) {
    console.error('建立訂單失敗:', err)
    alert(err.response?.data?.message || '建立訂單失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.narrow-wrapper {
  max-width: 900px;
  width: 100%;
}

.card {
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.btn.active {
  background-color: #ffb6a7;
  color: white;
  border-color: #0d0d0c;
}

.btn-outline-secondary:hover {
  background-color: #ffe1d9 !important;
  border-color: #ffb6a7 !important;
  color: #0d0d0c !important;
}

.btn-outline-secondary.active:hover {
  background-color: #ffa18f !important;
  border-color: #ffa18f !important;
  color: #0d0d0c !important;
}

.btn-outline-secondary.active {
  background-color: #ffb6a7 !important;
  border-color: #ffb6a7 !important;
  color: #0d0d0c !important;
}

.btn.btn-primary {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  color: white !important;
  border-radius: 50px !important;
  font-weight: bold;
}

.btn.btn-primary:hover {
  background-color: #e0433b !important;
  border-color: #e0433b !important;
  color: white !important;
}

.btn.btn-primary:disabled {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  opacity: 0.65;
  border-radius: 50px !important;
}

.payment-radio {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  height: 100px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.payment-radio.active {
  border-color: #fc5b53;
  background-color: #ffe1d9;
}

.payment-radio img {
  width: 40px;
  height: auto;
  margin-bottom: 0.5rem;
}

.payment-radio div {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.payment-icon {
  width: 40px;
  height: auto;
  margin-bottom: 0.5rem;
}

.large-linepay {
  width: 50px !important;
  padding-top: 10px;
}
</style>

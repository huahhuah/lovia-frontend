<!-- 填寫訂單 -->
<template>
  <SponsorshipLayout>
    <div class="container py-5">
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
            <h5 class="fw-bold">發票類型</h5>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="donate"
                v-model="form.invoiceType"
                id="donateInvoice"
              />
              <label class="form-check-label" for="donateInvoice">捐贈發票</label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                value="mobile"
                v-model="form.invoiceType"
                id="mobileInvoice"
              />
              <label class="form-check-label" for="mobileInvoice">個人發票（手機條碼）</label>
            </div>

            <div v-if="form.invoiceType === 'mobile'" class="form-group mt-2">
              <input
                v-model="form.mobileBarcode"
                class="form-control"
                placeholder="請輸入手機載具條碼"
                @input="errors.mobileBarcode = ''"
              />
              <p class="text-danger small mt-1" v-if="errors.mobileBarcode">
                {{ errors.mobileBarcode }}
              </p>
            </div>

            <div class="form-check mt-2">
              <input
                class="form-check-input"
                type="radio"
                value="paper"
                v-model="form.invoiceType"
                id="paperInvoice"
              />
              <label class="form-check-label" for="paperInvoice">個人發票（紙本寄送）</label>
            </div>

            <div v-if="form.invoiceType === 'paper'" class="form-group mt-2">
              <input
                v-model="form.taxId"
                class="form-control"
                placeholder="請輸入統一編號（8碼數字，可留空）"
                @input="errors.taxId = ''"
              />
              <p class="text-danger small mt-1" v-if="errors.taxId">{{ errors.taxId }}</p>
            </div>
            <p class="text-danger small mt-2" v-if="errors.invoiceType">{{ errors.invoiceType }}</p>
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
            <div class="d-flex gap-3 flex-wrap">
              <button
                class="btn btn-outline-secondary"
                :class="{ active: form.payment === 'card' }"
                @click="
                  () => {
                    form.payment = 'card'
                    errors.payment = ''
                  }
                "
              >
                <img
                  src="/src/assets/images/credit.png"
                  alt="信用卡"
                  style="width: 40px; height: 40px"
                />
                信用卡
              </button>

              <button
                class="btn btn-outline-secondary"
                :class="{ active: form.payment === 'atm' }"
                @click="
                  () => {
                    form.payment = 'atm'
                    errors.payment = ''
                  }
                "
              >
                <img src="/src/assets/icons/atm.svg" alt="ATM" style="width: 40px; height: 40px" />
                ATM
              </button>

              <button
                class="btn btn-outline-secondary"
                :class="{ active: form.payment === 'linepay' }"
                @click="
                  () => {
                    form.payment = 'linepay'
                    errors.payment = ''
                  }
                "
              >
                <img
                  src="/src/assets/icons/LINE_Pay.svg"
                  alt="LinePay"
                  style="width: 80px; height: auto"
                />
              </button>
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
  </SponsorshipLayout>
</template>

<script setup>
import SponsorshipLayout from '@/layouts/SponsorshipLayout.vue'
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { createSponsorship } from '@/api/project'
import { useUserStore } from '@/stores/auth'
import { zipcodeMap, getDistrictByZipcode } from '@/utils/zipcodeMap'

const authStore = useUserStore()
const router = useRouter()

const sponsorData = ref({})
const projectId = ref(null)
const planId = ref(null)

const form = ref({
  name: '',
  account: '',
  invoiceType: '',
  mobileBarcode: '',
  taxId: '',
  recipient: '',
  phone: '',
  zipcode: '',
  address: '',
  note: '',
  payment: '',
})

const errors = ref({
  invoiceType: '',
  mobileBarcode: '',
  taxId: '',
  recipient: '',
  phone: '',
  zipcode: '',
  address: '',
  payment: '',
  note: '',
})

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

onMounted(() => {
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

// 發票驗證：含手機條碼、統一編號格式、邏輯限制
function validateInvoiceForm(form) {
  errors.value.invoiceType = ''
  errors.value.mobileBarcode = ''
  errors.value.taxId = ''
  errors.value.note = ''

  const type = form.invoiceType
  const carrier = form.mobileBarcode?.trim()
  const taxId = form.taxId?.trim()
  let isValid = true

  if (!type) {
    errors.value.invoiceType = '請選擇發票類型'
    isValid = false
  }

  if (type === 'mobile' && !/^\/[A-Z0-9]{7}$/i.test(carrier)) {
    errors.value.mobileBarcode = '手機條碼格式錯誤，需以 / 開頭並為 8 碼'
    isValid = false
  }

  if (type === 'donate' && (carrier || taxId)) {
    errors.value.invoiceType = '捐贈發票不應填寫手機條碼或統一編號'
    isValid = false
  }

  if (type === 'paper' && taxId && !/^\d{8}$/.test(taxId)) {
    errors.value.taxId = '統一編號應為 8 碼數字'
    isValid = false
  }

  return isValid
}

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
  }

  if (!form.payment) {
    errors.value.payment = '請選擇付款方式'
    isValid = false
  }

  return isValid
}

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

  if (!validateInvoiceForm(form.value) || !validateOrderForm(form.value)) {
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
    invoice: {
      type: form.value.invoiceType,
      carrier_code:
        form.value.invoiceType === 'mobile' && form.value.mobileBarcode?.trim()
          ? form.value.mobileBarcode.trim()
          : null,
      tax_id:
        form.value.invoiceType === 'paper' && form.value.taxId?.trim()
          ? form.value.taxId.trim()
          : null,
    },
  }

  try {
    const res = await createSponsorship(projectId.value, planId.value, payload, token)

    if (!res.data?.order_uuid) {
      alert('建立訂單失敗，請稍後再試')
      return
    }

    localStorage.setItem(
      'checkoutOrderData',
      JSON.stringify({
        order_uuid: res.data.order_uuid,
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
.card {
  border-radius: 1rem;
}

.btn.active {
  background-color: #ffb6a7;
  color: white;
  border-color: #0d0d0c;
}

/* 覆蓋 hover 時的灰色背景 */
.btn-outline-secondary:hover {
  background-color: #ffe1d9 !important; /* 自訂 hover 背景色 */
  border-color: #ffb6a7 !important;
  color: #0d0d0c !important;
}

/* 若已被選取（active）+ hover 狀態下的樣式 */
.btn-outline-secondary.active:hover {
  background-color: #ffa18f !important;
  border-color: #ffa18f !important;
  color: #0d0d0c !important;
}

/* 若按鈕是 active 狀態（選取後） */
.btn-outline-secondary.active {
  background-color: #ffb6a7 !important;
  border-color: #ffb6a7 !important;
  color: #0d0d0c !important;
}

.btn.btn-primary {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  color: white !important;
}

.btn.btn-primary:hover {
  background-color: #e0433b !important; /* 可選：hover 深一點 */
  border-color: #e0433b !important;
  color: white !important;
}

.btn.btn-primary:disabled {
  background-color: #fc5b53 !important;
  border-color: #fc5b53 !important;
  opacity: 0.65;
}
</style>

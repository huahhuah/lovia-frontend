<template>
    <div class="container py-5">
      <h2 class="mb-4">申請成為提案者</h2>
  
      <div class="alert alert-info">
        若您希望成為提案者，請提供以下資料，供平台審核：
      </div>
  
      <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="campaignUrl" class="form-label">衛福部公益勸募活動許可網址
            <a href="https://sasw.mohw.gov.tw/app39/" target="_blank" rel="noopener noreferrer" class="ms-2" >
            點擊進入網頁
            </a>
          </label>
          <input
            type="url"
            id="campaignUrl"
            v-model="form.campaignUrl"
            class="form-control"
            required
            placeholder="https://..."
          />
        </div>
  
        <div class="mb-3">
          <label for="accountInfo" class="form-label">勸募活動專戶資訊</label>
          <textarea
            id="accountInfo"
            v-model="form.accountInfo"
            class="form-control"
            rows="3"
            required
            placeholder="請填寫戶名、銀行名稱、分行名稱、帳號"
          ></textarea>
        </div>
  
        <div class="d-flex gap-3">
          <button type="submit" class="btn btn-dark">送出申請</button>
          <button type="button" class="btn btn-outline-secondary" @click="handleCancel">取消</button>
        </div>
  
        <div v-if="message" :class="`alert mt-4 ${messageType}`">
          {{ message }}
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/auth'
  
  const router = useRouter()
  const userStore = useUserStore()
  const form = ref({
    campaignUrl: '',
    accountInfo: '',
  })
  
  const message = ref('')
  const messageType = ref('alert-success') // or alert-danger
  
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'https://lovia-backend-xl4e.onrender.com/api/v1/proposer/apply',
        {
          campaignUrl: form.value.campaignUrl,
          accountInfo: form.value.accountInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }
      )
  
      message.value = '申請已送出，待管理員審核'
      messageType.value = 'alert-success'
  
      setTimeout(() => {
        router.push('/user')
      }, 2500)
    } catch (error) {
      message.value = error.response?.data?.message || '送出失敗，請稍後再試'
      messageType.value = 'alert-danger'
    }
  }
  
  const handleCancel = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  textarea {
    resize: vertical;
  }
  </style>
  
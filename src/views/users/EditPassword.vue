<template>
  <div class="container py-5">
    <h3 class="mb-4">修改密碼</h3>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">舊密碼</label>
        <input type="password" v-model="oldPassword" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">新密碼</label>
        <input type="password" v-model="newPassword" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">確認新密碼</label>
        <input type="password" v-model="confirmPassword" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">送出</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

function submit() {
  if (newPassword.value !== confirmPassword.value) {
    alert('新密碼與確認不一致')
    return
  }

  // TODO: 發送 API
  alert('提交成功（模擬）')
}
</script>

<template>
  <div class="container py-5">
    <h1 class="mb-4">管理員後台</h1>
    <p>這是只有管理員才能看到的內容。</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/auth'
const userStore = useUserStore()
</script>

<template>
  <div class="container text-center mt-5">
    <h1 class="text-danger display-4">🚫 無權限訪問</h1>
    <p class="lead mt-3">您沒有權限瀏覽這個頁面。</p>
    <router-link to="/" class="btn btn-primary mt-4">回首頁</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  max-width: 600px;
}
</style>

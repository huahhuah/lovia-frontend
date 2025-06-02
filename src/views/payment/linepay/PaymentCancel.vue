<template>
  <div class="container py-5 text-center">
    <h2 class="text-danger mb-4">付款未完成</h2>
    <p>您已取消 LINE Pay 的付款流程，訂單尚未成立。</p>
    <router-link to="/checkout/linepay" class="btn btn-outline-primary mt-4">
      返回重新付款
    </router-link>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>

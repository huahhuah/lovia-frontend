<template>
  <div class="container py-5">
    <h2>使用 LINE Pay 支付</h2>
    <button class="btn btn-success" @click="startPayment">前往付款</button>
  </div>
</template>

<script setup>
import axios from 'axios'

const startPayment = async () => {
  const payload = {
    amount: 100,
    orderId: 'order_' + Date.now(),
    productName: '贊助專案 A',
  }

  try {
    const res = await axios.post('http://localhost:8080/api/v1/payments/linepay/reserve', payload)
    console.log('LINE Pay 回應：', res.data)

    // 確保 info 存在才使用
    if (res.data?.info?.paymentUrl?.web) {
      window.location.href = res.data.info.paymentUrl.web
    } else {
      alert(' LINE Pay 沒有提供付款網址')
    }
  } catch (err) {
    console.error('付款失敗', err)
    alert('付款錯誤：' + (err.response?.data?.message || err.message))
  }
}
</script>

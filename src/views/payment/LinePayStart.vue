<template>
  <div class="container py-5">
    <h2>使用 LINE Pay 支付</h2>
    <button class="btn btn-success" @click="startPayment">前往付款</button>
  </div>
</template>

<script setup>
import axios from 'axios'

const startPayment = async () => {
  const orderData = JSON.parse(localStorage.getItem('checkoutOrderData'))
  const token = localStorage.getItem('token')

  if (!orderData || !orderData.orderId) {
    return alert('找不到訂單資訊，請重新確認流程')
  }

  const payload = {
    amount: orderData.amount,
    orderId: orderData.orderId,
    productName: orderData.productName || '贊助專案',
  }

  try {
    const res = await axios.post('http://localhost:8080/api/v1/payments/linepay/reserve', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const url = res.data?.data?.payment_url
    if (url) {
      window.location.href = url
    } else {
      alert('LINE Pay 沒有提供付款網址')
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message
    const status = err.response?.status
    console.error('付款失敗', err)
    alert(`付款錯誤（${status}）：${msg}`)
  }
}
</script>

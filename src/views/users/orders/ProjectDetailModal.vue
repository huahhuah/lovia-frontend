<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-container">
      <h3>專案詳細資訊</h3>
      <p><strong>專案名稱：</strong>{{ project.title }}</p>
      <p><strong>目標金額：</strong>{{ formatCurrency(project.targetAmount) }}</p>
      <p><strong>支持金額：</strong>{{ formatCurrency(project.supportAmount) }}</p>
      <p><strong>狀態：</strong>{{ project.status }}</p>
      <p><strong>回饋品：</strong>{{ project.rewardItem || '無' }}</p>
      <p><strong>配送地址：</strong>{{ project.shippingInfo || '無' }}</p>
      <button @click="$emit('close')">關閉</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetailModal',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatCurrency(amount) {
      if (!amount) return '無資料'
      const num = Number(amount)
      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
      }).format(num)
    },
  },
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
</style>

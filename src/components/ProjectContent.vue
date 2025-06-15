<template>
  <div v-if="tab === '提案內容'" v-html="project.full_content"></div>
  <div v-else-if="tab === '問與答'">
    <QnaBlock />
  </div>
  <div v-else-if="tab === '常見問答'" v-html="project.faq"></div>
  <div v-else>進度分享</div>
</template>

<script setup>
import QnaBlock from '@/components/QnaBlock.vue'

defineProps({ tab: String, project: Object })
</script>
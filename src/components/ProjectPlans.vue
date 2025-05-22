<template>
  <div>
    <PlanCard
      v-for="plan in plans"
      :key="plan.plan_id"
      :plan="plan"
      :projectType="projectType"
      @sponsor="handleSponsor"
    />
  </div>
</template>

<script setup>
import PlanCard from '../components/PlanCard.vue'

const props = defineProps({
  plans: {
    type: Array,
    required: true,
  },
  projectType: {
    type: String,
    required: true, // 由父層傳入 "募資中" / "歷年專案" / ...
  },
})

const emit = defineEmits(['sponsor'])

function handleSponsor(planId) {
  emit('sponsor', planId)
}
</script>

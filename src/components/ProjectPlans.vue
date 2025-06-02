<template>
  <div class="d-flex flex-column gap-4 px-3"> <!-- ✅ 加左右 padding -->
    <PlanCard
      v-for="plan in plans"
      :key="plan.plan_id"
      :plan="plan"
      :projectId="numericProjectId"
      :projectType="projectType"
    />
  </div>
</template>

<script setup>
import PlanCard from '@/components/PlanCard.vue'

const props = defineProps({
  plans: {
    type: Array,
    required: true,
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
})

// ✅ 確保 projectId 是有效數字
const numericProjectId = Number(props.projectId)
if (!numericProjectId || isNaN(numericProjectId)) {
  console.error('❌ ProjectPlans 傳入的 projectId 無效:', props.projectId)
}
</script>

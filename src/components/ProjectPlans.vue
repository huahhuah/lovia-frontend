<template>
  <div class="d-flex flex-column gap-3">
    <PlanCard v-for="plan in plans" :key="plan.plan_id" :plan="plan" @sponsor="goToSponsorPage" />
  </div>
</template>

<script setup>
import PlanCard from './PlanCard.vue'
import { useRouter } from 'vue-router'

defineProps({
  plans: {
    type: Array,
    required: true,
  },
})

const router = useRouter()

function goToSponsorPage(planId) {
  router.push(`/checkout/${planId}`)
}
</script>

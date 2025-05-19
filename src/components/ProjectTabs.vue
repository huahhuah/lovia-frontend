<template>
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="tab in tabs" :key="tab">
      <button
        class="nav-link"
        :class="{ active: activeTab === tab }"
        @click="$emit('update:activeTab', tab)"
      >
        {{ tab }}
      </button>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})
defineEmits(['update:activeTab'])
</script>

<style scoped>
.nav-tabs .nav-link {
  font-weight: 500;
  color: #666;
}
.nav-tabs .nav-link.active {
  color: #d33;
  border-color: #d33 #d33 #fff;
  background-color: #fff;
  font-weight: 700;
}
</style>

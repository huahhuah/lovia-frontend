<template>
  <div class="row justify-content-center g-4">
    <div class="col-md-4" v-for="project in visibleProjects" :key="project.id">
      <ProjectCard :project="project" />
    </div>
  </div>
</template>

<script setup>
import ProjectCard from '@/components/ProjectCard.vue'
</script>

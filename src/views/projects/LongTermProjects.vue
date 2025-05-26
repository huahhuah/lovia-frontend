<template>
  <div class="row justify-content-center g-4">
    <div v-if="visibleProjects.length === 0" class="text-center py-5">
      <p class="text-muted">目前沒有符合條件的專案</p>
    </div>
    <div class="col-md-4" v-else v-for="project in visibleProjects" :key="project.id">
      <ProjectCard :project="project" />
    </div>
  </div>
</template>

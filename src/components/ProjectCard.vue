<template>
  <div class="card shadow-sm rounded-5 d-flex flex-column overflow-hidden">
    <!-- 封面 + 標籤 + 收藏 -->
    <div class="position-relative">
      <img :src="project.cover" class="card-img-top" :alt="project.title" />
      <img :src="project.category_img || '/default.png'" alt="分類標籤" class="category-badge" />
      <div class="favorite-wrapper">
        <img src="/favorite.png" alt="收藏" class="favorite-icon" />
      </div>
    </div>

    <!-- 內容 -->
    <div class="card-body text-start px-3 pb-4 d-flex flex-column flex-grow-1">
      <h5 class="card-title fw-bold text-ellipsis-2">{{ project.title }}</h5>
      <p class="card-text small mb-1 text-ellipsis-3">{{ project.summary }}</p>
      <p class="text-proposer mb-2" v-if="project.project_team">
        提案單位：{{ project.project_team }}
      </p>

      <div class="mt-auto">
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            {{ project.days_left === 0 ? '已結束' : `倒數 ${project.days_left} 天` }}
          </small>
          <small>{{ project.percentage }}%</small>
        </div>
        <div class="progress my-2 progress-custom">
          <div class="progress-bar" :style="{ width: project.percentage + '%' }"></div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <strong>NT$ {{ project.amount.toLocaleString() }}</strong>
          <router-link
            :to="`/projects/funding/${project.id}`"
            class="btn btn-sm btn-danger rounded-pill px-3"
          >
            立即贊助 >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 60px;
  z-index: 2;
}

.favorite-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background-color: rgba(26, 26, 26, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}
.favorite-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 3em;
}
.text-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 4.5em;
}

.text-proposer {
  color: #c4c4c4;
  font-size: 14px;
}

.progress-custom {
  height: 6px;
  background-color: #f3f3f3;
  border-radius: 100px;
  overflow: hidden;
}
.progress-custom .progress-bar {
  background-image: linear-gradient(to right, #fc7c9d, #ffc443);
}
</style>

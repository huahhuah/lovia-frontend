<template>
  <div class="card shadow-sm rounded-5 d-flex flex-column overflow-hidden">
    <!-- 封面 + 標籤 + 收藏 -->
    <div class="position-relative">
      <img :src="project.cover" class="card-img-top" :alt="project.title" :class="{ grayscale: isArchived }" />

      <!-- 灰階遮罩 -->
      <div v-if="isArchived" class="overlay-dark"></div>
      <!-- 狀態圖章 -->
      <img v-if="isArchived" :src="project.status_img" class="status-stamp" alt="狀態印章" />

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
            立刻贊助 >
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
  isArchived: { type: Boolean, default: false }
})
</script>

<style>
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
  width: 44px;  /* 放大 */
  height: 44px;
  background-color: rgba(26, 26, 26, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}
.favorite-icon {
  width: 20x;
  height: 20px;
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

.grayscale {
  filter: grayscale(100%);
  opacity: 0.8;
}

.overlay-dark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 26, 26, 0.8);
  z-index: 1;
}

.status-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  transform: translate(-50%, -50%);
  z-index: 2;
}
</style>

<template>
  <div class="card shadow-sm rounded-5 hover-animate d-flex flex-column overflow-hidden">
    <!-- 封面 + 標籤 + 收藏 -->
    <div class="position-relative">
      <img
        :src="project.cover"
        class="card-img-top"
        :alt="project.title"
        :class="{ grayscale: isArchived }"
      />

      <!-- 灰階遮罩 -->
      <div v-if="isArchived" class="overlay-dark"></div>
      <!-- 狀態圖章 -->
      <img v-if="isArchived" :src="project.status_img" class="status-stamp" alt="狀態印章" />

      <img :src="project.category_img || '/default.png'" alt="分類標籤" class="category-badge" />
      <!-- 收藏按鈕（歷年專案不顯示） -->
      <div
        v-if="!isArchived"
        class="favorite-wrapper"
        :class="{ 'is-favorite': isFavorite }"
        @click="toggleFavorite"
        :title="isFavorite ? '取消收藏' : '加入收藏'"
      >
        <!-- 收藏按鈕 -->
        <img
          :src="isFavorite ? '/favoriteselect.png' : '/favorite.png'"
          :key="isFavorite"
          alt="收藏"
          class="favorite-icon"
        />
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
          <strong
            :class="{
              'fs-normal': project.amount.toString().length < 6,
              'fs-smaller': project.amount.toString().length >= 6,
            }"
          >
            NT$ {{ project.amount.toLocaleString() }}
          </strong>
          <router-link
            :to="`/projects/funding/${project.id}`"
            class="btn btn-sm rounded-pill px-3"
            :class="isArchived ? 'btn-view-project' : 'btn-danger'"
          >
            {{ isArchived ? '查看專案 >' : '立刻贊助 >' }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useUserStore } from '@/stores/auth'
import axios from 'axios'

const baseUrl = 'https://lovia-backend-xl4e.onrender.com/api/v1'

const props = defineProps({
  project: { type: Object, required: true },
  isArchived: { type: Boolean, default: false },
  isFollowed: { type: Boolean, default: false },
})

const userStore = useUserStore()
userStore.restore()

const isFavorite = ref(false)
const isReady = ref(false)

// 登入資料還原完成後才允許操作
watchEffect(() => {
  isReady.value = !!userStore.token && !!userStore.user
})

// 初始是否已收藏
onMounted(async () => {
  if (isReady.value) {
    await fetchFollowStatus()
  }
})

const emit = defineEmits(['toggle-follow'])

const fetchFollowStatus = async () => {
  try {
    const url = `${baseUrl}/users/projects/${props.project.id}/follow-status`
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    isFavorite.value = res.data?.follow === true
  } catch (err) {
    console.error('取得收藏狀態失敗：', err)
    isFavorite.value = false // 預設為未收藏
  }
}

const toggleFavorite = async () => {
  if (!isReady.value) {
    alert('請先登入才能收藏')
    return
  }
  try {
    const url = `${baseUrl}/users/projects/${props.project.id}/follow`

    console.log(` 發送收藏切換請求 → PATCH: ${url}`)

    const res = await axios.patch(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    )

    isFavorite.value = res.data.follow
    console.log(' 收藏狀態已更新:', isFavorite.value)

    emit('toggle-follow', {
      projectId: props.project.id,
      follow: isFavorite.value,
    })
  } catch (err) {
    console.error(' 收藏操作失敗：', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      stack: err.stack,
    })
  }
}
</script>

<style>
.card {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.btn-danger,
.btn-view-project {
  white-space: nowrap;
  max-width: 140px;
  padding: 6px 12px;
  font-size: 14px;
  text-align: center;
  flex-shrink: 0;
}

.hover-animate {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-animate:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 0 20px rgba(252, 123, 157, 0.25);
  z-index: 3;
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
  width: 44px; /* 放大 */
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 3em;
}
.text-ellipsis-3 {
  display: -webkit-box;
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

.favorite-wrapper.is-favorite .favorite-icon {
  filter: none !important;
}
.btn-view-project {
  background-color: #000;
  color: #fff;
  border: none;
}
.btn-view-project:hover {
  background-color: #2f2e2e;
  color: #fff;
}

.fs-normal {
  font-size: 1rem; /* 原本大小 */
}
.fs-smaller {
  font-size: 0.75rem; /* 縮小後 */
}

@media (min-width: 1400px) and (max-width: 1600px) {
  .card .btn-danger,
  .card .btn-view-project {
    max-width: 140px;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    padding: 6px 12px;
    flex-shrink: 0;
  }
}
</style>

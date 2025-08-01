<template>
  <div class="user-dashboard-content">
    <!-- ✅ 已贊助專案 -->
    <div class="donate-section">
      <h5 class="section-title">已收藏專案</h5>
      <div class="project-list">
        <!-- ✅ 卡片列表（示意兩筆資料） -->
        <router-link 
          v-for="(project, index) in projectList"
          :key="index"
          :to="`/projects/funding/${project.id}`"
          class="project-card"
        >
          <div class="favorite-icon">
            <img src="/favoriteselect.png" alt="收藏愛心" />
          </div>
            <img class="project-img" :src="project.image" alt="project" />
            <div class="project-info">
              <h6 class="project-name">{{ project.name }}</h6>

              <p class="meta-top">
                <span class="tag">
                  <img src="@/assets/icons/vector.svg" class="icon" />
                  倒數 <span class="highlight">{{ project.daysLeft }}</span> 天
                </span>
                <span class="tag">
                  <img src="@/assets/icons/group.svg" class="icon" />
                  <span class="highlight">{{ project.supporters }}</span> 人已贊助
                </span>
                <span class="tag pink percent">{{ project.percent }}%</span>
              </p>
              <!-- ✅ 進度條 -->
              <div class="progress-bar">
                <div class="progress-inner" :style="{ width: project.percent + '%' }"></div>
              </div>
              <p class="amount">
                已募得 {{ project.raised }}
                <span class="target-text"> / 目標 {{ project.target }}</span>
              </p>
              <p class="date">募資期間：{{ project.period }}</p>
            </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/auth'

const projectList = ref([])
const userStore = useUserStore()

onMounted( async () => {
  try {
    const token = userStore.token
    const res = await axios.get(`https://lovia-backend-xl4e.onrender.com/api/v1/users/my_follows`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    const rawData = res.data.result

    projectList.value = rawData
      .filter(project => {
        if (!project){
          return false
        }
        return true
      })
      .map(project =>{
        const start = dayjs(project.start_time)
        const end = dayjs(project.end_time)
        const today = dayjs()

        const duration = `${start.format('YYYY/MM/DD')}-${end.format('YYYY/MM/DD')}`
        const total = project.total_amount || 1
        const raised = project.amount || 0
        const percent = Math.floor((raised/total)*100)

        return {
          id: project.id,
          name: project.title,
          image: project.cover,
          daysLeft: end.diff(today, 'day'),
          supporters: Math.floor(raised / 1000), // 推估的結果，目前沒有人數API
          percent,
          raised: `NT$${raised.toLocaleString()}`,
          target: `NT$${total.toLocaleString()}`,
          period: duration,
        }
      })
  } catch (error) {
    console.error('取得專案失敗', error)
  }
})

</script>

<style scoped>
.project-card {
  text-decoration: none; /* 移除底線 */
  color: inherit;         /* 繼承文字顏色 */
  display: block;         /* 讓整個區塊可點 */
}

.user-dashboard-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  max-width: 1296px;
  min-height: 349px;
  margin: 0 auto;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 400;
  color: #1a1a1a;
  margin-left: 18px;
}

.project-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.project-card {
  position: relative;
  min-height: 176px;
  overflow: hidden; /* 避免內容撐高卡片 */
  display: flex;
  flex-direction: row;
  align-items: center; /* ✅ 避免 align-items: stretch 被繼承影響 */
  padding: 16px;
  gap: 12px;
  background-color: #fff8f9;
  border-radius: 20px;

    /* 保持卡片大小不會被壓縮 */
  flex: none;
  order: 0;
  flex-grow: 1;
}

.project-img {
  width: 216px;
  height: 144px;
  object-fit: cover;
  border-radius: 12px;
}

.project-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 將內容均分上下 */
  height: 100%;
  gap: 6px;
  flex: 1;
}

.project-name {
  font-size: 18px;
  color: #1a1a1a;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;/* 限制最多顯示兩行 */
  -webkit-box-orient: vertical;
  max-width: calc(100% - 48px);
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #5f6368;
  margin-top: -30px;
}

.meta .tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta .tag.pink {
  color: #fc5b53;
}

.icon {
  width: 14px;
  height: 14px;
}

.amount {
  font-size: 14px;
  color: #5f6368;
}

.date {
  font-size: 12px;
  color: #a0a0a0;
  margin-top: -20px;
}

.no-proposal-text {
  font-size: 14px;
  color: #5f6368;
  margin-left: 18px;
}

.link {
  color: #2478DF;
  text-decoration: underline;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #D5DAE0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-image: linear-gradient(to right, #fc7c9d, #ffc443);
  border-radius: 4px;
}

.highlight {
  color: #fc5b53;
  font-weight: 10px;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #5f6368;
  justify-content: space-between; /* 讓百分比跑到右邊 */
  align-items: center;
}

.meta .percent {
  margin-left: auto;
  color: #fc5b53;
  font-weight: 10px;
}

.meta-top {
  display: flex;
  justify-content: space-between; /* 讓百分比往右推 */
  align-items: center;
  font-size: 14px;
  color: #5f6368;
  margin-top: 4px;
  margin-bottom: -2px;
}

.tag.percent {
  color: #fc5b53;
  margin-left: auto;
}

.meta-top .tag:nth-child(2) {
  margin-left: 12px; /* 或 16px 看你要多寬 */
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  filter: none !important;
}

.favorite-icon img {
  width: 18px;
  height: 18px;
}

@media (min-width: 992px) {
  .project-card {
    width: 640px;
    min-width: 640px;
    max-width: 640px;
  }
}

@media (max-width: 768px) {
  .user-dashboard-content {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .donate-section {
    width: 100%;
  }

  .section-title {
    font-size: 16px;
    font-weight: 400;
    margin-left: 8px;
    color: #1a1a1a;
  }

  .project-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .project-card {
    width: 100%;
    height:100%;
    padding: 16px;
    border-radius: 20px;
    background: #fff8f9;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .project-img {
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 12px;
  }

  .project-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .project-name {
    font-size: 18px;
    font-weight: 500;
    color: #1A1A1A;
    line-height: 1.4;
  }

  .meta-top {
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;
    gap: 8px;
    color: #5f6368;
    width: 100%;
  }

  .meta-top .tag {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .tag.percent {
    margin-left: auto;
    color: #fc5b53;
    font-weight: 500;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background-color: #D5DAE0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-inner {
    height: 100%;
    background-image: linear-gradient(to right, #fc7c9d, #ffc443);
    border-radius: 4px;
  }

  .amount {
    font-size: 13px;
    color: #1a1a1a;
  }

  .date {
    font-size: 13px;
    color: #a0a0a0;
  }

  .favorite-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .favorite-icon img {
    width: 18px;
    height: 18px;
  }
}
</style>
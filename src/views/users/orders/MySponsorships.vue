<template>
  <div class="user-dashboard-content">
    <!-- ✅ 已贊助專案 -->
    <div class="donate-section">
      <h5 class="section-title">已贊助專案</h5>
      <div class="project-list">
        <!-- ✅ 卡片列表（示意兩筆資料） -->
        <div class="project-card" v-for="(project, index) in projectList" :key="index">
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
        </div>
      </div>
    </div>

    <!-- ✅ 已發起專案 -->
    <div class="section">
      <h5 class="section-title">已發起專案</h5>
      <p class="no-proposal-text">
        您還沒有發起過專案，現在就來試試吧！點擊
        <router-link to="/propose" class="link">我要提案</router-link>
        ，讓您的想法幫助更多人。
      </p>
    </div>
  </div>
</template>

<script setup>
const projectList = [
  {
    name: '失能長者不憂鬱，幸福沐浴車到宅計畫',
    image: '/favorite-1.png',
    daysLeft: 10,
    supporters: 99,
    percent: 7,
    raised: 'NT$399,000',
    target: 'NT$5,000,000',
    period: '2025/1/1–2025/4/30',
  },
  {
    name: '讓孩子安心上學的早餐支持計畫',
    image: '/favorite-2.jpg',
    daysLeft: 5,
    supporters: 45,
    percent: 40,
    raised: 'NT$120,000',
    target: 'NT$300,000',
    period: '2025/3/1–2025/6/30',
  },
]
</script>

<style scoped>
.user-dashboard-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 1296px;
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
}

.project-card {
  width: 640px;
  height: 176px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  gap: 8px;
  flex: 1;
}

.project-name {
  font-size: 18px;
  color: #1a1a1a;
  margin-top: 20px;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #5f6368;
  margin-top: -40px;
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
  color: #1a1a1a;
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

@media (max-width: 768px) {
  .user-dashboard-content {
    width: 100%;
    padding: 0;
    gap: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .donate-section {
    width: 100%;
    max-width: 375px;
    margin: -35px auto 0 auto;
  }

  .section-title {
    width: 311px;
    height: 27px;
    font-family: 'Noto Sans', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #1A1A1A;
    margin-bottom: 8px;
    margin-top: 0;
    margin-left: 18px;
  }

  .project-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .project-card {
    width: 343px;
    height: 395.33px;
    padding: 16px;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #FFF8F9;
    border-radius: 20px;
    margin: 0 auto;
  }

  .project-img {
    width: 311px;
    height: 207.33px;
    object-fit: cover;
    border-radius: 12px;
  }

  .project-info {
    width: 311px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 12px;
  }

  .project-name {
    width: 311px;
    height: 27px;
    font-size: 18px;
    line-height: 27px;
    font-weight: 400;
    color: #1A1A1A;
    margin: 0;
  }

  .meta-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 311px;
    font-size: 13px;
    color: #5f6368;
    gap: 12px;
  }

  .meta-top .tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    white-space: nowrap;
  }

  .meta-top .percent {
    margin-left: auto;
    color: #fc5b53;
    font-weight: 500;
  }

  .meta-top {
    margin-bottom: 4px; /* 避免把進度條推掉 */
  }

  .progress-bar {
    width: 311px;
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
    width: 311px;
  }

  .date {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #a0a0a0;
    width: 311px;
    height: 18px;
  }

  .target-text {
  color: #A0A0A0;
}
  .no-proposal-text {
    margin-left: 18px;
    width: 311px;
  }
}

</style>

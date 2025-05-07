<template>
  <section class="funding-section text-center position-relative custom-section2-spacing">
    <!-- 背景裝飾圖 -->
    <img src="/homepageS2-bg.png" alt="bg1" class="section2-bg1" />
    <img src="/homepageS2-bg2.png" alt="bg2" class="section2-bg2" />
    <img src="/homepageS2-illustration.png" alt="illustration" class="section2-illustration" />

    <h2 class="section-title text-danger fs-4 fw-bold mb-5">募資中</h2>
    <div class="container" style="padding-left: 10rem; padding-right: 10rem;">
      <div class="row justify-content-center g-4">
        <div class="col-md-4" v-for="(card, index) in cards" :key="index">
          <div class="card shadow-sm rounded-5 h-100 d-flex flex-column overflow-hidden">
            <!-- 卡片圖片與 icon -->
            <div class="position-relative">
              <img :src="card.image" class="card-img-top rounded-top-4" :alt="card.title" />
              <img :src="card.categoryImg" alt="分類標籤" class="category-badge" />
              <div class="favorite-wrapper">
                <img src="/favorite.png" alt="收藏" class="favorite-icon" />
              </div>
            </div>

            <!-- 卡片內文 -->
            <div class="card-body text-start px-3 pb-4 d-flex flex-column flex-grow-1">
              <!-- 標題區 -->
              <h5 class="card-title fw-bold text-ellipsis-2">{{ card.title }}</h5>

              <!-- 說明區 -->
              <p class="card-text small mb-1 text-ellipsis-3">{{ card.description }}</p>

              <!-- 提案單位 -->
              <p class="text-proposer mb-2">提案單位：{{ card.proposer }}</p>

              <!-- 進度與按鈕（固定底部） -->
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">倒數 {{ card.daysLeft }} 天</small>
                  <small>{{ card.progress }}%</small>
                </div>
                <div class="progress my-2 progress-custom">
                  <div class="progress-bar" :style="{ width: card.progress + '%' }"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <strong>NT$ {{ card.amount.toLocaleString() }}</strong>
                  <button class="btn btn-sm btn-danger rounded-pill px-3">立即贊助 ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-danger rounded-pill mt-4">查看更多</button>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    title: '弱勢偏鄉與罕病者【復康巴士服務補助】',
    description: '對許多身障者與罕病者而言，復康巴士的交通費用是一筆沈重負擔。為了不讓距離成為就醫與生活的障礙，協會致力...',
    proposer: '多扶無障礙生活與交通發展協會',
    image: '/homepageS2-card01.png',
    categoryImg: '/category-人文.png',
    progress: 33,
    amount: 26580,
    daysLeft: 25,
  },
  {
    title: '偏鄉醫療支援計畫',
    description: '偏鄉地區的醫療資源匱乏，許多居民因為交通不便、醫療設施不足，無法及時獲得必要的醫療服務。',
    proposer: '多偏鄉醫療支援協會',
    image: '/homepageS2-card02.png',
    categoryImg: '/category-人文.png',
    progress: 24,
    amount: 9456,
    daysLeft: 34,
  },
  {
    title: '海洋廢棄物清理計畫',
    description: '如果我們不採取行動，未來的海洋將不再是生命的搖籃，而是廢棄物的墳場。',
    proposer: '海洋守護者聯盟',
    image: '/homepageS2-card03.png',
    categoryImg: '/category-環境.png',
    progress: 24,
    amount: 26000,
    daysLeft: 15,
  },
];
</script>

<style scoped>
.funding-section {
  background: linear-gradient(to right, #FFEDF2, #FFF6E3);
  position: relative;
  padding-top: 8rem;
  padding-bottom: 8rem;
  overflow: hidden;
}

.card {
  height: 100%;
  max-width: 300px;
  margin: 0 auto;
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

.text-proposer {
  color: #C4C4C4;
  font-size: 14px;
}

.progress-custom {
  height: 6px;
  background-color: #f3f3f3;
  border-radius: 100px;
  overflow: hidden;
}
.progress-custom .progress-bar {
  background-image: linear-gradient(to right, #FC7C9D, #FFC443);
}

/* 標題區兩行 */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 3em;
}

/* 說明區三行 */
.text-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  min-height: 4.5em;
}

/* 背景裝飾圖 */
.section2-bg1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  z-index: 0;
}
.section2-bg2 {
  position: absolute;
  top: 400px;
  left: 0;
  width: 300px;
  z-index: 0;
}
.section2-illustration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 800px;
  z-index: 0;
}

.custom-section2-spacing {
  padding-top: 5rem;
  padding-bottom: 25rem;
}
@media (max-width: 991.98px) {
  .funding-section {
    padding: 3rem 1rem 10rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .card {
    max-width: 100%;
  }
  .section2-bg1,
  .section2-bg2 {
    display: none;
  }
  .section2-illustration {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    max-width: 300px;
    z-index: 0;
  }
}
</style>

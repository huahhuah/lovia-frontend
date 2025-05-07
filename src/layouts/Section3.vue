<template>
  <section class="funding-section text-center position-relative custom-section3-spacing">
    <!-- 背景裝飾圖 -->
    <img src="/homepageS3-bg.png" alt="bg1" class="section3-bg1" />
    <img src="/homepageS3-bg2.png" alt="bg2" class="section3-bg2" />
    <img src="/homepageS3-illustration.png" alt="illustration" class="section3-illustration" />

    <h2 class="section-title text-danger fs-4 fw-bold mb-5">長期贊助</h2>
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
    title: '讓偏鄉沒有遺憾',
    description: '在這個世界上，仍許多偏鄉孩子因為資源不足錯過了學習、夢想和成長的機會。',
    proposer: '無憾未來兒童教育基金',
    image: '/homepageS3-card01.png',
    categoryImg: '/category-人文.png',
    progress: 60,
    amount: 100000,
    daysLeft: 9999,
  },
  {
    title: '讓每一頓飯都充滿溫暖',
    description: '對我們來說，一日三餐是理所當然的日常，但對許多弱勢家庭來說，每一餐都是沈重的負擔。',
    proposer: '溫暖一餐關懷協會',
    image: '/homepageS3-card02.png',
    categoryImg: '/category-人文.png',
    progress: 60,
    amount: 128900,
    daysLeft: 9999,
  },
  {
    title: '動物救傷站計畫',
    description: '在城市的街頭、鄉間的小路，每天都有受傷、生病、無助的動物等待救援。',
    proposer: '希望毛孩救援站',
    image: '/homepageS3-card03.png',
    categoryImg: '/category-動物.png',
    progress: 60,
    amount: 40000,
    daysLeft: 9999,
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
.section3-bg1 {
  position: absolute;
  top: 300px;
  left: 0;
  width: 50px;
  z-index: 0;
}
.section3-bg2 {
  position: absolute;
  top: 400px;
  right: 0;
  width: 300px;
  z-index: 0;
}
.section3-illustration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 800px;
  z-index: 0;
}

.custom-section3-spacing {
  padding-top: 5rem;
  padding-bottom: 25rem;
}
@media (max-width: 991.98px) {
  .search-form .input-group {
    width: 100%;
  }
  .custom-register.small {
    font-size: 14px;
    padding: 4px 10px;
  }
  .nav-link.small {
    font-size: 14px;
  }
  .navbar-collapse .nav-link {
    font-size: 16px;
    margin-bottom: 0.75rem;
  }
  .form-control {
    font-size: 14px;
    padding: 6px 10px;
  }

  .funding-section {
    padding: 3rem 1rem 10rem;
  }
  .section-title {
    font-size: 2rem;
  }
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  .card {
    max-width: 100%;
  }
  .section2-bg1,
  .section2-bg2,
  .section3-bg1,
  .section3-bg2 {
    display: none;
  }
  .section2-illustration,
  .section3-illustration {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    max-width: 320px;
    z-index: 0;
  }
}
</style>

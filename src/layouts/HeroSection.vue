<template>
  <div class="homepage-bg">
    <!-- Carousel -->
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active position-relative">
          <img src="/homepageS1-Frame 509.png" class="d-block w-100 hero-img" alt="Hero Image">
          <div class="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start">
            <!-- headline 疊在底圖上，不需要額外白底容器 -->
            <div class="hero-stack position-relative">
              <img src="/homepageS1-Frame 489.png" alt="背景底圖" class="img-fluid hero-subheadline position-absolute">
              <img src="/homepageS1-headline.png" alt="匯聚希望，改變世界" class="img-fluid hero-headline position-relative">
            </div>
            <button class="btn custom-cta rounded-pill px-4 py-2 mt-3">立刻行動 >></button>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <!-- Decorative illustration (可選) -->
    <div class="hero-illustration">
      <img src="/homepageS1-hero_ilustrantion.png" alt="Illustration">
    </div>
  </div>
</template>

<script setup>
// 這邊暫時不需要特別的 JS，可以依需要增加
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

/* 全站字體套用 Noto Sans */
.homepage-bg {
  background-image: linear-gradient(to right, #FFEDF2, #FFF6E3);
  min-height: 100vh;
  font-family: 'Noto Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.hero-img {
  height: 100vh;
  object-fit: cover;
}

.hero-overlay {
  padding-left: 8vw;
  padding-right: 8vw;
  padding-top: 5vh;
  padding-bottom: 5vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.hero-stack {
  position: relative;
  width: fit-content;
  margin-bottom: 1rem;
  margin-left: 3vw;
}

.hero-subheadline {
  max-width: 25vw;
  top: 0;
  left: 0;
  z-index: 1;
}

.hero-headline {
  max-width: 25vw;
  top: 0;
  left: 0;
  z-index: 2;
}

.custom-cta { /*立刻行動的按鈕*/
  background-color: #FC5B53; 
  color: #FAFAFA;
  border: none;
  margin-left: 3vw; 
}

.hero-illustration {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0rem;
  z-index: 1;
}

.hero-illustration img {
  max-width: 400px;
}
</style>
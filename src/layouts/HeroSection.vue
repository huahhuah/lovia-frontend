<template>
  <div class="homepage-bg">
    <!-- Carousel -->
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-inner">
        <div class="carousel-item active position-relative">
          <img src="/homepageS1-banner 01.png" class="d-block w-100 hero-img" alt="Hero 1" />
        </div>
        <div class="carousel-item position-relative">
          <img src="/homepageS1-banner 02.png" class="d-block w-100 hero-img" alt="Hero 2" />
        </div>
        <div class="carousel-item position-relative">
          <img src="/homepageS1-banner 03.png" class="d-block w-100 hero-img" alt="Hero 3" />
        </div>
      </div>

      <!-- 控制箭頭 -->
      <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>

      <!-- Overlay -->
      <div class="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start">
        <div class="hero-stack position-relative">
          <img src="/homepageS1-Frame 489.png" alt="背景底圖" class="img-fluid hero-subheadline position-absolute" />
          <img src="/homepageS1-headline.png" alt="匯聚希望，改變世界" class="img-fluid hero-headline position-relative" />
        </div>
        <button class="btn custom-cta rounded-pill px-4 py-2 mt-3">立刻行動 >></button>
      </div>
    </div>

    <!-- Illustration -->
    <div class="hero-illustration">
      <img src="/homepageS1-hero_ilustrantion.png" alt="Illustration" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Bootstrap 的 carousel 是透過全域物件 bootstrap 提供
onMounted(() => {
  const el = document.getElementById('heroCarousel')
  if (el && window.bootstrap?.Carousel) {
    const existing = window.bootstrap.Carousel.getInstance(el)
    if (!existing) {
      new window.bootstrap.Carousel(el)
    }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

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

.custom-cta {
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

.carousel-control-prev,
.carousel-control-next {
  z-index: 3; /* 蓋過 overlay */
}

@media (max-width: 768px) {
  .hero-img {
    height: 100vh;
    object-fit: cover;
  }

  .hero-overlay {
  padding-left: 8vw;
  padding-right: 8vw;
  padding-top: 45vh;
  padding-bottom: 5vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  /* 加這行可以調整靠左 / 置中 / 靠右 */
  align-items: center; /* 改為 center = 置中 */
  }

  .hero-stack {
    margin-left: 0;
    margin-bottom: 1rem;
  }

  .hero-subheadline,
  .hero-headline {
    max-width: 80vw;
    height: auto;
  }

  .custom-cta {
   background-color: #FC5B53;
   color: #FAFAFA;
   border: none;
   margin-left: 0;
   display: block;
   text-align: center;
   margin: 0 auto;
  }

  .hero-illustration {
    display: none;
  }
}

</style>

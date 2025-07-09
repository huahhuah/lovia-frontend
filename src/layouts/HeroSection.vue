<template>
  <div class="homepage-bg">
    <!-- Carousel -->
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
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
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>

      <!-- Overlay -->
      <div
        class="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-start"
      >
        <div class="hero-stack position-relative">
          <img
            src="/homepageS1-Frame 489.png"
            alt="背景底圖"
            class="img-fluid hero-subheadline position-absolute hero-glow"
          />
          <img
            src="/homepageS1-headline.png"
            alt="匯聚希望，改變世界"
            class="img-fluid hero-headline position-relative"
          />
        </div>
        <button
          class="btn custom-cta rounded-pill px-4 py-2 mt-3"
          onclick="window.location.href='/projects/explore-projects'"
        >
          立刻行動 >>
        </button>
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

.homepage-bg {
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  min-height: 100vh;
  font-family: 'Noto Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.hero-img {
  height: 100vh;
  object-fit: cover;
  pointer-events: none; /* 圖片不擋點擊 */
}

/*  讓整個 overlay 不擋點擊，只有裡面的按鈕等可以點 */
.hero-overlay {
  pointer-events: none;
  padding-left: 8vw;
  padding-right: 8vw;
  padding-top: 5vh;
  padding-bottom: 5vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
.hero-overlay * {
  pointer-events: auto;
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

/* CTA 按鈕樣式 */
.custom-cta {
  z-index: 10;
  position: relative;
  background-color: #fc5b53;
  color: #fafafa;
  border: none;
  margin-left: 3vw;
  overflow: hidden;
}
.custom-cta:hover {
  background-color: #fd7269;
  color: #fafafa;
}

.custom-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: skewX(-20deg);
  animation: shine 2.5s infinite;
}
@keyframes shine {
  100% {
    left: 125%;
  }
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
  opacity: 0;
  transform: translateY(20px) scale(1);
  animation:
    fadeInUp 1s ease-out 0.3s forwards,
    pulse 3s ease-in-out infinite;
}

/* 淡入 + 上移動畫 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
/* 呼吸動畫 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
}

/* 文字進場與左右搖擺 */
.hero-headline {
  opacity: 0;
  transform: translateY(30px);
  animation:
    fadeUp 1s ease-out forwards,
    sway 2.5s ease-in-out infinite;
  animation-delay: 0.3s, 1.3s;
  transform-origin: bottom center;
}
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes sway {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(0) rotate(-2deg);
  }
  75% {
    transform: translateY(0) rotate(2deg);
  }
}

/* subheadline 呼吸發光 */
@keyframes glow {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
.hero-glow {
  animation: glow 3s ease-in-out infinite;
}

/* carousel 指示器樣式 */
.carousel-indicators [data-bs-target] {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  opacity: 0.4;
}
.carousel-indicators .active {
  background-color: #fc5b53;
  opacity: 1;
}

/* arrows */
.carousel-control-prev {
  left: 80px;
  width: 40px;
}
.carousel-control-next {
  right: 80px;
  width: 40px;
}
.carousel-control-prev,
.carousel-control-next {
  z-index: 3;
}

/*  RWD */
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
    align-items: center;
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
    background-color: #fc5b53;
    color: #fafafa;
    border: none;
    margin-left: 0;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
  .hero-illustration {
    display: none;
  }

  .carousel-control-prev,
  .carousel-control-next {
    width: 60px; /* 增加可點擊範圍 */
  }

  .carousel-control-prev {
    left: 5px; /* 更靠左邊 */
  }

  .carousel-control-next {
    right: 5px; /* 更靠右邊 */
  }
}
</style>

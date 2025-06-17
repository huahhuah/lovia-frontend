<template>
  <section class="section6 position-relative">
    <!-- 背景圖 -->
    <img src="/homepageS6-bg.png" class="section6-bg" alt="背景圖" />

    <div class="container position-relative">
      <div class="row">
        <div class="col-12 col-md-6">
          <div class="section6-content animated-section">
            <h3 class="section6-title shine-title">核心理念</h3>
            <p class="section6-text">
              在這個世界上，有太多需要被關心的角落——無助的流浪犬貓、被廢棄物污染的海洋、因貧困而得不到醫療的家庭。
              我們相信，真正的改變來自於每一份小小的善意，而這些善意，值得一個更有效率、更透明、更能創造影響的平台來實現！
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section6 {
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  padding: 15rem 0 28rem;
  position: relative;
  overflow: hidden;
}

.section6-bg {
  position: absolute;
  top: 0;
  right: 80px;
  width: 85%;
  max-width: none;
  height: auto;
  z-index: 0;
}

/* 內容區塊 */
.section6-content {
  max-width: 500px;
  margin-left: 30%;
  margin-top: -15rem;
  position: relative;
  z-index: 2;
}

.section6-title {
  color: #f15c5c;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.section6-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}

.section6-bg {
  opacity: 0;
  transform: translateY(20px);
  animation:
    fadeInUp 1.2s ease-out forwards,
    floatUpDown 6s ease-in-out infinite;
  animation-delay: 0.3s;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatUpDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 區塊淡入 + 上浮動畫 */
.animated-section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1.2s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 標題掃光效果 */
.shine-title {
  position: relative;
  display: inline-block;
  overflow: hidden;
  z-index: 1;
}

.shine-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shine 2.5s infinite;
  z-index: 2;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@media (max-width: 768px) {
  .section6 {
    padding: 1rem 1rem 10rem;
  }

  .section6-bg {
    top: 250px;
    left: 0;
    width: 100%;
  }

  .section6-content {
    margin: 0 auto;
    padding: 2rem 1rem;
    margin-top: 0;
  }

  .section6-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .section6-text {
    font-size: 0.95rem;
    text-align: auto;
  }
}
</style>

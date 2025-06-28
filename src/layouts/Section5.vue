<template>
  <section class="section5 text-center position-relative">
    <!-- 光暈背景裝飾 -->
    <img src="/homepageS5-light(R).png" class="light-deco light-right" />
    <img src="/homepageS5-light(L).png" class="light-deco light-left" />

    <div class="container position-relative">
      <h2 class="section-title text-danger fs-4 fw-bold mb-5">立即行動</h2>
      <div class="row justify-content-center gap-4 flex-wrap">
        <!-- 我要提案 -->
        <div class="col-12 col-md-auto d-flex justify-content-center">
          <div class="card-wrapper">
            <div class="bg-layer base"></div>
            <img src="/homepageS5-提案bg.png" class="bg-deco proposal-bg1" />
            <img src="/homepageS5-提案bg2.png" class="bg-deco proposal-bg2" />

            <div class="content text-start">
              <h4 class="fw-bold">我要提案</h4>
              <p>讓你的願景發聲，讓好點子成真！</p>
              <button class="btn btn-dark rounded-pill px-4 py-2" @click="goToProposal">
                GO &gt;
              </button>
            </div>
          </div>
        </div>

        <!-- 我要贊助 -->
        <div class="col-12 col-md-auto d-flex justify-content-center">
          <div class="card-wrapper">
            <div class="bg-layer base"></div>
            <img src="/homepageS5-贊助bg.png" class="bg-deco support-bg1" />
            <img src="/homepageS5-贊助bg2.png" class="bg-deco support-bg2" />

            <div class="content text-start">
              <h4 class="fw-bold">我要贊助</h4>
              <p>每一份支持，都是實現夢想的起點！</p>
              <button
                class="btn btn-dark rounded-pill px-4 py-2"
                @click="router.push('/projects/explore-projects')"
              >
                GO &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth'

const router = useRouter()
const userStore = useUserStore()

const goToProposal = () => {
  if (!userStore.user) {
    // 未登入導向登入頁
    router.push('/login')
    return
  }

  const role = userStore.user?.role?.role_type
  if (role === '提案者') {
    router.push('/projects/create')
  } else {
    router.push('/users/postApplication')
  }
}
</script>
<style scoped>
.section5 {
  background: linear-gradient(to right, #ffedf2, #fff6e3);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 3rem;
}

.card-wrapper {
  width: 360px;
  height: 280px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
.bg-layer.base {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 248, 249, 0.4);
  z-index: 0;
}
.bg-deco {
  position: absolute;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
}
.proposal-bg1 {
  top: 30%;
  left: 5%;
  width: 95%;
}
.proposal-bg2 {
  top: 30%;
  left: 35%;
  width: 60%;
}
.support-bg1 {
  top: 35%;
  left: 0%;
  width: 100%;
  z-index: 0;
  pointer-events: none;
  position: absolute;
}
.support-bg2 {
  top: 42%;
  left: 45%;
  width: 55%;
}
.support-bg1,
.support-bg2 {
  pointer-events: none;
  z-index: 0;
}

.content {
  position: relative;
  top: 24px;
  left: 24px;
  z-index: 3;
}
.content h4 {
  font-size: 1.6rem;
}
.content p {
  font-size: 0.9rem;
  margin: 8px 0 16px;
  color: #5f6368;
}

.light-deco {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
.light-left {
  left: 20px;
  top: -60px;
  width: 700px;
}
.light-right {
  right: 60px;
  bottom: -50px;
  width: 600px;
}
.card-wrapper {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  background-color: white;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.card-wrapper:hover {
  transform: translateY(-8px) scale(1.03); /* 向上浮 + 微放大 */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); /* 增加陰影 */
  animation: bounce 0.4s;
}

/* 彈跳動畫 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(-2px);
  }
}
.card-wrapper:hover .bg-deco {
  transform: scale(1.05) rotate(-2deg);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .card-wrapper {
    width: 90%;
    height: 250px;
  }
  .content {
    position: static;
    padding: 1rem;
    text-align: center;
  }
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  .light-deco {
    display: none !important;
  }
  .bg-layer.base {
    display: none;
  }
  /* 手機版背景圖調整：避免壓到按鈕 */
  .support-bg1 {
    top: 46% !important;
    width: 100% !important;
    left: 0% !important;
  }

  .support-bg2 {
    top: 45% !important;
    width: 50% !important;
    left: 50% !important;
  }
}
</style>

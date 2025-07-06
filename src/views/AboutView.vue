<template>
  <div class="about-page">
    <!-- 核心理念 -->
    <section class="py-5 text-center bg-card mt-5">
      <div class="container">
        <h2 class="mb-4 fw-bold">我們的核心理念</h2>
        <p class="mx-auto text-muted lead lh-lg" style="max-width: 720px">
          在這個世界上，有太多需要被關心的角落——
          無助的流浪犬貓、被廢棄物污染的海洋、因貧困而得不到醫療的家庭。
          我們相信，真正的改變來自於每一份小小的善意，
          而這些善意，值得一個更有效率、更透明、更能創造影響的平台來實現。
        </p>
      </div>
    </section>

    <!-- 我們希望改變的世界 -->
    <section class="py-5 text-center">
      <div class="container">
        <h2 class="text-center mb-5 fw-bold">我們希望改變的世界</h2>
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="card h-100 shadow-sm overflow-hidden rounded-4 bg-card">
              <img src="/Property 02.png" alt="守護動物" class="card-img-top" />
              <div class="card-body text-center">
                <h5 class="card-title fw-bold mb-2">守護動物</h5>
                <p class="card-text text-muted small mb-0 lh-lg">
                  幫助每一隻需要醫療與食物的浪浪，重拾幸福與健康。
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card h-100 shadow-sm overflow-hidden rounded-4 bg-card">
              <img src="/Property 05.png" alt="潔淨海洋" class="card-img-top" />
              <div class="card-body text-center">
                <h5 class="card-title fw-bold mb-2">潔淨海洋</h5>
                <p class="card-text text-muted small mb-0 lh-lg">
                  減少海洋廢棄物，還給海洋生物安全的家。
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card h-100 shadow-sm overflow-hidden rounded-4 bg-card">
              <img src="/Property 01.png" alt="照亮偏鄉" class="card-img-top" />
              <div class="card-body text-center">
                <h5 class="card-title fw-bold mb-2">照亮偏鄉</h5>
                <p class="card-text text-muted small mb-0 lh-lg">
                  協助偏鄉家庭獲得必要的醫療與生活資源。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 我們的故事 -->
    <section class="py-5 text-center bg-card">
      <div class="container">
        <h2 class="mb-4 fw-bold">我們的故事</h2>
        <p class="mx-auto text-muted lead lh-lg fw-normal" style="max-width: 720px">
          我們的平台是為非營利組織與公益行動者打造的橋樑， 讓更多有愛心的人能夠互相支持與幫助。
          每個人都可能面臨困境，而社會的溫暖來自彼此的關懷與行動。
          <br /><br />
          在這裡，我們希望凝聚更多願意分享與付出的「給予者」， 讓需要幫助的人感受到愛與希望。
          邀請您一同關注社會的每個角落，攜手推動公益，讓世界更美好！
        </p>
      </div>
    </section>

    <!-- 團隊成員 -->
    <section class="py-5 text-center">
      <div class="container">
        <h2 class="mb-5 fw-bold">我們的團隊</h2>
        <div class="row g-4">
          <div class="col-md-3">
            <div class="card h-100 p-4 team-pja">
              <h5 class="fw-bold">PJA</h5>
              <p class="small mb-2">全端開發</p>
              <a
                href="https://github.com/PJA0103"
                target="_blank"
                class="btn btn-outline-dark btn-sm"
              >
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 p-4 team-yuling">
              <h5 class="fw-bold">Yu Ling</h5>
              <p class="small mb-2">全端開發</p>
              <a
                href="https://github.com/huahhuah"
                target="_blank"
                class="btn btn-outline-dark btn-sm"
              >
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 p-4 team-seven">
              <h5 class="fw-bold">Seven</h5>
              <p class="small mb-2">全端開發</p>
              <a
                href="https://github.com/Sevvennn"
                target="_blank"
                class="btn btn-outline-dark btn-sm"
              >
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 p-4 team-ruby">
              <h5 class="fw-bold">Ruby</h5>
              <p class="small mb-2">前端開發</p>
              <a
                href="https://github.com/Jingru125"
                target="_blank"
                class="btn btn-outline-dark btn-sm"
              >
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 text-center">
      <div class="container">
        <h2 class="mb-4 fw-bold">一起推動更多善意的發生！</h2>
        <p class="text-muted mb-4">加入 Lovia，支持你關心的計畫，或分享給更多朋友。</p>
        <router-link
          to="/projects/explore-projects"
          class="btn btn-danger btn-lg rounded-pill shadow"
        >
          馬上探索公益專案
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
}

/* 新增統一卡片背景顏色 */
.bg-card {
  background-color: #fff9f5;
}

/* 柔和專屬顏色 */
.team-pja {
  background-color: #fff7dc; /* 柔嫩奶黃 */
}
.team-yuling {
  background-color: #e7f0fd; /* 淡天空藍 */
}
.team-seven {
  background-color: #fde7ec; /* 溫潤蜜桃粉 */
}
.team-ruby {
  background-color: #efe7fd; /* 微霧薰紫 */
}
.card {
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* 卡片內統一文字顏色 */
.card h5,
.card p {
  color: #333;
}
</style>

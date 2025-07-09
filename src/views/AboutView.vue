<template>
  <div class="about-page font-noto">
    <!-- 核心理念 -->
    <section class="py-5 text-center bg-card mt-5">
      <div class="container fade-in">
        <h2 class="section-title">我們的核心理念</h2>
        <p class="section-text">
          在這個世界上，有太多需要被關心的角落——
          無助的流浪犬貓、被廢棄物污染的海洋、因貧困而得不到醫療的家庭。
          我們相信，真正的改變來自於每一份小小的善意，
          而這些善意，值得一個更有效率、更透明、更能創造影響的平台來實現。
        </p>
      </div>
    </section>

    <!-- 我們希望改變的世界 -->
    <section class="py-5 text-center">
      <div class="container fade-in">
        <h2 class="section-title">我們希望改變的世界</h2>
        <div class="row g-4">
          <div v-for="(item, index) in missions" :key="index" class="col-12 col-md-4">
            <div class="card h-100 shadow-sm rounded-4 bg-card overflow-hidden">
              <img :src="item.img" :alt="item.title" class="card-img-top" />
              <div class="card-body text-center">
                <h5 class="card-title fw-bold mb-2">{{ item.title }}</h5>
                <p class="card-text text-muted small lh-lg">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 我們的故事 -->
    <section class="py-5 text-center bg-card">
      <div class="container fade-in">
        <h2 class="section-title">我們的故事</h2>
        <p class="section-text">
          我們的平台是為非營利組織與公益行動者打造的橋樑，讓更多有愛心的人能夠互相支持與幫助。
          每個人都可能面臨困境，而社會的溫暖來自彼此的關懷與行動。
          <br /><br />
          在這裡，我們希望凝聚更多願意分享與付出的「給予者」，讓需要幫助的人感受到愛與希望。
          邀請您一同關注社會的每個角落，攜手推動公益，讓世界更美好！
        </p>
      </div>
    </section>

    <!-- 團隊成員 -->
    <section class="py-5 text-center">
      <div class="container fade-in">
        <h2 class="section-title">我們的團隊</h2>
        <div class="row g-4">
          <div v-for="(member, index) in team" :key="index" class="col-12 col-md-3">
            <div :class="`card h-100 p-4 ${member.class}`">
              <h5 class="fw-bold">{{ member.name }}</h5>
              <p class="small mb-2">{{ member.role }}</p>
              <a :href="member.github" target="_blank" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 text-center">
      <div class="container fade-in">
        <h2 class="section-title">一起推動更多善意的發生！</h2>
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

<script setup>
const missions = [
  {
    img: '/Property 02.png',
    title: '守護動物',
    text: '幫助每一隻需要醫療與食物的浪浪，重拾幸福與健康。',
  },
  {
    img: '/Property 05.png',
    title: '潔淨海洋',
    text: '減少海洋廢棄物，還給海洋生物安全的家。',
  },
  {
    img: '/Property 01.png',
    title: '照亮偏鄉',
    text: '協助偏鄉家庭獲得必要的醫療與生活資源。',
  },
]

const team = [
  {
    name: 'PJA',
    role: '全端開發',
    github: 'https://github.com/PJA0103',
    class: 'team-pja',
  },
  {
    name: 'Yu Ling',
    role: '全端開發',
    github: 'https://github.com/huahhuah',
    class: 'team-yuling',
  },
  {
    name: 'Seven',
    role: '全端開發',
    github: 'https://github.com/Sevvennn',
    class: 'team-seven',
  },
  {
    name: 'Ruby',
    role: '前端開發',
    github: 'https://github.com/Jingru125',
    class: 'team-ruby',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

.font-noto {
  font-family: 'Noto Sans', sans-serif;
}

.about-page {
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
}

.section-title {
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.section-text {
  max-width: 720px;
  margin: 0 auto;
  line-height: 2;
  font-size: 1.125rem;
  color: #6c757d;
}

.bg-card {
  background-color: #fff9f5;
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

.card h5,
.card p {
  color: #333;
}

.team-pja {
  background-color: #fff7dc;
}

.team-yuling {
  background-color: #e7f0fd;
}

.team-seven {
  background-color: #fde7ec;
}

.team-ruby {
  background-color: #efe7fd;
}

.section-text {
  letter-spacing: 0.03em;
  text-align: justify;
}
.card-text {
  letter-spacing: 0.02em;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-out forwards;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }

  .section-text {
    font-size: 1rem;
    padding: 0 1.25rem;
    line-height: 1.9;
  }

  .card h5 {
    font-size: 1.1rem;
  }

  .card-text {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 1rem;
    padding: 0.6rem 1.5rem;
  }
}

</style>

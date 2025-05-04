<template>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
    <div class="container">
      <a class="navbar-brand me-auto" href="#">
        <img src="/homepageS1-logo.png" alt="Lovia Logo" width="80" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <div class="d-flex align-items-center gap-4">
          <form class="d-flex align-items-center search-form">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0">
                <img src="/searchicon.png" alt="search" width="20" />
              </span>
              <input
                class="form-control rounded-pill border-start-0"
                type="search"
                placeholder="搜尋產品 / 專案 / 團隊"
                aria-label="Search"
              />
            </div>
          </form>
          <a href="#" class="nav-link text-dark">探索</a>
          <a href="#" class="nav-link text-dark">提案</a>
        </div>
      </div>

      <!-- 右側區域：登入/註冊 或 使用者頭像 -->
      <div class="d-flex align-items-center ms-auto gap-3">
        <template v-if="user">
          <div class="dropdown">
            <button
              class="btn d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="user.avatar || defaultAvatar"
                alt="avatar"
                class="rounded-circle"
                width="36"
                height="36"
                style="object-fit: cover"
              />
              <span class="fw-semibold">{{ user.username }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">個人資料</a></li>

              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-danger" @click="handleLogout">登出</a></li>
            </ul>
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link text-dark">登入</router-link>
          <router-link to="/register" class="btn btn-dark rounded-pill px-3 custom-register"
            >註冊</router-link
          >
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/images/default-avatar.png'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

// 透過 computed 取得 user 狀態（這行是你畫面上用的 user）
const user = computed(() => userStore.user)

const checkLoginStatus = async () => {
  if (!userStore.token) return

  try {
    const res = await axios.post('http://localhost:8080/api/v1/users/status', null, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })
    userStore.setUser(res.data.user)
  } catch (err) {
    userStore.clear()
  }
}

onMounted(() => {
  checkLoginStatus()
  console.log('userStore.user in navbar:', userStore.user)
})

const handleLogout = () => {
  userStore.clear()
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

/* Navbar 背景透明＋內部間距細緻調整 */
.custom-navbar {
  background-color: rgba(255, 248, 249, 0.4); /* 改為 rgba，只讓背景透明 */
  padding-top: 10px;
  padding-bottom: 10px;
}

/* 搜尋框微調 */
.search-form .input-group {
  width: 300px;
}

.input-group-text {
  border: none;
}

.form-control {
  border: none;
  background-color: rgba(255, 255, 255, 0.5); /* 可自行調整顏色 */
}

.nav-link {
  font-weight: 400; /* 調成一般字重 */
  font-size: 16px;
}

/* 登入按鈕黑字無底線 */
.nav-link:hover {
  text-decoration: none;
}

/* 註冊按鈕文字大小統一 */
.custom-register {
  font-size: 16px;
  padding: 6px 16px;
}
</style>

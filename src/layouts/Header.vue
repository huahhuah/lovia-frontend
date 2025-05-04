<template v-if="!isLoading">
  <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
    <div class="container">
<<<<<<< HEAD
      <!-- Logo -->
      <router-link to="/" class="navbar-brand me-auto">
        <img src="/homepageS1-logo.png" alt="Lovia Logo" width="80" />
      </router-link>

      <!-- 漢堡選單 -->
=======
      <a class="navbar-brand me-auto" href="#">
        <img src="/homepageS1-logo.png" alt="Lovia Logo" width="80" />
      </a>
>>>>>>> origin/main
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 中間導航連結 -->
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
<<<<<<< HEAD
                placeholder="搜尋產品 / 專案 / 团队"
=======
                placeholder="搜尋產品 / 專案 / 團隊"
                aria-label="Search"
>>>>>>> origin/main
              />
            </div>
          </form>
          <a href="#" class="nav-link text-dark">探索</a>
          <a href="#" class="nav-link text-dark">提案</a>
        </div>
      </div>

<<<<<<< HEAD
      <!-- 右側登入狀態顯示區 -->
=======
      <!-- 右側區域：登入/註冊 或 使用者頭像 -->
>>>>>>> origin/main
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
<<<<<<< HEAD
=======

>>>>>>> origin/main
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-danger" @click="handleLogout">登出</a></li>
            </ul>
          </div>
        </template>
<<<<<<< HEAD
=======

>>>>>>> origin/main
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
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/images/default-avatar.png'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)
const isLoading = ref(true)
const baseUrl = 'https://lovia-backend-xl4e.onrender.com'

const checkLoginStatus = async () => {
  if (!userStore.token) {
    isLoading.value = false
    return
  }

  try {
    const res = await axios.post(`${baseUrl}/api/v1/users/status`, null, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    })
    userStore.setUser(res.data.user)
  } catch (err) {
    userStore.clear()
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await checkLoginStatus()
})

const handleLogout = () => {
  userStore.clear()
  router.push('/')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

.custom-navbar {
  background-color: rgba(255, 248, 249, 0.4); /* 改為 rgba，只讓背景透明 */
  padding-top: 10px;
  padding-bottom: 10px;
}

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
  font-weight: 400;
  font-size: 16px;
}

.nav-link:hover {
  text-decoration: none;
}

.custom-register {
  font-size: 16px;
  padding: 6px 16px;
}

.dropdown-menu {
  min-width: 160px;
}
</style>

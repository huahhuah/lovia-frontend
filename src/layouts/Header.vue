<template v-if="!isLoading">
  <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
    <div class="container d-flex align-items-center justify-content-between">
      <!-- 手機版 -->
      <div
        class="d-flex d-lg-none align-items-center justify-content-between w-100 px-3 py-2 mobile-header"
      >
        <button @click.stop="toggleSearch" class="btn p-0 border-0">
          <img src="/searchicon.png" alt="Search" width="20" />
        </button>
        <router-link to="/" @click="handleHomeClick">
          <img src="/homepageS1-logo.png" alt="Logo" height="25" />
        </router-link>
        <button @click.stop="isMenuOpen = true" class="btn p-0 border-0">
          <img src="/menu.png" alt="Menu" width="24" />
        </button>
      </div>

      <!-- 桌機版 Logo -->
      <router-link to="/" class="navbar-brand d-none d-lg-block logo-offset">
        <img src="/homepageS1-logo.png" alt="Lovia Logo" width="80" />
      </router-link>

      <!-- 桌機導覽列 -->
      <div class="d-none d-lg-flex align-items-center gap-4 middle-nav">
        <form class="search-form mb-0">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-end-0">
              <img src="/searchicon.png" alt="search" width="18" />
            </span>
            <input
              class="form-control rounded-pill border-start-0"
              type="search"
              placeholder="搜尋產品 / 專案"
            />
          </div>
        </form>
        <router-link to="/projects/explore-projects" class="nav-link text-dark">探索</router-link>
        <!-- <router-link to="/projects/create" class="nav-link text-dark">提案</router-link> -->
        <span class="nav-link text-dark" style="cursor: pointer" @click="handlePropose">
          提案
        </span>
      </div>

      <!-- 桌機登入／使用者區 -->
      <div class="d-none d-lg-flex align-items-center gap-3">
        <template v-if="user">
          <div class="dropdown">
            <button class="btn d-flex align-items-center gap-2" @click="toggleDropdown">
              <img
                :src="avatarUrl || defaultAvatar"
                class="rounded-circle"
                width="36"
                height="36"
              />
              <span class="fw-semibold">{{ user.username }}</span>
            </button>
            <ul v-show="isDropdownOpen" class="dropdown-menu dropdown-menu-end show">
              <!-- ✅ 管理員專屬 -->
              <li v-if="isAdmin">
                <router-link to="/admin" class="dropdown-item">管理後台</router-link>
              </li>

              <!-- ✅ 一般會員（贊助者 + 提案者）功能 -->
              <template v-else>
                <li><router-link to="/user" class="dropdown-item">會員中心</router-link></li>
                <li><router-link to="/user/edit" class="dropdown-item">個人資料</router-link></li>
                <li>
                  <router-link to="/user/password" class="dropdown-item">修改密碼</router-link>
                </li>

                <!-- 訂單管理 -->
                <li v-if="isProposer" class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#">訂單管理</a>
                  <ul class="dropdown-menu">
                    <li><router-link to="/orders" class="dropdown-item">我的贊助</router-link></li>
                    <li>
                      <router-link to="/user/projects/mine" class="dropdown-item">我的專案</router-link>
                    </li>
                  </ul>
                </li>
                <li v-else>
                  <router-link to="/orders" class="dropdown-item">訂單管理</router-link>
                </li>

                <!-- 專案提問 -->
                <li v-if="isProposer" class="dropdown-submenu">
                  <a class="dropdown-item dropdown-toggle" href="#">專案提問</a>
                  <ul class="dropdown-menu">
                    <li>
                      <router-link to="/questions" class="dropdown-item">我的提問</router-link>
                    </li>
                    <li>
                      <router-link to="/questions/manage" class="dropdown-item"
                        >提問管理</router-link
                      >
                    </li>
                  </ul>
                </li>
                <li v-else>
                  <router-link to="/questions" class="dropdown-item">專案提問</router-link>
                </li>
              </template>

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

  <!-- 手機搜尋浮層 -->
  <div
    v-if="isSearchOpen && windowWidth < 992"
    class="mobile-search-overlay"
    @click.self="isSearchOpen = false"
  >
    <form class="search-form mt-2 px-4">
      <div class="input-group">
        <input class="form-control rounded-pill" type="search" placeholder="搜尋產品 / 專案" />
      </div>
    </form>
  </div>

  <!-- 手機全頁選單 -->
  <div
    v-if="isMenuOpen && windowWidth < 992"
    class="mobile-menu-overlay"
    @click.self="isMenuOpen = false"
  >
    <div class="d-flex flex-column align-items-center py-4 gap-4">
      <img src="/homepageS1-logo.png" alt="Logo" width="150" @click="isMenuOpen = false" />
      <router-link to="/" class="menu-link" @click="isMenuOpen = false">首頁</router-link>
      <router-link to="/explore" class="menu-link" @click="isMenuOpen = false">探索</router-link>
      <!-- <router-link to="/propose" class="menu-link" @click="isMenuOpen = false">提案</router-link> -->
      <span class="menu-link" @click="handlePropose">提案</span>
      <template v-if="user">
        <router-link to="/user" class="menu-link" @click="isMenuOpen = false">會員中心</router-link>
        <span class="menu-link" @click="handleLogout">登出</span>
      </template>
      <template v-else>
        <router-link to="/register" class="menu-link" @click="isMenuOpen = false">註冊</router-link>
         <router-link to="/login" class="menu-link" @click="isMenuOpen = false">登入</router-link>
      </template>
      <button @click="isMenuOpen = false" class="btn p-0 border-0">
        <img src="/close.png" alt="Close" width="24" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

import axios from 'axios'
import defaultAvatar from '@/assets/images/default-avatar.png'

const userStore = useUserStore()
const router = useRouter()
const user = computed(() => userStore.user)
const isLoading = ref(true)
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isDropdownOpen = ref(false)
const baseUrl = 'https://lovia-backend-xl4e.onrender.com'

const avatarUrl = computed(() => {
  const avatar = user.value?.avatar_url
  return avatar ? avatar : defaultAvatar
})

const isAdmin = computed(() => userStore.isAdmin)
const isProposer = computed(() => userStore.isProposer)
const isSponsor = computed(() => userStore.isSponsor)

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  isMenuOpen.value = false
}

const toggleDropdown = (e) => {
  e.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const handlePropose = () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  if (isProposer.value) {
    console.log(isProposer)
    router.push('/projects/create')
  } else {
    router.push('/users/postApplication')
  }
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  window.addEventListener('click', handleClickOutside)
  updateWindowWidth()
  checkLoginStatus()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth)
  window.removeEventListener('click', handleClickOutside)
})

const windowWidth = ref(window.innerWidth)
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

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

const handleHomeClick = () => {
  isMenuOpen.value = false
  isSearchOpen.value = false
}

const handleLogout = () => {
  userStore.clear()
  router.push('/')
}
</script>
<style scoped>
.custom-navbar {
  background-color: rgba(255, 248, 249, 0.4);
  padding: 10px 0;
}

.middle-nav {
  margin-left: auto;
  margin-right: auto;
}

.search-form .input-group {
  width: 300px;
}

.input-group-text {
  border: none;
}

.form-control {
  border: none;
  background-color: rgba(255, 255, 255, 0.4);
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

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 3000;
  background-color: #fff;
  border: 1px solid #ccc;
  min-width: 160px;
  padding: 0.5rem 0;
  display: none;
}

.dropdown-menu.show {
  display: block;
}

.logo-offset {
  margin-left: 1.5rem;
}

.mobile-search-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 1050;
  padding: 12px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background-color: #ffd2cf;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.menu-link {
  font-size: 18px;
  color: #5f6368;
  text-decoration: none;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 8px;
  width: 100%;
  max-width: 343px; /* 根據你手機版 layout 可自行調整 */
  margin: 0 auto;
  text-align: center;
}

.menu-link:hover {
  color: #000;
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
}
  .dropdown-submenu {
    position: relative;
  }

  .dropdown-submenu > .dropdown-menu {
    top: 0;
    left: 100%;
    margin-left: 0;
    margin-right: 0;
    display: none;
    position: absolute;
  }

  .dropdown-submenu:hover > .dropdown-menu {
    display: block;
  }
  .mobile-menu-overlay {
  max-width: 100vw;
  overflow-x: hidden;
  }
</style>

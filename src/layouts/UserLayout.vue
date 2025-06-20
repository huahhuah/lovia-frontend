<template>
  <div class="user-layout-wrapper">
    <!-- ✅ 背景圖層（你說要改成 user-bg.png） -->
    <div class="background-layer"></div>

    <!-- ✅ 使用者頭像、名稱、導覽列 -->
    <section class="user-header container">
      <!-- ✅ 頭像與名稱 -->
      <div class="avatar-area">
        <img :src="avatarUrl" class="user-avatar" alt="avatar" />
        <h5 class="username-text">{{ user?.username || '使用者' }}</h5>
      </div>

      <!-- ✅ 導覽列（會員中心、個人資料、修改密碼） -->
      <ul class="nav user-nav">
        <li class="nav-item" :class="{ 'active-tab': $route.path === '/user' }">
          <router-link to="/user/sponsorships" class="nav-link" exact-active-class="active"
            >會員中心</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/user/edit" class="nav-link" exact-active-class="active"
            >個人資料</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/user/password" class="nav-link" exact-active-class="active"
            >修改密碼</router-link
          >
        </li>

        <!-- ✅ dropdown：訂單管理（若為贊助者時出現） -->
        <li
          class="nav-item dropdown-nav"
          :class="{ 'show-orders': showOrders }"
          v-if="isSponsor"
          @mouseenter="!isMobile && (showOrders = true)"
          @mouseleave="!isMobile && (showOrders = false)"
        >
          <div 
            class="nav-link dropdown-toggle" 
            @click="toggleOrders"
            data-bs-popper-config='{"strategy":"fixed"}'
          >
            <span>訂單管理</span>
            <span class="arrow">▾</span>
          </div>
          <ul class="dropdown-list" v-show="showOrders">
            <li>
              <router-link to="/user/sponsorships" class="dropdown-item">我的贊助</router-link>
            </li>
            <li v-if="isProposer">
              <router-link to="/user/projects/mine" class="dropdown-item">我的專案</router-link>
            </li>
          </ul>
        </li>

        <!-- ✅ dropdown：專案提問（提問列表／提問管理） -->
        <li
          class="nav-item dropdown-nav"
          :class="{ 'show-questions': showQuestions }"
          v-if="isSponsor || isProposer"
          @mouseenter="!isMobile && (showQuestions = true)"
          @mouseleave="!isMobile && (showQuestions = false)"
        >
          <div
            class="nav-link dropdown-toggle"
            @click="toggleQuestions"
          >
            <span>專案提問</span>
            <span class="arrow">▾</span>
          </div>
          <ul
            class="dropdown-list"
            v-show="showQuestions"
          >
            <li>
              <router-link to="/user/questions" class="dropdown-item">我的提問</router-link>
            </li>
            <li v-if="isProposer">
              <router-link to="/user/questions/manage" class="dropdown-item">提問管理</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- ✅ 頁面主要內容：會根據 router-view 換畫面 -->
    <main class="user-main container my-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/auth'
import defaultAvatar from '@/assets/images/default-avatar.png'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const isProposer = computed(() => userStore.isProposer)
const isSponsor = computed(() => userStore.isSponsor)

const avatarUrl = computed(() => {
  const avatar = user.value?.avatar_url
  return avatar ? avatar : defaultAvatar
})

// 控制 dropdown 顯示
const showOrders = ref(false)
const showQuestions = ref(false)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const toggleOrders = () => {
  if (isMobile.value) {
    showOrders.value = !showOrders.value
    showQuestions.value = false
    console.log('showOrders:', showOrders.value)
  }
}

const toggleQuestions = () => {
  if (isMobile.value) {
    showQuestions.value = !showQuestions.value
    showOrders.value = false
  }
}
</script>

<style scoped>
.user-layout-wrapper {
  position: relative;
  min-height: 100vh;
  background-image: linear-gradient(to right, #ffedf2, #fff6e3);
  background-size: cover;
  background-position: center top;
  overflow-x: hidden;
  overflow-y: visible;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  z-index: 0;
  background-image: url('/user-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
}

.user-header,
.user-main {
  max-width: 1296px;
  margin-left: auto;
  margin-right: auto;
}

.user-header {
  position: relative;
  z-index: 20;
  padding-top: 240px;

  display: flex;
  flex-direction: column;
  gap: 24px; /* 導覽列與頭貼區的距離 */
}

.avatar-area {
  display: flex;
  flex-direction: flex-end;
  align-items: center;
  flex-direction: flex-end; /* ✅ 讓頭像在上、名稱在下 */
  align-items: center; /* ✅ 水平置中 */
  width: 235px;
  height: 160px;
  gap: 16px;
}

.user-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 0 0 4px #fff1eb;
  z-index: 1;
}

.username-text {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: -80px;
  white-space: nowrap;
  color: #222;
}

.user-nav .nav-link {
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  color: #444;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  text-decoration: none; /* ✅ 不要底線 */
  text-align: center;
  line-height: 24px;
}

.user-nav .nav-link.active {
  color: #f45c7f;
  background: transparent;
}

.user-nav .nav-link.active::after {
  content: '';
  display: block;
  margin: 0 auto;
  margin-top: 4px;
  width: 40px;
  border-bottom: 2px solid #fc5b53;
}

.user-main {
  position: relative;
}

.dropdown-nav {
  position: relative;
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1050;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  min-width: 160px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: block;
  padding: 0.375rem 1rem;
  white-space: nowrap;
  color: #444;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  text-decoration: none;
}

.nav-link.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.nav-link.dropdown-toggle::after {
  content: none !important;
}

.arrow {
  font-size: 16px;
}

@media (max-width: 768px) {
  .user-main.container,
  .user-header.container {
    padding-left: 12px;
    padding-right: 12px;
    overflow-x: hidden;
  }

  .background-layer {
    width: 100%;
    max-width: 375px;
    height: 243px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .user-header,
  .user-main {
    padding-left: 16px;
    padding-right: 16px;
  }

  .avatar-area {
    width: 100px;
    height: 120px;
    margin-top: -60px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    margin-right: auto;
  }

  .user-avatar {
    width: 120px;
    height: 150px;
  }

  .username-text {
    width: 80px;
    height: 22px;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin: 0;
    color: #222;
  }

  .user-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 8px;
    margin: 0 auto;
    gap: 8px;
    width: 100%;
    max-width: 343px;
    height: auto;
    scrollbar-width: none;
    flex-wrap: nowrap;
    position: relative;
    z-index: 1000; /* ⭐ 讓 dropdown 不被擋住 */
  }

  .user-nav::-webkit-scrollbar {
    display: none;
  }

  .user-nav .nav-link {
    flex: none;
    padding: 6px 10px;
    font-size: 14px;
    text-align: center;
  }

  .user-nav .nav-link.active::after {
    content: '';
    display: block;
    margin: 0 auto;
    margin-top: 4px;
    width: 40px;
    border-bottom: 2px solid #fc5b53;
  }

  .dropdown-nav {
    position: relative; /* ✅ 關鍵：讓 dropdown 對齊它 */
  }

  .dropdown-list {
    position: absolute;
    top: calc(100% + 8px); /* 顯示在按鈕正下方並留點間距 */
    left: 0;

    z-index: 9999;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    min-width: 160px;
    max-height: 200px;
    overflow-y: auto;

    pointer-events: auto !important;
    position: absolute;
    /* ⭐ 重點加這兩行讓它不撐開外層 */
    display: none;
  }

  .dropdown-nav.show-orders .dropdown-list,
  .dropdown-nav.show-questions .dropdown-list {
    display: block;
  }

  .dropdown-item {
    padding: 0.375rem 1rem;
    white-space: nowrap;
    color: #444;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
  }
}
</style>

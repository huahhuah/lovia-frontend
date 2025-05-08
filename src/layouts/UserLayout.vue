<template>
  <div class="user-layout-wrapper">
    <!-- 背景層 -->
    <div class="background-layer"></div>

    <!-- 使用者頭像 + 名稱 + 導覽列 -->
    <section class="user-header container">
      <div class="avatar-area">
        <img :src="user?.avatar || defaultAvatar" class="user-avatar" alt="avatar" />
        <h5 class="username-text">{{ user?.username || '使用者' }}</h5>
      </div>

      <nav class="user-nav mt-3">
        <ul class="nav gap-4">
          <li class="nav-item">
            <router-link to="/user" class="nav-link" exact-active-class="active"
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
          <li class="nav-item">
            <router-link to="/user/orders" class="nav-link">訂單管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user/projects" class="nav-link">提案專案</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/user/questions" class="nav-link">專案提問</router-link>
          </li>
        </ul>
      </nav>
    </section>

    <!-- 主內容區塊 -->
    <main class="user-main container my-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/auth'
import defaultAvatar from '@/assets/images/default-avatar.png'

const userStore = useUserStore()
const user = userStore.user
</script>

<style scoped>
.user-layout-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/images/user bg.png');
}

/* 背景圖 + 單色漸層 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  z-index: 0;
  background-image: url('@/assets/images/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
}

/* 上方頭像 + 導覽列 */
.user-header {
  position: relative;
  z-index: 1;
  padding-top: 160px;
}

.avatar-area {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 0 0 4px #fff1eb;
  z-index: 1;
}

.username-text {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  color: #222;
}

/* 導覽列 */
.user-nav .nav-link {
  font-weight: 500;
  color: #444;
  padding: 8px 0;
  position: relative;
}

.user-nav .nav-link.active {
  color: #f45c7f;
}

.user-nav .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #f45c7f;
}

/* 主內容區塊 */
.user-main {
  position: relative;
  z-index: 1;
}
</style>

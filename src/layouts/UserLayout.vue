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

      <ul class="nav gap-4 user-nav">
        <!-- 會員中心 -->
        <li class="nav-item">
          <router-link to="/user" class="nav-link" exact-active-class="active"
            >會員中心</router-link
          >
        </li>
        <!-- 個人資料 -->
        <li class="nav-item">
          <router-link to="/user/edit" class="nav-link" exact-active-class="active"
            >個人資料</router-link
          >
        </li>
        <!-- 修改密碼 -->
        <li class="nav-item">
          <router-link to="/user/password" class="nav-link" exact-active-class="active"
            >修改密碼</router-link
          >
        </li>

        <!--  訂單管理 dropdown-->
        <li class="nav-item dropdown-nav" v-if="isSponsor">
          <div class="nav-link" @mouseover="showOrders = true" @mouseleave="showOrders = false">
            訂單管理 ▾
            <ul
              class="dropdown-list"
              v-show="showOrders"
              @mouseenter="showOrders = true"
              @mouseleave="showOrders = false"
            >
              <li>
                <router-link to="/user/sponsorships" class="dropdown-item">我的贊助</router-link>
              </li>
              <li v-if="isProposer">
                <router-link to="/user/projects/mine" class="dropdown-item">我的專案</router-link>
              </li>
            </ul>
          </div>
        </li>

        <!--  專案提問 dropdown-->
        <li class="nav-item dropdown-nav" v-if="isSponsor || isProposer">
          <div
            class="nav-link"
            @mouseover="showQuestions = true"
            @mouseleave="showQuestions = false"
          >
            專案提問 ▾
            <ul
              class="dropdown-list"
              v-show="showQuestions"
              @mouseenter="showQuestions = true"
              @mouseleave="showQuestions = false"
            >
              <li>
                <router-link to="/user/questions" class="dropdown-item">我的提問</router-link>
              </li>
              <li v-if="isProposer">
                <router-link to="/user/questions/manage" class="dropdown-item"
                  >提問管理</router-link
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <!-- 主內容區塊 -->
    <main class="user-main container my-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/auth'
import defaultAvatar from '@/assets/images/default-avatar.png'

const userStore = useUserStore()
const user = userStore.user
const isProposer = userStore.isProposer
const isSponsor = userStore.isSponsor

// 控制 dropdown 顯示
const showOrders = ref(false)
const showQuestions = ref(false)
</script>

<style scoped>
.user-layout-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/images/user bg.png');
}

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

.user-main {
  position: relative;
  z-index: 0;
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
</style>

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
          <router-link to="/user/favorites" class="nav-link" exact-active-class="active"
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
        <li class="nav-item dropdown-nav" v-if="isSponsor" 
            >
          <div class="nav-link" ref="ordersDropdownRef"
               @mouseenter="handleDropdownEnter('orders')"
               @mouseleave="handleDropdownLeave('orders')">
            訂單管理 ▾
          </div>
        </li>

        <!--  專案提問 dropdown-->
        <li class="nav-item dropdown-nav" v-if="isSponsor || isProposer">
          <div class="nav-link" ref="questionsDropdownRef"
               @mouseleave="handleDropdownLeave('questions')"
               @mouseenter="handleDropdownEnter('questions')">
            專案提問 ▾
          </div>
        </li>
      </ul>
    </section>

    <!-- 主內容區塊 -->
    <main class="user-main container my-5">
      <router-view />
    </main>

    <!-- Teleport dropdown to body -->
    <Teleport to="body">
      <!-- Orders dropdown -->
      <ul
        class="dropdown-list orders-dropdown"
        v-show="showOrders"
        :style="getDropdownStyle('orders')"
        @mouseenter="handleDropdownEnter('orders')"
        @mouseleave="handleDropdownLeave('orders')"
      >
        <li>
          <router-link to="/user/sponsorships" class="dropdown-item" @click="closeDropdown('orders')">我的贊助</router-link>
        </li>
        <li v-if="isProposer">
          <router-link to="/user/projects/mine" class="dropdown-item" @click="closeDropdown('orders')">我的專案</router-link>
        </li>
      </ul>
      
      <!-- Questions dropdown -->
      <ul
        class="dropdown-list questions-dropdown"
        v-show="showQuestions"
        :style="getDropdownStyle('questions')"
        @mouseenter="handleDropdownEnter('questions')"
        @mouseleave="handleDropdownLeave('questions')"
      >
        <li>
          <router-link to="/user/questions" class="dropdown-item" @click="closeDropdown('questions')">我的提問</router-link>
        </li>
        <li v-if="isProposer">
          <router-link to="/user/questions/manage" class="dropdown-item" @click="closeDropdown('questions')"
            >提問管理</router-link
          >
        </li>
      </ul>
    </Teleport>
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

// Refs for dropdown positioning
const questionsDropdownRef = ref(null)
const ordersDropdownRef = ref(null)

// 通用的 dropdown 樣式計算函數
const getDropdownStyle = (type) => {
  const refMap = {
    orders: ordersDropdownRef,
    questions: questionsDropdownRef
  }
  
  const targetRef = refMap[type]
  if (!targetRef?.value) return {}
  
  const rect = targetRef.value.getBoundingClientRect()
  return {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${rect.left}px`,
    zIndex: 9999
  }
}

// 通用的 dropdown 處理函數
const handleDropdownEnter = (type) => {
  if (type === 'orders') {
    showOrders.value = true
  } else if (type === 'questions') {
    showQuestions.value = true
  }
}

const handleDropdownLeave = (type) => {
  if (type === 'orders') {
    showOrders.value = false
  } else if (type === 'questions') {
    showQuestions.value = false
  }
}

const closeDropdown = (type) => {
  if (type === 'orders') {
    showOrders.value = false
  } else if (type === 'questions') {
    showQuestions.value = false
  }
}
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
  font-weight: 400;
  color: #444;
  padding: 12px 12px;
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
@media (max-width: 768px) {
  .user-nav .nav-item {
    margin-bottom: -40px; /* 預設可能是 8px～16px，這裡改小一點 */
  }

  .user-nav .nav-link.active::after {
    left: 25%;
    right: 25%;
    bottom: 8px; /* 更靠近文字 */
    height: 2px;
    background-color: #f45c7f;
  }
}
</style>
<template>
  <div class="d-flex" id="admin-layout">
    <!-- 側邊欄 -->
    <div 
      class="bg-dark text-white sidebar" 
      :class="{ 'd-none': !isSidebarOpen && isMobile, 'position-fixed': isMobile }"
    >
      <h4 class="mb-4">管理後台 <button class="btn-close btn-close-white float-end d-md-none" @click="toggleSidebar"></button></h4>
      <ul class="nav flex-column gap-2">
        <li>
          <router-link 
            to="/admin/dashboard" 
            class="nav-link text-white"
            @click="handleLinkClick"
            active-class="active"
            exact
            >總覽</router-link>
          </li>
          <li>
            <router-link 
              to="/admin/users" 
              class="nav-link text-white"
              @click="handleLinkClick"
              active-class="active"
              exact
              >使用者管理</router-link>
          </li>
          <li>
            <router-link 
              to="/admin/proposerReview" 
              class="nav-link text-white"
              @click="handleLinkClick"
              active-class="active"
              exact
              >權限審核</router-link>
          </li>
          <li>
            <router-link 
              to="/admin/projects" 
              class="nav-link text-white"
              @click="handleLinkClick"
              active-class="active"
              exact
              >專案管理</router-link>
          </li>
          <li><a href="javascript:void(0)" class="nav-link text-white disabled-link">交易管理</a></li>
          <li><a href="javascript:void(0)" class="nav-link text-white disabled-link">公告管理</a></li>
      </ul>
    </div>

    <!-- 動態內容區塊 -->
    <div class="flex-grow-1 p-4 content-area">
      <button class="btn btn-outline-secondary d-md-none mb-3" @click="toggleSidebar">☰ 選單</button>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
    if (!isMobile.value) isSidebarOpen.value = true // 桌機預設顯示側欄
  })
  if (!isMobile.value) isSidebarOpen.value = true
})

function handleLinkClick() {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}
</script>

<style scoped>
#admin-layout {
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  min-height: 100vh;
  padding: 5.5rem 1rem 1rem;
  z-index: 1050;
  background-color: #343a40;
}

.router-link-exact-active,
.router-link-active.active {
  background-color: #fff;
  color: #343a40 !important;
  font-weight: bold;
  border-radius: 4px;
}

.router-link-exact-active {
  border-left: 4px solid rgb(7, 131, 255);
  padding-left: 0.75rem;
  background-color: rgba(255, 255, 255, 1);
  color: #343a40 !important;
}
@media (max-width: 767px) {
  .sidebar {
    width: 70%;
    left: 0;
    top: 0;
    height: 100vh;
    padding-top: 4rem;
  }
  .flex-grow-1 {
    padding-top: 5rem !important; /* 調整這個值讓內容往下推 */
  }
}
</style>

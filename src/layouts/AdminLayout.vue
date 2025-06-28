  <template>
    <div class="d-flex" id="admin-layout">
      <!-- 側邊欄 -->
      <div class="bg-dark text-white sidebar">
        <h4 class="mb-4">管理後台</h4>
        <ul class="nav flex-column gap-2">
          <li><router-link to="/admin/dashboard" class="nav-link text-white">總覽</router-link></li>
          <li><router-link to="/admin/users" class="nav-link text-white">使用者管理</router-link></li>
          <li><router-link to="/admin/proposerReview" class="nav-link text-white">權限審核</router-link></li>
          <li>
            <router-link to="/admin/projects" class="nav-link text-white">專案管理</router-link>
          </li>
          <li>
            <router-link to="#" class="nav-link text-white">交易管理</router-link>
          </li>
          <li>
            <router-link to="#" class="nav-link text-white">公告管理</router-link>
          </li>
        </ul>
      </div>

      <!-- 動態內容區塊 -->
      <div class="flex-grow-1 p-4">
        <router-view />
      </div>
    </div>
  </template>

  <script setup></script>

  <style scoped>
  #admin-layout {
    min-height: 100vh;
  }
  .sidebar {
    width: 240px;
    min-height: 100vh;
    padding: 5.5rem 1rem 1rem;
  }
  </style>

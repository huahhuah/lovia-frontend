import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/auth'
import axios from 'axios'

const baseUrl = 'https://lovia-backend-xl4e.onrender.com'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterForm.vue'),
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    {
      path: '/user',
      component: () => import('@/layouts/UserLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'edit',
          name: 'EditProfile',
          component: () => import('@/views/users/EditProfile.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, adminOnly: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/admin/AdminDashboard.vue'),
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('../views/admin/AdminUsers.vue'),
        },
        {
          path: 'projects',
          name: 'AdminProjects',
          component: () => import('../views/admin/AdminProjects.vue'),
        },
      ],
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('../views/Unauthorized.vue'),
    },
  ],
})

// ⭐ 全域守衛: 驗證登入狀態 & 親級權限
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const isLoggedIn = userStore.isLoggedIn

  if (isLoggedIn && !userStore.user?.role) {
    try {
      const res = await axios.post(`${baseUrl}/api/v1/users/status`, null, {
        headers: { Authorization: `Bearer ${userStore.token}` },
      })
      userStore.setUser(res.data.user || res.data.users) // 支援兩種格式
    } catch (err) {
      console.warn('使用者角色同步失敗', err)
      userStore.clear()
      return next('/login')
    }
  }

  // 重新計算最新權限狀態
  const isAdmin = userStore.user?.role?.role_type === '管理員'

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.adminOnly && !isAdmin) {
    return next('/unauthorized')
  }

  next()
})

export default router

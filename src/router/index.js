import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/auth'
import axios from 'axios'

const baseUrl = 'https://lovia-backend-xl4e.onrender.com/api/v1'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      //第三方登入成功通知
      path: '/login-success',
      name: 'LoginSuccess',
      component: () => import('@/views/LoginSuccess.vue'),
    },

    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterForm.vue'),
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/users/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password/:token',
      name: 'ResetPassword',
      component: () => import('../views/users/ResetPasswordView.vue'),
      props: true, // 讓 token 可透過 props 傳入元件
    },
    {
      path: '/projects/:id',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectDetailView.vue'),
    },
    {
      path: '/projects/create',
      name: 'ProjectForm',
      component: () => import('@/views/projects/ProjectForm.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users/postApplication',
      name: 'Proposer',
      component: () => import('@/views/users/Proposer.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:project_id/plans',
      name: 'ProjectPlan',
      component: () => import('@/views/projects/ProjectPlan.vue'),
      props: (route) => ({ project_id: route.params.project_id }),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/explore-projects',
      name: 'explore-projects',
      component: () => import('@/views/projects/ExploreProjects.vue'),
      // redirect: '/projects/funding',
      children: [
        {
          path: 'funding',
          name: 'funding-projects',
          component: () => import('@/views/projects/FundingProjects.vue'),
        },
        {
          path: 'long-term',
          name: 'long-term-projects',
          component: () => import('@/views/projects/LongTermProjects.vue'),
        },
        {
          path: 'archived',
          name: 'archived-projects',
          component: () => import('@/views/projects/ArchivedProjects.vue'),
        },
      ],
    },
    {
      path: '/projects/funding/:id',
      name: 'FundingProjectDetail',
      component: () => import('@/views/projects/FundingProjectDetail.vue'),
      props: true,
    },
    {
      path: '/projects/:projectId/progress',
      name: 'ProgressFormCreate',
      component: () => import('@/views/projects/ProgressForm.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:projectId/progress/:progressId',
      name: 'ProgressFormEdit',
      component: () => import('@/views/projects/ProgressForm.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/projects/:project_id/edit',
      name: 'ProjectFormEdit',
      component: () => import('@/views/projects/ProjectForm.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      // 贊助專案確認
      path: '/checkout',
      name: 'SponsorshipConfirm',
      component: () => import('@/views/projects/SponsorshipConfirm.vue'),
    },
    {
      //訂單填寫資料
      path: '/checkout/order',
      name: 'Checkout',
      component: () => import('@/views/projects/OrderSponsorEntry.vue'),
    },
    {
      //確認訂單資料
      path: '/checkout/confirm',
      name: 'OrderConfirm',
      component: () => import('@/views/projects/OrderConfirm.vue'),
    },
    {
      //訂單交易成功結果
      path: '/checkout/result',
      name: 'PaymentResult',
      component: () => import('@/views/payment/PaymentResult.vue'),
    },
    {
      //訂單交易失敗
      path: '/checkout/cancel',
      name: 'PaymentCancel',
      component: () => import('@/views/payment/PaymentCancel.vue'),
    },
    {
      path: '/user',
      component: () => import('@/layouts/UserLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/user/sponsorships',
        },
        {
          path: 'edit',
          name: 'EditProfile',
          component: () => import('@/views/users/EditProfile.vue'),
        },
        {
          path: 'password',
          name: 'EditPassword',
          component: () => import('@/views/users/EditPassword.vue'),
        },
        {
          path: 'projects/mine',
          name: 'MyProjects',
          component: () => import('@/views/users/orders/MyProjects.vue'),
        },
        {
          path: 'sponsorships',
          name: 'MySponsorships',
          component: () => import('@/views/users/orders/MySponsorships.vue'),
        },
        {
          path: 'favorites', // ✅ 這行是你新增的收藏頁面
          name: 'MyFavorites',
          component: () => import('@/views/users/orders/MyFavorites.vue'),
        },
        {
          path: 'questions',
          name: 'MyQuestions',
          component: () => import('@/views/users/questions/MyQuestions.vue'),
        },
        {
          path: 'questions/manage',
          name: 'ManageQuestions',
          component: () => import('@/views/users/questions/ManageQuestions.vue'),
          meta: { proposerOnly: true },
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
          component: () => import('@/views/admin/AdminProjects.vue'),
        },
        {
          path: 'proposerReview',
          name: 'AdminProposersReview',
          component: () => import(`@/views/admin/AdminProposerReview.vue`),
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

//  全域守衛: 驗證登入狀態 & 親級權限
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 排除不需要認證檢查的頁面
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPage = publicPages.some((page) => to.path.startsWith(page))

  if (isPublicPage) {
    return next() // 直接通過，不做認證檢查
  }

  const isLoggedIn = userStore.isLoggedIn

  if (isLoggedIn && !userStore.user?.role) {
    try {
      const res = await axios.post(`${baseUrl}/users/status`, null, {
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

//    if (to.meta.requiresAuth && !isLoggedIn) {
//    return next('/login')
//  }

//  if (to.meta.adminOnly && !isAdmin) {
//    return next('/unauthorized')
//  }

  next()
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'

const routes = [
  {
    path: '/',
    name: 'Panorama',
    component: () => import('../pages/PanoramaView.vue')
  },
  {
    path: '/location/:id',
    name: 'Location',
    component: () => import('../pages/LocationView.vue'),
    props: true
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/RankingPage.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/UserManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  // 检查是否要求未登录（如登录页面）
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next('/users')
    return
  }

  next()
})

export default router
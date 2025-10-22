import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('../views/UserManagement.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // 添加通配路由处理未知路径
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }  // Protected route
    },
    {
      path: '/module/:id',  // Dynamic route for module IDs
      name: 'module',
      component: () => import('../views/ModuleView.vue'),
      meta: { requiresAuth: true },
      props: true  // Pass route params as props
    },
    {
      path: '/:pathMatch(.*)*',  // Catch-all 404
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// Authentication guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'login' }
  }
  
  // Redirect logged-in users away from login page
  if (to.name === 'login' && authStore.user) {
    return { name: 'dashboard' }
  }
})

export default router
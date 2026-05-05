import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/products',
      component: () => import('../views/ProductsLayout.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          name: 'ProductsList',
          component: () => import('../views/ProductsList.vue'),
        },
        {
          path: ':id',
          name: 'ProductDetail',
          component: () => import('../views/ProductDetail.vue'),
          props: true
        },
        {
          path: 'category/:category',
          name: 'ProductsByCategory',
          component: () => import('../views/ProductsList.vue'),
          props: true
        }
      ]
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/Cart.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import('../views/Wishlist.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/Checkout.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
          next()
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
          next()
        } else {
          next('/login')
        }
      },
      children: [
        {
          path: '',
          name: 'ProfileInfo',
          component: () => import('../views/ProfileInfo.vue'),
        },
        {
          path: 'orders',
          name: 'OrderHistory',
          component: () => import('../views/OrderHistory.vue'),
        },
        {
          path: 'settings',
          name: 'ProfileSettings',
          component: () => import('../views/ProfileSettings.vue'),
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/order-success/:orderId',
      name: 'OrderSuccess',
      component: () => import('../views/OrderSuccess.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    }
  ]
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

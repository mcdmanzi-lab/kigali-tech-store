<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const searchQuery = ref('')

const cartCount = computed(() => cartStore.cartCount)
const wishlistCount = computed(() => wishlistStore.wishlistCount)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.name || '')

function handleSearch(e) {
  if (e.key === 'Enter' && searchQuery.value.trim()) {
    router.push(`/products?search=${searchQuery.value}`)
    searchQuery.value = ''
    isMenuOpen.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/')
  isMenuOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div class="w-10 h-10 bg-gradient-accent rounded-xl shadow-md flex items-center justify-center">
            <span class="text-lg font-bold text-white">KT</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">Kigali Tech</h1>
            <p class="text-xs text-gray-500">Store</p>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1 site-header-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/about">About</router-link>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Search (Desktop) -->
          <div class="hidden md:flex items-center bg-gray-100 rounded-xl px-3 py-2.5 hover:bg-gray-200 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary">
            <Search class="w-4 h-4 text-gray-400 mr-2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              @keyup="handleSearch"
              aria-label="Search products"
              class="bg-transparent text-sm outline-none w-48 placeholder-gray-500"
            />
          </div>

          <!-- Cart -->
          <router-link to="/cart" class="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all" aria-label="View cart">
            <ShoppingCart class="w-6 h-6" />
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-kigali-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">
              {{ cartCount }}
            </span>
          </router-link>

          <!-- Wishlist -->
          <router-link to="/wishlist" class="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all" aria-label="View wishlist">
            <Heart class="w-6 h-6" />
            <span v-if="wishlistCount > 0" class="absolute -top-1 -right-1 bg-kigali-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">
              {{ wishlistCount }}
            </span>
          </router-link>

          <!-- Auth -->
          <div v-if="isAuthenticated" class="hidden md:flex items-center space-x-2 pl-2 sm:pl-4 border-l border-gray-200">
            <router-link to="/profile" class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
              <User class="w-5 h-5" />
              <span class="text-sm font-medium hidden lg:inline">{{ userName }}</span>
            </router-link>
            <button @click="logout" class="p-2 text-gray-600 hover:text-kigali-red hover:bg-gray-100 rounded-lg transition-all" aria-label="Logout">
              <LogOut class="w-5 h-5" />
            </button>
          </div>

          <div v-else class="hidden md:flex items-center space-x-2 pl-2 sm:pl-4 border-l border-gray-200">
            <router-link to="/login" class="text-sm text-gray-600 hover:text-primary font-medium transition-colors">Login</router-link>
            <router-link to="/register" class="btn btn-primary btn-sm">Sign Up</router-link>
          </div>

          <!-- Mobile Menu Toggle -->
          <button @click="toggleMenu" class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" :aria-expanded="isMenuOpen.toString()" aria-label="Toggle menu">
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="lg:hidden border-t border-gray-100 mt-4 pt-4 animate-slide-in space-y-4">
        <div class="flex items-center bg-gray-100 rounded-xl px-3 py-2.5">
          <Search class="w-4 h-4 text-gray-400 mr-2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            @keyup="handleSearch"
            class="bg-transparent text-sm outline-none flex-1"
          />
        </div>
        <nav class="flex flex-col space-y-1">
          <router-link to="/" @click="closeMenu" class="px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">Home</router-link>
          <router-link to="/products" @click="closeMenu" class="px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">Products</router-link>
          <router-link to="/about" @click="closeMenu" class="px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">About</router-link>
        </nav>
        <div v-if="!isAuthenticated" class="flex flex-col space-y-2 pt-4 border-t border-gray-100">
          <router-link to="/login" @click="closeMenu" class="px-3 py-2 text-gray-600 hover:text-primary transition-colors">Login</router-link>
          <router-link to="/register" @click="closeMenu" class="btn btn-primary w-full">Sign Up</router-link>
        </div>
        <div v-else class="flex flex-col space-y-2 pt-4 border-t border-gray-100">
          <router-link to="/profile" @click="closeMenu" class="px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">My Profile</router-link>
          <button @click="logout" class="px-3 py-2 text-left text-gray-600 hover:text-kigali-red hover:bg-gray-50 rounded-lg transition-all">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Smooth transitions for menu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

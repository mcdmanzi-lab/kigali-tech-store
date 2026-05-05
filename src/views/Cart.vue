<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { Trash2, ChevronLeft, ShoppingCart } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartItems = computed(() => cartStore.items)
const isEmpty = computed(() => cartItems.value.length === 0)

const subtotal = computed(() => cartStore.subtotal)
const tax = computed(() => cartStore.tax)
const shipping = computed(() => cartStore.SHIPPING)
const total = computed(() => cartStore.total)

function updateQuantity(productId, newQuantity) {
  cartStore.updateQuantity(productId, newQuantity)
}

function removeItem(productId) {
  cartStore.removeFromCart(productId)
}

function proceedToCheckout() {
  if (authStore.isAuthenticated) {
    router.push('/checkout')
  } else {
    router.push('/login')
  }
}
</script>

<template>

  <div class="space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Shopping Cart</h1>
      <p class="text-lg text-gray-600">{{ cartItems.length }} item(s) in your cart</p>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="card p-12 sm:p-16 text-center space-y-6">
      <div class="text-7xl">🛒</div>
      <div class="space-y-2">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Your cart is empty</h2>
        <p class="text-gray-600">Looks like you haven't added anything yet. Start shopping and find amazing products!</p>
      </div>
      <router-link to="/products" class="btn btn-primary btn-lg inline-flex">
        <ShoppingCart class="w-5 h-5" />
        <span>Continue Shopping</span>
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in cartItems" :key="item.id" class="card p-4 sm:p-6 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 group">
          <!-- Product Image -->
          <div class="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-shadow">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>

          <!-- Product Info -->
          <div class="flex-grow">
            <router-link :to="`/product/${item.id}`" class="hover:text-primary transition-colors">
              <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ item.title }}</h3>
            </router-link>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.description }}</p>
            <p class="text-base font-bold text-primary">
              RWF {{ Math.round(item.price * 1200).toLocaleString() }}
            </p>
          </div>

          <!-- Quantity & Remove -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-4 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            <!-- Quantity Controls -->
            <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                @click="updateQuantity(item.id, Math.max(1, item.quantity - 1))"
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors font-semibold"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span class="w-8 text-center font-semibold text-gray-900">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors font-semibold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <!-- Remove Button -->
            <button
              @click="removeItem(item.id)"
              class="p-2 text-gray-400 hover:text-kigali-red hover:bg-kigali-red-light rounded-lg transition-all"
              aria-label="Remove from cart"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <aside class="lg:col-span-1">
        <div class="card p-6 sm:p-8 sticky top-32 space-y-6">
          <!-- Title -->
          <h2 class="text-2xl font-bold text-gray-900">Order Summary</h2>

          <!-- Summary Details -->
          <div class="space-y-3 pb-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold text-gray-900">RWF {{ Math.round(subtotal * 1200).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Tax <span class="text-xs text-gray-500">(18%)</span></span>
              <span class="font-semibold text-gray-900">RWF {{ Math.round(tax * 1200).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Shipping</span>
              <span class="font-semibold text-gray-900">RWF {{ shipping.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center text-xl">
            <span class="font-bold text-gray-900">Total</span>
            <span class="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">RWF {{ Math.round(total * 1200).toLocaleString() }}</span>
          </div>

          <!-- Buttons -->
          <div class="space-y-3 pt-4">
            <button
              @click="proceedToCheckout"
              class="btn btn-primary w-full btn-lg"
            >
              Proceed to Checkout
            </button>
            <router-link to="/products" class="btn btn-outline w-full flex justify-center items-center">
              <ChevronLeft class="w-4 h-4" />
              Continue Shopping
            </router-link>
          </div>

          <!-- Trust Badge -->
          <div class="bg-primary-light rounded-lg p-3 text-center text-xs text-gray-600">
            ✓ Secure checkout with Stripe
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

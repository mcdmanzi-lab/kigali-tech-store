<script setup lang="ts">
import { computed } from 'vue'
import { useWishlistStore } from '../stores/wishlist'
import { useCartStore } from '../stores/cart'
import { Trash2, Heart, ShoppingCart, ChevronRight } from 'lucide-vue-next'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const wishlistItems = computed(() => wishlistStore.items)
const isEmpty = computed(() => wishlistItems.value.length === 0)

function removeFromWishlist(productId) {
  wishlistStore.removeFromWishlist(productId)
}

function addToCart(product) {
  cartStore.addToCart(product)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
      <p class="text-gray-600 mt-2">{{ wishlistItems.length }} item(s) saved</p>
    </div>

    <div v-if="isEmpty" class="bg-gray-50 rounded-lg p-12 text-center">
      <Heart class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
      <p class="text-gray-600 mb-6">Save your favorite products to view them later</p>
      <router-link to="/products" class="btn-primary">Explore Products</router-link>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in wishlistItems" :key="item.id" class="card overflow-hidden">
          <!-- Image -->
          <div class="relative h-48 bg-gray-100 overflow-hidden">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
          </div>

          <!-- Info -->
          <div class="p-4 space-y-3">
            <p class="text-xs text-gray-500 uppercase">{{ item.category }}</p>
            <h3 class="font-semibold text-gray-900 line-clamp-2">{{ item.title }}</h3>

            <div class="flex items-center space-x-1">
              <span class="text-lg font-bold text-primary-DEFAULT">
                RWF {{ Math.round(item.price * 1200).toLocaleString() }}
              </span>
            </div>

            <div class="flex gap-2">
              <button
                @click="addToCart(item)"
                class="btn-primary flex-1 flex items-center justify-center space-x-2 text-sm"
              >
                <ShoppingCart class="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                @click="removeFromWishlist(item.id)"
                class="px-4 py-2 text-kigali-red border border-kigali-red rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <div v-if="item.addedAt" class="text-xs text-gray-500">
              Saved {{ new Date(item.addedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <router-link to="/products" class="flex items-center space-x-2 btn-outline">
          <span>Back to Shopping</span>
          <ChevronRight class="w-5 h-5" />
        </router-link>
      </div>
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

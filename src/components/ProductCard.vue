<script setup lang="ts">
import { Star, Heart, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

function addToCart() {
  cartStore.addToCart(props.product)
}

function toggleWishlist() {
  wishlistStore.toggleWishlist(props.product)
}
</script>

<template>
  <div class="product-card group">
    <!-- Image Container -->
    <div class="product-image-wrapper">
      <img
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        decoding="async"
        class="product-image"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      
      <!-- Wishlist Button -->
      <button
        @click="toggleWishlist"
        class="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
        :aria-pressed="isInWishlist"
        :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
      >
        <Heart
          :class="['w-5 h-5 transition-all duration-300', isInWishlist ? 'fill-kigali-red text-kigali-red scale-110' : 'text-gray-300 hover:text-kigali-red']"
        />
      </button>

      <!-- Quick View Badge -->
      <div class="absolute bottom-4 left-4 right-4">
        <button class="w-full btn btn-secondary btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-2">
          Quick View
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <!-- Category Badge -->
      <span class="inline-block badge badge-primary mb-3 text-xs font-semibold">
        {{ product.category }}
      </span>
      
      <!-- Title -->
      <h3 class="product-title">
        {{ product.title }}
      </h3>

      <!-- Rating -->
      <div class="product-rating mb-4">
        <div class="flex items-center">
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star class="w-4 h-4 fill-yellow-100 text-yellow-100" />
        </div>
        <span class="text-xs text-gray-500 ml-2">({{ product.rating?.count || 0 }})</span>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <p class="product-price">
          RWF {{ Math.round(product.price * 1200).toLocaleString() }}
        </p>
        <p class="product-price-original">{{ product.price.toFixed(2) }} USD</p>
      </div>

      <!-- Add to Cart Button -->
      <button
        @click="addToCart"
        class="btn btn-primary w-full flex items-center justify-center space-x-2 text-sm font-semibold"
        aria-label="Add to cart"
      >
        <ShoppingCart class="w-4 h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  </div>
</template>

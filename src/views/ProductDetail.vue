<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { ChevronLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-vue-next'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref(null)
const quantity = ref(1)
const loading = ref(true)
const error = ref(null)
const showAddedMessage = ref(false)

onMounted(() => {
  const productId = parseInt(route.params.id)
  
  // Fetch products if needed
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts().then(() => {
      product.value = productsStore.getProductById(productId)
      loading.value = false
    }).catch(() => {
      error.value = 'Failed to load product'
      loading.value = false
    })
  } else {
    product.value = productsStore.getProductById(productId)
    loading.value = false
  }

  if (!product.value) {
    error.value = 'Product not found'
  }
})

const isInWishlist = computed(() => {
  return product.value && wishlistStore.isInWishlist(product.value.id)
})

const priceInRWF = computed(() => {
  if (!product.value) return 0
  return Math.round(product.value.price * 1200)
})

function addToCart() {
  if (product.value && quantity.value > 0) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value)
    }
    showAddedMessage.value = true
    setTimeout(() => {
      showAddedMessage.value = false
    }, 3000)
  }
}

function toggleWishlist() {
  if (product.value) {
    wishlistStore.toggleWishlist(product.value)
  }
}

function goBack() {
  router.back()
}

function updateQuantity(val) {
  quantity.value = Math.max(1, val)
}
</script>

<template>
  <div>
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center space-x-2 text-primary hover:text-primary-dark transition mb-6"
    >
      <ChevronLeft class="w-5 h-5" />
      <span>Back to Products</span>
    </button>

    <!-- Error Message -->
    <ErrorMessage v-if="error" :message="error" />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Product Detail -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Product Image -->
      <div class="flex items-center justify-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <img
          :src="product.image"
          :alt="product.title"
          loading="lazy"
          decoding="async"
          class="max-h-96 max-w-full object-contain transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <!-- Category -->
        <p class="text-sm text-gray-500 uppercase tracking-wide">{{ product.category }}</p>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>

        <!-- Rating -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center">
            <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <span class="text-lg font-semibold">{{ product.rating?.rate || 4.5 }}</span>
          <span class="text-gray-600">({{ product.rating?.count || 0 }} reviews)</span>
        </div>

        <!-- Price -->
        <div class="bg-gray-50 rounded-lg p-6 space-y-2">
          <p class="text-4xl font-bold text-primary-DEFAULT">RWF {{ priceInRWF.toLocaleString() }}</p>
          <p class="text-gray-600">{{ product.price.toFixed(2) }} USD</p>
        </div>

        <!-- Description -->
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

        <!-- Quantity & Actions -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="text-sm font-semibold text-gray-700" for="quantity-input">Quantity:</label>
            <input
              id="quantity-input"
              :value="quantity"
              @input="updateQuantity($event.target.value)"
              type="number"
              min="1"
              aria-label="Quantity"
              class="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Add to Cart -->
            <button
              @click="addToCart"
              class="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              <ShoppingCart class="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <!-- Add to Wishlist -->
            <button
              @click="toggleWishlist"
              :class="['btn-outline flex items-center justify-center space-x-2 flex-1', isInWishlist && 'bg-red-50 border-kigali-red text-kigali-red']"
            >
              <Heart :class="['w-5 h-5', isInWishlist && 'fill-current']" />
              <span>{{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="showAddedMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
            ✓ Added to cart successfully!
          </div>
        </div>

        <!-- Features -->
        <div class="border-t pt-6 space-y-3">
          <div class="flex items-start space-x-3">
            <Truck class="w-5 h-5 text-primary-DEFAULT flex-shrink-0 mt-1" />
            <div>
              <p class="font-semibold text-gray-900">Fast Delivery</p>
              <p class="text-sm text-gray-600">Delivered within 2-3 business days</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <Shield class="w-5 h-5 text-primary-DEFAULT flex-shrink-0 mt-1" />
            <div>
              <p class="font-semibold text-gray-900">Secure Purchase</p>
              <p class="text-sm text-gray-600">Protected by Stripe payment gateway</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <RotateCcw class="w-5 h-5 text-primary-DEFAULT flex-shrink-0 mt-1" />
            <div>
              <p class="font-semibold text-gray-900">Easy Returns</p>
              <p class="text-sm text-gray-600">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-12">
      <div class="text-5xl mb-4">🔍</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
      <p class="text-gray-600 mb-6">Sorry, the product you're looking for doesn't exist.</p>
      <router-link to="/products" class="btn-primary">Back to Products</router-link>
    </div>
  </div>
</template>

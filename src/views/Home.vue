<template>
  <div class="space-y-12 md:space-y-20">
    <!-- Hero Banner -->
    <section class="bg-gradient-accent rounded-3xl overflow-hidden shadow-elevation -mx-4 sm:mx-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-8 sm:p-12 md:p-16 lg:p-20">
        <div class="text-center md:text-left space-y-6">
          <div class="space-y-4">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              Welcome to <br />
              <span class="text-yellow-100">Kigali Tech</span>
            </h1>
            <p class="text-lg sm:text-xl text-white/90 font-medium leading-relaxed">
              Discover the latest gadgets and electronics at unbeatable prices. From smartphones to laptops and accessories, find everything you need in one place.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <router-link to="/products" class="btn btn-secondary btn-lg shadow-lg hover:shadow-elevation transform hover:-translate-y-1 transition-all">
              <Zap class="w-5 h-5" />
              <span>Shop Now</span>
            </router-link>
            <button class="btn btn-outline btn-lg border-white text-white hover:bg-white/20 hover:border-white transition-all">
              <span>Learn More</span>
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="hidden md:flex items-center justify-center">
          <div class="relative w-72 h-72 lg:w-96 lg:h-96">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-full blur-3xl"></div>
            <div class="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center shadow-2xl border border-white/30 transform hover:scale-110 transition-transform duration-500">
              <div class="text-9xl drop-shadow-lg">📱</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="space-y-8">
      <div class="section-header">
        <h2 class="section-title">Shop by Category</h2>
        <p class="section-subtitle">Browse products by your favorite categories</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <button
          v-for="category in categories"
          :key="category"
          @click="navigateToCategory(category)"
          class="card p-6 sm:p-8 text-center hover:shadow-elevation hover:-translate-y-2 active:scale-95 transition-all group"
        >
          <div class="text-3xl sm:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {{ getCategoryIcon(category) }}
          </div>
          <p class="capitalize font-bold text-gray-800 text-sm sm:text-base group-hover:text-primary transition-colors">
            {{ category }}
          </p>
        </button>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 section-header">
        <div>
          <h2 class="section-title">Featured Products</h2>
          <p class="section-subtitle">Handpicked items just for you</p>
        </div>
        <router-link to="/products" class="btn btn-primary btn-md whitespace-nowrap">
          <span>View All</span>
          <ChevronRight class="w-4 h-4" />
        </router-link>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- Features Section -->
    <section class="space-y-8">
      <div class="section-header">
        <h2 class="section-title">Why Choose Us</h2>
        <p class="section-subtitle">Quality, speed, and reliability</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Fast Delivery -->
        <div class="card p-8 hover:shadow-elevation hover:-translate-y-2 transition-all group">
          <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">🚚</div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
          <p class="text-gray-600 leading-relaxed">Quick and secure delivery to your doorstep anywhere in Kigali with real-time tracking.</p>
        </div>

        <!-- Secure Payment -->
        <div class="card p-8 hover:shadow-elevation hover:-translate-y-2 transition-all group">
          <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">💳</div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Secure Payment</h3>
          <p class="text-gray-600 leading-relaxed">Safe, seamless, and encrypted payment options with Stripe and other trusted payment methods.</p>
        </div>

        <!-- Support -->
        <div class="card p-8 hover:shadow-elevation hover:-translate-y-2 transition-all group">
          <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">🤝</div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
          <p class="text-gray-600 leading-relaxed">Our dedicated support team is available to help you anytime with your questions and concerns.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials or CTA Section -->
    <section class="bg-gradient-soft rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Shop?</h2>
      <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied customers shopping at Kigali Tech Store. Explore our wide range of products today!
      </p>
      <router-link to="/products" class="btn btn-primary btn-lg inline-flex">
        <Zap class="w-5 h-5" />
        <span>Start Shopping</span>
      </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { ChevronRight, Zap } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const productsStore = useProductsStore()

const featuredProducts = ref([])
const categories = ref([])
const loading = ref(false)

const categoryIcons = {
  electronics: '💻',
  jewelery: '💍',
  'men\'s clothing': '👕',
  'women\'s clothing': '👗',
}

function getCategoryIcon(category) {
  return categoryIcons[category] || '📦'
}

onMounted(async () => {
  loading.value = true
  await productsStore.fetchProducts()
  await productsStore.fetchCategories()
  
  // Get featured products (first 6)
  featuredProducts.value = productsStore.products.slice(0, 6)
  categories.value = productsStore.categories.slice(0, 4)
  loading.value = false
})

function navigateToCategory(category) {
  router.push(`/products/category/${category}`)
}
</script>

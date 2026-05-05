<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { ChevronDown, X } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const productsStore = useProductsStore()

const showFilters = ref(false)
const searchInput = ref('')
const priceMin = ref(0)
const priceMax = ref(1000)
const selectedCategory = ref(null)
const isDesktop = ref(true)

onMounted(async () => {
  // Fetch products if not already fetched
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
    await productsStore.fetchCategories()
  }

  // Handle category from URL
  if (route.params.category) {
    selectedCategory.value = route.params.category
  }

  // Handle search from query
  if (route.query.search) {
    searchInput.value = route.query.search
    productsStore.setSearchQuery(searchInput.value)
  }

  // Initialize desktop responsive state
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1024
    window.addEventListener('resize', () => {
      isDesktop.value = window.innerWidth >= 1024
    })
  }
})

const displayedProducts = computed(() => {
  return productsStore.filteredProducts
})

// Performance: only render a subset and allow loading more
const visibleCount = ref(12)
const visibleProducts = computed(() => {
  return displayedProducts.value.slice(0, visibleCount.value)
})

const displayedCount = computed(() => displayedProducts.value.length)

function applyFilters() {
  productsStore.setSearchQuery(searchInput.value)
  productsStore.setPriceRange(priceMin.value, priceMax.value)
  if (selectedCategory.value) {
    productsStore.setCategory(selectedCategory.value)
  }
}

function clearFilters() {
  searchInput.value = ''
  priceMin.value = 0
  priceMax.value = 1000
  selectedCategory.value = null
  productsStore.resetFilters()
}

function updateSearchQuery() {
  productsStore.setSearchQuery(searchInput.value)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Browse Products</h1>
      <p class="text-lg text-gray-600">
        Found <span class="font-semibold text-primary">{{ displayedCount }}</span> amazing products
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Sidebar Filters -->
      <aside class="lg:col-span-1">
        <div v-if="showFilters || isDesktop" class="lg:sticky lg:top-24">
          <button 
            v-if="!isDesktop"
            @click="showFilters = false"
            class="mb-4 lg:hidden text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-2"
          >
            <X class="w-4 h-4" />
            <span>Close Filters</span>
          </button>

          <div class="card p-6 space-y-6">
            <!-- Search -->
            <div>
              <label class="form-label">Search Products</label>
              <input
                v-model="searchInput"
                @input="updateSearchQuery"
                type="text"
                placeholder="Search..."
                class="form-input text-sm"
              />
            </div>

            <!-- Categories -->
            <div v-if="productsStore.categories.length > 0">
              <label class="form-label">Category</label>
              <select
                v-model="selectedCategory"
                @change="applyFilters"
                class="form-input text-sm"
              >
                <option :value="null">All Categories</option>
                <option v-for="cat in productsStore.categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div>
              <label class="form-label">Price Range</label>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Minimum</span>
                    <span class="font-semibold text-primary">${{ priceMin }}</span>
                  </div>
                  <input
                    v-model.number="priceMin"
                    @change="applyFilters"
                    type="range"
                    min="0"
                    max="1000"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Maximum</span>
                    <span class="font-semibold text-primary">${{ priceMax }}</span>
                  </div>
                  <input
                    v-model.number="priceMax"
                    @change="applyFilters"
                    type="range"
                    min="0"
                    max="1000"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="btn btn-outline w-full"
            >
              <X class="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <main class="lg:col-span-4">
        <!-- Mobile Filter Toggle -->
        <div class="lg:hidden mb-6">
          <button
            @click="showFilters = !showFilters"
            class="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-800 hover:border-primary transition-colors"
          >
            <div class="flex items-center space-x-2">
              <ChevronDown :class="{'rotate-180': showFilters}" class="w-5 h-5 transition-transform" />
              <span>{{ showFilters ? 'Hide Filters' : 'Show Filters' }}</span>
            </div>
          </button>
        </div>

        <!-- Loading State -->
        <LoadingSpinner v-if="productsStore.loading" />

        <!-- Products Grid -->
        <div v-else-if="displayedProducts.length > 0" class="space-y-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
          </div>

          <!-- Load more button -->
          <div v-if="visibleCount < displayedCount" class="text-center pt-8">
            <button @click="visibleCount += 12" class="btn btn-primary btn-lg">
              Load More Products
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="card p-12 text-center">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600 mb-8">
            We couldn't find any products matching your filters. Try adjusting your search or filters.
          </p>
          <button
            @click="clearFilters"
            class="btn btn-primary btn-md"
          >
            Clear Filters
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

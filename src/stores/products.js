import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'https://fakestoreapi.com'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const filters = ref({
    category: null,
    priceRange: [0, 1000],
    searchQuery: ''
  })

  const filteredProducts = computed(() => {
    let result = products.value

    // Filter by category
    if (filters.value.category) {
      result = result.filter(p => p.category === filters.value.category)
    }

    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.value.priceRange[0] && 
      p.price <= filters.value.priceRange[1]
    )

    // Filter by search query
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    return result
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/products`)
      products.value = response.data.map(product => ({
        ...product,
        rating: {
          rate: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3-5
          count: Math.floor(Math.random() * 500) + 10
        }
      }))
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await axios.get(`${API_BASE}/products/categories`)
      categories.value = response.data
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  async function fetchProductsByCategory(category) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/products/category/${category}`)
      products.value = response.data.map(product => ({
        ...product,
        rating: {
          rate: (Math.random() * 2 + 3).toFixed(1),
          count: Math.floor(Math.random() * 500) + 10
        }
      }))
      filters.value.category = category
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function getProductById(id) {
    return products.value.find(p => p.id === parseInt(id))
  }

  function setSearchQuery(query) {
    filters.value.searchQuery = query
  }

  function setPriceRange(min, max) {
    filters.value.priceRange = [min, max]
  }

  function setCategory(category) {
    filters.value.category = category
  }

  function resetFilters() {
    filters.value = {
      category: null,
      priceRange: [0, 1000],
      searchQuery: ''
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    filters,
    filteredProducts,
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    getProductById,
    setSearchQuery,
    setPriceRange,
    setCategory,
    resetFilters
  }
})

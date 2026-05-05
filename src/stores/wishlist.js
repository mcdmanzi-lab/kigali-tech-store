import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])

  // Load wishlist from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kigali-wishlist')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }

  const isInWishlist = computed(() => {
    return (productId) => items.value.some(item => item.id === productId)
  })

  const wishlistCount = computed(() => items.value.length)

  function toggleWishlist(product) {
    const index = items.value.findIndex(item => item.id === product.id)
    if (index > -1) {
      items.value.splice(index, 1)
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        addedAt: new Date().toISOString()
      })
    }
    saveWishlist()
  }

  function removeFromWishlist(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveWishlist()
  }

  function clearWishlist() {
    items.value = []
    saveWishlist()
  }

  function saveWishlist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kigali-wishlist', JSON.stringify(items.value))
    }
  }

  return {
    items,
    isInWishlist,
    wishlistCount,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist
  }
})

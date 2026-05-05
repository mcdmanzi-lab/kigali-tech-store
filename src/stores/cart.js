import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // Load cart from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kigali-cart')
    if (saved) {
      items.value = JSON.parse(saved)
    }
  }

  // Getters
  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  const TAX_RATE = 0.18 // 18% VAT
  const SHIPPING = 5000 // RWF flat rate

  const subtotal = computed(() => cartTotal.value)

  const tax = computed(() => Math.round(cartTotal.value * TAX_RATE))

  const total = computed(() => subtotal.value + tax.value + SHIPPING)

  // Actions
  function addToCart(product) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({
        ...product,
        quantity: 1
      })
    }
    saveCart()
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
    saveCart()
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  function saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kigali-cart', JSON.stringify(items.value))
    }
  }

  return {
    items,
    cartTotal,
    cartCount,
    subtotal,
    tax,
    total,
    SHIPPING,
    TAX_RATE,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  // Load auth from localStorage
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('kigali-token')
    const savedUser = localStorage.getItem('kigali-user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  function login(email, password) {
    // Mock authentication - in real app, would call API
    if (email && password.length >= 6) {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      }
      
      // Mock JWT token
      const mockToken = btoa(JSON.stringify(mockUser))
      
      token.value = mockToken
      user.value = mockUser
      
      saveAuth()
      return { success: true, user: mockUser }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  function register(email, password, name) {
    // Mock registration
    if (email && password.length >= 6 && name) {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        createdAt: new Date().toISOString()
      }
      
      const mockToken = btoa(JSON.stringify(mockUser))
      
      token.value = mockToken
      user.value = mockUser
      
      saveAuth()
      return { success: true, user: mockUser }
    }
    return { success: false, error: 'Invalid input' }
  }

  function logout() {
    token.value = null
    user.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kigali-token')
      localStorage.removeItem('kigali-user')
    }
  }

  function saveAuth() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kigali-token', token.value)
      localStorage.setItem('kigali-user', JSON.stringify(user.value))
    }
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      saveAuth()
      return { success: true }
    }
    return { success: false }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  }
})

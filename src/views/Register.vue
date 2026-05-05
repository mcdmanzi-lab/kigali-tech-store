<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, User, UserPlus } from 'lucide-vue-next'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  error.value = null

  const result = authStore.register(email.value, password.value, name.value)
  
  if (result.success) {
    router.push('/products')
  } else {
    error.value = result.error
  }

  loading.value = false
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    handleRegister()
  }
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

      <ErrorMessage v-if="error" :message="error" @dismiss="error = null" />

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div class="relative">
            <User class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              v-model="name"
              type="text"
              placeholder="John Doe"
              @keypress="handleKeyPress"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              @keypress="handleKeyPress"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              @keypress="handleKeyPress"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">Min 6 characters</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              @keypress="handleKeyPress"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent"
            />
          </div>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center space-x-2 mt-6"
        >
          <UserPlus class="w-5 h-5" />
          <span>{{ loading ? 'Creating Account...' : 'Sign Up' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <!-- Login Link -->
      <p class="text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-primary hover:text-primary-dark font-semibold">
          Login
        </router-link>
      </p>

      <!-- Terms -->
      <p class="text-xs text-gray-500 text-center mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
      </div>
    </div>
  </div>
</template>

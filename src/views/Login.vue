<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, LogIn } from 'lucide-vue-next'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = null

  const result = authStore.login(email.value, password.value)
  
  if (result.success) {
    // Redirect to checkout if coming from there, otherwise home
    const redirect = router.currentRoute.value.query.redirect || '/products'
    router.push(redirect)
  } else {
    error.value = result.error
  }

  loading.value = false
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <div class="bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Login</h1>

      <ErrorMessage v-if="error" :message="error" @dismiss="error = null" />

      <form @submit.prevent="handleLogin" class="space-y-4">
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
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary w-full flex items-center justify-center space-x-2 mt-6"
        >
          <LogIn class="w-5 h-5" />
          <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
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

      <!-- Register Link -->
      <p class="text-center text-gray-600">
        Don't have an account?
        <router-link to="/register" class="text-primary hover:text-primary-dark font-semibold">
          Sign up
        </router-link>
      </p>

      <!-- Demo Notice -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-xs text-blue-800">
          <strong>Demo Mode:</strong> Use any email and password (min 6 chars) to login.
        </p>
      </div>
      </div>
    </div>
  </div>
</template>

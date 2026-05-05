<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="text-center space-y-6">
      <div class="text-9xl font-bold text-gray-200">404</div>
      
      <h1 class="text-4xl font-bold text-gray-900">Page Not Found</h1>
      
      <p class="text-lg text-gray-600 max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button
          @click="() => router.back()"
          class="btn-outline flex items-center justify-center space-x-2"
        >
          <ChevronLeft class="w-5 h-5" />
          <span>Go Back</span>
        </button>
        
        <router-link to="/" class="btn-primary flex items-center justify-center space-x-2">
          <Home class="w-5 h-5" />
          <span>Go to Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

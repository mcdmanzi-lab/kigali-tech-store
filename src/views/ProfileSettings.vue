<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { Settings, Save, LogOut, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

const saved = ref(false)

function saveChanges() {
  authStore.updateProfile({
    name: formData.value.name,
    email: formData.value.email
  })
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

    <div class="max-w-2xl">
      <!-- Success Message -->
      <div v-if="saved" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
        ✓ Changes saved successfully!
      </div>

      <!-- Account Settings -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6 space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Settings class="w-6 h-6" />
          <span>Account Settings</span>
        </h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input v-model="formData.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="formData.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />
        </div>

        <button @click="saveChanges" class="btn-primary flex items-center space-x-2">
          <Save class="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <!-- Preferences -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6 space-y-6">
        <h2 class="text-lg font-bold text-gray-900">Preferences</h2>

        <div class="space-y-4">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 text-primary-DEFAULT rounded" />
            <span class="text-gray-700">Receive email notifications for orders</span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 text-primary-DEFAULT rounded" />
            <span class="text-gray-700">Subscribe to product updates and promotions</span>
          </label>

          <label class="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" class="w-4 h-4 text-primary-DEFAULT rounded" />
            <span class="text-gray-700">Two-factor authentication</span>
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-8">
        <h2 class="text-lg font-bold text-red-900 flex items-center space-x-2 mb-4">
          <AlertCircle class="w-6 h-6" />
          <span>Danger Zone</span>
        </h2>

        <p class="text-red-800 mb-4">Logging out will clear your session and return you to the home page.</p>

        <button @click="logout" class="btn-outline text-kigali-red border-kigali-red hover:bg-red-50 flex items-center space-x-2">
          <LogOut class="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { User, Mail, Phone, MapPin } from 'lucide-vue-next'
import { computed } from 'vue'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const user = computed(() => authStore.user)
const totalOrders = computed(() => ordersStore.orders.length)
const totalSpent = computed(() => {
  return ordersStore.orders.reduce((sum, order) => sum + (order.total || 0), 0)
})
</script>

<template>
  <div v-if="user" class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>

    <!-- Profile Card -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="flex items-start space-x-6">
          <div class="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <User class="w-10 h-10 text-white" />
        </div>
        <div class="flex-grow">
          <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
          <p class="text-gray-600">Member since {{ new Date(user.createdAt).toLocaleDateString() }}</p>
        </div>
        <router-link to="/profile/settings" class="btn-outline">Edit Profile</router-link>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600 text-sm mb-2">Total Orders</p>
        <p class="text-3xl font-bold text-primary-DEFAULT">{{ totalOrders }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600 text-sm mb-2">Total Spent</p>
        <p class="text-3xl font-bold text-primary-DEFAULT">RWF {{ Math.round(totalSpent * 1200).toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600 text-sm mb-2">Member Status</p>
        <p class="text-3xl font-bold text-secondary">Gold</p>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <h3 class="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <Mail class="w-5 h-5 text-primary-DEFAULT" />
          <span class="text-gray-700">{{ user.email }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link to="/profile/orders" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <p class="text-sm text-gray-600 mb-2">View Orders</p>
        <p class="text-xl font-bold text-gray-900">Order History →</p>
      </router-link>
      <router-link to="/products" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <p class="text-sm text-gray-600 mb-2">Continue Shopping</p>
        <p class="text-xl font-bold text-gray-900">Browse Products →</p>
      </router-link>
    </div>
  </div>
</template>

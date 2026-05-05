<script setup lang="ts">
import { useOrdersStore } from '../stores/orders'
import { computed } from 'vue'
import { Calendar, DollarSign, Truck } from 'lucide-vue-next'

const ordersStore = useOrdersStore()

const orders = computed(() => [...ordersStore.orders].reverse())
const isEmpty = computed(() => orders.value.length === 0)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

    <div v-if="isEmpty" class="bg-gray-50 rounded-lg p-12 text-center">
      <Truck class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
      <p class="text-gray-600 mb-6">Start shopping to see your orders here</p>
      <router-link to="/products" class="btn-primary">Shop Now</router-link>
    </div>

    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- Order ID & Date -->
          <div>
            <p class="text-xs text-gray-500 uppercase">Order ID</p>
            <p class="font-mono text-sm font-semibold">{{ order.id }}</p>
            <div class="flex items-center space-x-1 text-gray-600 text-sm mt-2">
              <Calendar class="w-4 h-4" />
              <span>{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>

          <!-- Items Count -->
          <div>
            <p class="text-xs text-gray-500 uppercase">Items</p>
            <p class="text-lg font-bold text-gray-900">{{ order.items.length }}</p>
          </div>

          <!-- Total -->
          <div>
            <p class="text-xs text-gray-500 uppercase">Total</p>
            <div class="flex items-center space-x-1">
              <DollarSign class="w-4 h-4 text-primary" />
              <p class="text-lg font-bold text-gray-900">RWF {{ Math.round(order.total * 1200).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Status -->
          <div>
            <p class="text-xs text-gray-500 uppercase">Status</p>
            <p :class="['px-3 py-1 rounded-full text-sm font-semibold w-fit', order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
              {{ order.status }}
            </p>
          </div>
        </div>

        <!-- Items -->
        <div class="border-t pt-4">
          <p class="text-sm font-semibold text-gray-900 mb-3">Items Ordered:</p>
          <ul class="space-y-2">
            <li v-for="item in order.items" :key="item.id" class="text-sm text-gray-700">
              • {{ item.title.substring(0, 50) }}... x{{ item.quantity }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

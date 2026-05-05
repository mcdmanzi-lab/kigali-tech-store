<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'
import { useCartStore } from '../stores/cart'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

const totalProducts = computed(() => productsStore.products.length)
const totalOrders = computed(() => ordersStore.orders.length)
const cartItems = computed(() => cartStore.cartCount)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Products</p>
        <p class="text-2xl font-bold">{{ totalProducts }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Orders</p>
        <p class="text-2xl font-bold">{{ totalOrders }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-500">Cart Items</p>
        <p class="text-2xl font-bold">{{ cartItems }}</p>
      </div>
    </div>

    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Orders</h2>
      <div v-if="totalOrders === 0" class="text-gray-600">No orders yet</div>
      <ul v-else class="space-y-3">
        <li v-for="order in ordersStore.orders.slice(-5).reverse()" :key="order.id" class="border rounded p-3">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-mono text-sm">{{ order.id }}</div>
              <div class="text-sm text-gray-600">{{ new Date(order.createdAt).toLocaleString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold">RWF {{ Math.round((order.total||0) * 1200).toLocaleString() }}</div>
              <div class="text-xs text-gray-500">{{ order.status }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>

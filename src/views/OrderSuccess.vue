<script setup lang="ts">
import { useOrdersStore } from '../stores/orders'
import { computed } from 'vue'
import { CheckCircle, Package, Calendar, MapPin, DollarSign, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})

const ordersStore = useOrdersStore()

const order = computed(() => ordersStore.getOrderById(props.orderId))

const formattedDate = computed(() => {
  if (order.value) {
    return new Date(order.value.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return ''
})
</script>

<template>
  <div>
    <div v-if="order" class="space-y-8">
      <!-- Success Header -->
      <div class="text-center space-y-4">
        <div class="flex justify-center">
          <CheckCircle class="w-20 h-20 text-green-500" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p class="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <!-- Order Details Card -->
      <div class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b">
          <!-- Order ID -->
          <div>
            <p class="text-xs text-gray-500 uppercase mb-1">Order Number</p>
            <p class="font-mono font-bold text-gray-900">{{ order.id }}</p>
          </div>

          <!-- Date -->
          <div>
            <p class="text-xs text-gray-500 uppercase mb-1">Order Date</p>
            <div class="flex items-center space-x-1 font-bold text-gray-900">
              <Calendar class="w-4 h-4" />
              <span>{{ formattedDate }}</span>
            </div>
          </div>

          <!-- Status -->
          <div>
            <p class="text-xs text-gray-500 uppercase mb-1">Status</p>
            <p class="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full w-fit">
              {{ order.status }}
            </p>
          </div>

          <!-- Total -->
          <div>
            <p class="text-xs text-gray-500 uppercase mb-1">Total</p>
            <p class="font-bold text-primary text-lg">RWF {{ Math.round(order.total * 1200).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div>
          <h3 class="font-bold text-gray-900 mb-3">Shipping Address</h3>
          <div class="flex items-start space-x-3 text-gray-700">
            <MapPin class="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p>{{ order.customer.name }}</p>
              <p>{{ order.customer.address }}</p>
              <p>{{ order.customer.city }}</p>
              <p>{{ order.customer.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div>
          <h3 class="font-bold text-gray-900 mb-3">Items Ordered ({{ order.items.length }})</h3>
          <div class="space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex justify-between text-gray-700">
              <div>
                <p>{{ item.title.substring(0, 50) }}...</p>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <span>RWF {{ Math.round(item.price * item.quantity * 1200).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="border-t pt-6 space-y-2">
          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>RWF {{ Math.round(order.subtotal * 1200).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>RWF {{ Math.round(order.tax * 1200).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>RWF {{ order.shipping.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
            <span>Total</span>
            <span>RWF {{ Math.round(order.total * 1200).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
        <h3 class="font-bold text-blue-900">What's Next?</h3>
        <ul class="space-y-2 text-blue-800 text-sm">
          <li>✓ A confirmation email has been sent to {{ order.customer.email }}</li>
          <li>✓ Track your order in your <router-link to="/profile/orders" class="font-bold hover:underline">order history</router-link></li>
          <li>✓ Your package will be delivered within 2-3 business days</li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link to="/profile/orders" class="btn-outline flex items-center justify-center space-x-2">
          <Package class="w-5 h-5" />
          <span>View All Orders</span>
        </router-link>
        <router-link to="/products" class="btn-primary flex items-center justify-center space-x-2">
          <span>Continue Shopping</span>
          <ChevronRight class="w-5 h-5" />
        </router-link>
      </div>
    </div>

    <!-- Order Not Found -->
    <div v-else class="text-center py-12">
      <div class="text-5xl mb-4">❌</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
      <p class="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
      <router-link to="/products" class="btn-primary">Back to Shopping</router-link>
    </div>
  </div>
</template>

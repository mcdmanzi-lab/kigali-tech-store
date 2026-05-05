import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  // Load orders from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kigali-orders')
    if (saved) {
      orders.value = JSON.parse(saved)
    }
  }

  function createOrder(orderData) {
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    
    orders.value.push(order)
    saveOrders()
    return order
  }

  function updateOrderStatus(orderId, status) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      saveOrders()
    }
  }

  function completeOrder(orderId, paymentId) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'completed'
      order.paymentId = paymentId
      order.completedAt = new Date().toISOString()
      saveOrders()
      return order
    }
  }

  function getOrderById(orderId) {
    return orders.value.find(o => o.id === orderId)
  }

  function saveOrders() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kigali-orders', JSON.stringify(orders.value))
    }
  }

  return {
    orders,
    createOrder,
    updateOrderStatus,
    completeOrder,
    getOrderById
  }
})

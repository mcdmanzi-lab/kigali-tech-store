<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { MapPin, CreditCard, ShoppingBag, ChevronLeft } from 'lucide-vue-next'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const step = ref(1) // 1: Address, 2: Payment, 3: Review
const loading = ref(false)
const error = ref<string | null>(null)
const paymentReady = ref(false)
const stripeInitializing = ref(false)
const cardComplete = ref(false)


// Stripe Elements
import { loadStripe } from '@stripe/stripe-js'
const stripeKey = import.meta.env.VITE_STRIPE_PK === 'pk_test_51TRdLLFE5wDnFzKJxz5wF1NFXWTr5jLry52yGgD5Gmg8eb6Rcq5332xpBOVrIF1Y10mnK0Iu3B5pEu27gb6jH62p00PMjhhv81' 
  ? 'pk_test_51TRSonIEP3FIahdKjjOm4rSJ5eDQuzzVJVKQTRkH6PRXgRuFUWZbC0IRotFsclkC0s3BPfgAOn53dK3pdHaecUtt001eUXnMr6' 
  : (import.meta.env.VITE_STRIPE_PK || 'pk_test_51TRSonIEP3FIahdKjjOm4rSJ5eDQuzzVJVKQTRkH6PRXgRuFUWZbC0IRotFsclkC0s3BPfgAOn53dK3pdHaecUtt001eUXnMr6')
let stripe: any = null
let elements: any = null
let card: any = null
const cardElement = ref<HTMLElement | null>(null)

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: 'Kigali',
  province: '',
  postalCode: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCVC: ''
})

// Cart totals
const subtotal = computed(() => cartStore.subtotal)
const tax = computed(() => cartStore.tax)
const shipping = computed(() => cartStore.SHIPPING)
const total = computed(() => cartStore.total)
const cartItems = computed(() => cartStore.items)

function formatCardNumber(value: string) {
  return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

function formatExpiry(value: string) {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5)
}

function validateStep1() {
  if (!formData.value.firstName || !formData.value.lastName || !formData.value.email) {
    error.value = 'Please fill in all required fields'
    return false
  }
  if (!formData.value.address || !formData.value.city) {
    error.value = 'Please fill in address details'
    return false
  }
  return true
}

function validateStep2() {
  if (!formData.value.cardName) {
    error.value = 'Please enter the cardholder name'
    return false
  }
  if (!card || !paymentReady.value) {
    error.value = 'Payment form is not ready. Please wait a moment.'
    return false
  }
  if (!cardComplete.value) {
    error.value = 'Please complete your card details (Number, Expiry, and CVC)'
    return false
  }
  return true
}


async function nextStep() {
  error.value = null

  if (step.value === 1 && validateStep1()) {
    step.value = 2
    await initializeStripe()
  } else if (step.value === 2 && validateStep2()) {
    step.value = 3
  }
}

async function initializeStripe() {
  console.log('Initializing Stripe on step 2...')
  paymentReady.value = false
  stripeInitializing.value = true

  if (!stripeKey) {
    error.value = 'Stripe not configured'
    stripeInitializing.value = false
    return
  }

  try {
    if (!stripe) {
      stripe = await loadStripe(stripeKey)
      console.log('Stripe library loaded')
    }

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    const cardElementContainer = cardElement.value || document.getElementById('card-element')
    console.log('Card element container found:', !!cardElementContainer)

    if (cardElementContainer) {
      if (!card) {
        elements = stripe.elements()
        card = elements.create('card', {
          hidePostalCode: true,
          style: {

            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#9e2146' }
          }
        })
        
        card.on('change', (event: any) => {
          cardComplete.value = event.complete
          if (event.error) {
            error.value = event.error.message
          } else {
            error.value = null
          }
        })

      }
      
      card.mount(cardElementContainer)
      console.log('Card mounted successfully')
      paymentReady.value = true
    } else {
      console.error('Card element container not found after DOM update')
      error.value = 'Payment form not ready. Please reload the page.'
    }
  } catch (err) {
    console.error('Stripe init error:', err)
    error.value = 'Failed to load payment form'
  } finally {
    stripeInitializing.value = false
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value -= 1
  }
}

async function completeOrder() {
  loading.value = true
  error.value = null

  try {
    // Create PaymentIntent on the server and confirm with Stripe Elements
    if (!stripe || !card) {
      throw new Error('Payment system not initialized. Please refresh the page and try again.')
    }

    console.log('Starting payment process...')
    console.log('Payment amount:', Math.round(total.value * 100), 'cents')
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242'
    
    // Create PaymentIntent on backend
    let resp
    try {
      resp = await fetch(`${apiUrl}/create-payment-intent`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Math.round(total.value * 100), 
          currency: 'usd' 
        }),
      })
    } catch (fetchErr) {
      throw new Error('Cannot connect to payment server. Make sure the backend server is running on port 4242.')
    }
    
    if (!resp.ok) {
      let errorMsg = 'Failed to create payment intent'
      try {
        const errorData = await resp.json()
        errorMsg = errorData.error || errorMsg
      } catch (e) {
        errorMsg = `Server error (${resp.status}): ${resp.statusText}`
      }
      throw new Error(errorMsg)
    }
    
    const intent = await resp.json()
    console.log('✓ PaymentIntent created:', intent.clientSecret?.substring(0, 20) + '...')
    
    const clientSecret = intent.clientSecret
    if (!clientSecret) {
      throw new Error('No client secret received from server')
    }

    // Confirm payment with Stripe using the card element
    console.log('Confirming payment with Stripe...')
    const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: `${formData.value.firstName} ${formData.value.lastName}`,
          email: formData.value.email,
          address: {
            line1: formData.value.address,
            city: formData.value.city,
            postal_code: formData.value.postalCode,
          }
        },
      },
    })

    if (stripeError) {
      console.error('❌ Stripe error:', stripeError)
      throw new Error(stripeError.message || 'Payment failed. Please check your card details and try again.')
    }

    console.log('✓ Payment confirmed. Status:', paymentIntent.status)

    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      console.warn('Payment status:', paymentIntent?.status)
      throw new Error(`Payment was not completed. Status: ${paymentIntent?.status || 'unknown'}`)
    }
    
    console.log('✓ Payment succeeded!')

    // Create order
    const order = ordersStore.createOrder({
      customer: {
        name: `${formData.value.firstName} ${formData.value.lastName}`,
        email: formData.value.email,
        phone: formData.value.phone,
        address: formData.value.address,
        city: formData.value.city,
      },
      items: cartItems.value,
      subtotal: subtotal.value,
      tax: tax.value,
      shipping: shipping.value,
      total: total.value,
      paymentMethod: 'card',
      cardLast4: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || null,
      paymentToken: paymentIntent.id,
    })

    ordersStore.completeOrder(order.id, paymentIntent.id)
    cartStore.clearCart()
    console.log('Order completed successfully:', order.id)
    router.push(`/order-success/${order.id}`)
  } catch (err) {
    console.error('Payment error:', err)
    error.value = err.message || 'Failed to process payment. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  console.log('Checkout component mounted')
  // Initialize Stripe library early, but don't mount card element yet
  if (stripeKey) {
    try {
      stripe = await loadStripe(stripeKey)
      console.log('Stripe library loaded')
    } catch (err) {
      console.error('Failed to load Stripe:', err)
    }
  }
})

onBeforeUnmount(() => {
  if (card) {
    card.unmount()
    card = null
  }
})
</script>

<template>
  <div>
    <button @click="() => router.back()" class="flex items-center space-x-2 text-primary hover:text-primary-dark mb-6">
      <ChevronLeft class="w-5 h-5" />
      <span>Back</span>
    </button>

    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <!-- Step Indicator -->
    <div class="flex justify-between mb-8 text-sm sm:text-base">
      <div :class="['flex items-center', step >= 1 ? 'text-primary' : 'text-gray-300']">
        <MapPin class="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
        <span class="hidden sm:inline">Shipping</span>
      </div>
      <div :class="['flex items-center', step >= 2 ? 'text-primary' : 'text-gray-300']">
        <CreditCard class="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
        <span class="hidden sm:inline">Payment</span>
      </div>
      <div :class="['flex items-center', step >= 3 ? 'text-primary' : 'text-gray-300']">
        <ShoppingBag class="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
        <span class="hidden sm:inline">Review</span>
      </div>
    </div>

    <!-- Error Message -->
    <ErrorMessage v-if="error" :message="error" @dismiss="error = null" class="mb-6" />

    <!-- Step 1: Shipping Address -->
    <div v-show="step === 1" class="bg-white rounded-lg shadow-md p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Shipping Address</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="formData.firstName" type="text" placeholder="First Name" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
        <input v-model="formData.lastName" type="text" placeholder="Last Name" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>

      <input v-model="formData.email" type="email" placeholder="Email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
      <input v-model="formData.phone" type="tel" placeholder="Phone Number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />
      <input v-model="formData.address" type="text" placeholder="Street Address" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="formData.city" type="text" placeholder="City" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />
        <input v-model="formData.postalCode" type="text" placeholder="Postal Code" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mt-8">
        <button @click="router.push('/cart')" class="btn-outline w-full sm:flex-1">Back to Cart</button>
        <button @click="nextStep" class="btn-primary w-full sm:flex-1">Continue to Payment</button>
      </div>
    </div>

    <!-- Step 2: Payment Information -->
    <div v-show="step === 2" class="bg-white rounded-lg shadow-md p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Payment Information</h2>

      <input v-model="formData.cardName" type="text" placeholder="Cardholder Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent" />

      <div class="w-full">
        <div ref="cardElement" id="card-element" class="px-4 py-2 border border-gray-300 rounded-lg min-h-[56px]"></div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
        <strong>Demo Mode:</strong> Use test card 4242 4242 4242 4242, any future expiry, and any CVC.
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mt-8">
        <button @click="prevStep" class="btn-outline w-full sm:flex-1">Back</button>
        <button @click="nextStep" :disabled="stripeInitializing || !paymentReady" class="btn-primary w-full sm:flex-1">
          {{ stripeInitializing ? 'Loading payment form...' : 'Review Order' }}
        </button>
      </div>
    </div>

    <!-- Step 3: Review Order -->
    <div v-show="step === 3" class="bg-white rounded-lg shadow-md p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Review Your Order</h2>

      <div class="space-y-3 border-b pb-6">
        <h3 class="font-semibold text-gray-900">Shipping To:</h3>
        <p class="text-gray-700">
          {{ formData.firstName }} {{ formData.lastName }}<br />
          {{ formData.address }}<br />
          {{ formData.city }}, {{ formData.postalCode }}
        </p>
      </div>

      <div class="space-y-3 border-b pb-6">
        <h3 class="font-semibold text-gray-900">Items ({{ cartItems.length }})</h3>
        <div v-for="item in cartItems" :key="item.id" class="flex justify-between text-gray-700">
          <span>{{ item.title.substring(0, 40) }}... x{{ item.quantity }}</span>
          <span>RWF {{ Math.round(item.price * item.quantity * 1200).toLocaleString() }}</span>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>RWF {{ Math.round(subtotal * 1200).toLocaleString() }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span>RWF {{ Math.round(tax * 1200).toLocaleString() }}</span>
        </div>
        <div class="flex justify-between">
          <span>Shipping</span>
          <span>RWF {{ shipping.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-xl font-bold border-t pt-2">
          <span>Total</span>
          <span>RWF {{ Math.round(total * 1200).toLocaleString() }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 mt-8">
        <button @click="prevStep" class="btn-outline w-full sm:flex-1">Back</button>
        <button @click="completeOrder" :disabled="loading" class="btn-primary w-full sm:flex-1">
          {{ loading ? 'Processing...' : 'Complete Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

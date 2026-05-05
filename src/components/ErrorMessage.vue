<template>
  <transition name="slide-down">
    <div v-if="isVisible" class="alert alert-error animate-slide-up flex items-start space-x-3">
      <AlertCircle class="w-5 h-5 text-kigali-red flex-shrink-0 mt-0.5" />
      <p class="text-sm font-medium flex-grow">{{ message }}</p>
      <button
        v-if="dismissible"
        @click="dismiss"
        class="text-kigali-red hover:text-kigali-red-dark hover:bg-kigali-red-light rounded-full p-1 transition-all ml-2"
        aria-label="Dismiss alert"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { AlertCircle, X } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['dismiss'])
const isVisible = ref(true)

function dismiss() {
  isVisible.value = false
  emit('dismiss')
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

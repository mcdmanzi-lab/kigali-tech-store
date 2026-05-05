<template>
  <div class="flex items-center justify-center py-16">
    <div class="space-y-4 text-center">
      <div class="relative w-16 h-16 mx-auto">
        <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
        <div class="absolute inset-2 border-4 border-transparent border-b-secondary rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 2s;"></div>
      </div>
      <p class="text-gray-500 font-medium text-sm">Loading...</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1.5s linear infinite;
}
</style>

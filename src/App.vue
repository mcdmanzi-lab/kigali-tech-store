<template>
  <div id="app" class="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
#app {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}
</style>

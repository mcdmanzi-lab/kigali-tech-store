<template>
  <footer class="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 border-t border-gray-800 mt-16 md:mt-20">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <!-- Company Info -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-md">
              <span class="text-lg font-bold text-white">KT</span>
            </div>
            <div>
              <p class="text-lg font-bold text-white">Kigali Tech</p>
              <p class="text-xs text-gray-500">Store</p>
            </div>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed">
            Your trusted online destination for affordable tech and electronics in Kigali, Rwanda. Discover quality products with fast delivery and secure payment.
          </p>
          <!-- Social Media -->
          <div class="flex items-center space-x-4 pt-2">
            <a href="#" class="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-all">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-all">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-all">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-all">
              <Linkedin class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Quick Links</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/" class="hover:text-primary transition-colors">Home</router-link></li>
            <li><router-link to="/products" class="hover:text-primary transition-colors">Products</router-link></li>
            <li><router-link to="/cart" class="hover:text-primary transition-colors">Cart</router-link></li>
            <li><router-link to="/wishlist" class="hover:text-primary transition-colors">Wishlist</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold text-white mb-4">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-primary transition-colors">Contact Us</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Shipping Info</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Returns Policy</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="font-semibold text-white mb-4">Get in Touch</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center space-x-3 hover:text-primary transition-colors">
              <Phone class="w-4 h-4 flex-shrink-0 text-primary" />
              <span>+250 (0) 123 456 789</span>
            </div>
            <div class="flex items-center space-x-3 hover:text-primary transition-colors">
              <Mail class="w-4 h-4 flex-shrink-0 text-primary" />
              <span>info@kigalitech.com</span>
            </div>
            <div class="flex items-start space-x-3 hover:text-primary transition-colors">
              <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-500">
            &copy; 2026 Kigali Tech Store. All rights reserved. | <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a> | <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
          </p>

          <!-- Payment Methods -->
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <span>Secured by:</span>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-1 bg-gray-800 rounded text-gray-400">Stripe</span>
              <span class="px-2 py-1 bg-gray-800 rounded text-gray-400">SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-vue-next'

const router = useRouter()
</script>

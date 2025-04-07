<script setup>
import Navbar from './navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="container mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Blog de Noticias</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Artículo 1 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="h-48 bg-blue-100 flex items-center justify-center">
            <i class="fas fa-globe text-5xl text-blue-500"></i>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Expansión de servicios a nuevos países
            </h2>
            <p class="text-gray-600 mb-4">
              ENVIOS KIAN amplía su cobertura global con nuevas rutas internacionales que permitirán envíos más rápidos y económicos.
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">12 de abril, 2023</span>
              <button class="text-blue-600 hover:text-blue-800">Leer más</button>
            </div>
          </div>
        </div>
        
        <!-- Artículo 2 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="h-48 bg-green-100 flex items-center justify-center">
            <i class="fas fa-leaf text-5xl text-green-500"></i>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Iniciativas sustentables en nuestros envíos
            </h2>
            <p class="text-gray-600 mb-4">
              Conoce las nuevas políticas eco-amigables que estamos implementando para reducir nuestra huella de carbono.
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">5 de abril, 2023</span>
              <button class="text-blue-600 hover:text-blue-800">Leer más</button>
            </div>
          </div>
        </div>
        
        <!-- Artículo 3 -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="h-48 bg-purple-100 flex items-center justify-center">
            <i class="fas fa-mobile-alt text-5xl text-purple-500"></i>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Nueva aplicación móvil
            </h2>
            <p class="text-gray-600 mb-4">
              Lanzamos nuestra aplicación móvil que te permitirá gestionar tus envíos desde cualquier lugar y en cualquier momento.
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">28 de marzo, 2023</span>
              <button class="text-blue-600 hover:text-blue-800">Leer más</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 
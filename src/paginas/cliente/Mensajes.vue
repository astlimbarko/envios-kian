<script setup>
import Navbar from './navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="container mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Mensajes Informativos</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Comunicados importantes</h2>
        
        <div class="space-y-6">
          <div class="border-l-4 border-blue-500 pl-4 py-2 mb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-1">Actualización de tarifas</h3>
            <p class="text-gray-600 mb-2">
              Informamos a nuestros clientes que a partir del 1 de mayo entrarán en vigor nuevas tarifas para envíos internacionales.
            </p>
            <span class="text-sm text-gray-500">Publicado: 15/04/2023</span>
          </div>
          
          <div class="border-l-4 border-green-500 pl-4 py-2 mb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-1">Nuevas rutas disponibles</h3>
            <p class="text-gray-600 mb-2">
              Hemos ampliado nuestra cobertura a más destinos. Ahora ofrecemos envíos a toda Centroamérica con tiempos de entrega reducidos.
            </p>
            <span class="text-sm text-gray-500">Publicado: 02/04/2023</span>
          </div>
          
          <div class="border-l-4 border-yellow-500 pl-4 py-2 mb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-1">Mantenimiento programado</h3>
            <p class="text-gray-600 mb-2">
              El próximo domingo realizaremos labores de mantenimiento en nuestros sistemas. El servicio de seguimiento podría presentar intermitencias entre las 2:00 y 5:00 AM.
            </p>
            <span class="text-sm text-gray-500">Publicado: 28/03/2023</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 
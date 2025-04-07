<script setup>
import Navbar from './navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="container mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Preguntas Frecuentes</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Información útil sobre nuestros servicios</h2>
        
        <div class="space-y-6">
          <div class="border-b pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">¿Cómo puedo rastrear mi paquete?</h3>
            <p class="text-gray-600">
              Puedes rastrear tu paquete desde la sección de "Seguimiento" ingresando el número de guía que te proporcionamos.
            </p>
          </div>
          
          <div class="border-b pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">¿Cuánto tiempo tarda un envío?</h3>
            <p class="text-gray-600">
              Los tiempos de entrega varían según el destino y el tipo de servicio seleccionado. Generalmente, los envíos locales tardan de 1 a 2 días hábiles, mientras que los nacionales pueden tomar de 2 a 5 días hábiles.
            </p>
          </div>
          
          <div class="border-b pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">¿Qué hago si mi paquete se retrasa?</h3>
            <p class="text-gray-600">
              Si tu paquete se retrasa, puedes contactar a nuestro servicio de atención al cliente para obtener información actualizada sobre el estado de tu envío.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 
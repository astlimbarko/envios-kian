<script setup>
import { ref } from 'vue'
import Navbar from './navbar.vue'

const faqs = ref([
  {
    pregunta: '¿Cómo puedo rastrear mi paquete?',
    respuesta: 'Puedes rastrear tu paquete desde la sección de "Seguimiento" ingresando el número de guía que te proporcionamos.',
    abierto: false
  },
  {
    pregunta: '¿Cuánto tiempo tarda un envío?',
    respuesta: 'Los tiempos de entrega varían según el destino y el tipo de servicio seleccionado. Generalmente, los envíos locales tardan de 1 a 2 días hábiles, mientras que los nacionales pueden tomar de 2 a 5 días hábiles.',
    abierto: false
  },
  {
    pregunta: '¿Qué hago si mi paquete se retrasa?',
    respuesta: 'Si tu paquete se retrasa, puedes contactar a nuestro servicio de atención al cliente para obtener información actualizada sobre el estado de tu envío.',
    abierto: false
  },
  {
    pregunta: '¿Cuáles son los métodos de pago aceptados?',
    respuesta: 'Aceptamos pagos con tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo en nuestras sucursales.',
    abierto: false
  },
  {
    pregunta: '¿Cómo puedo programar una recolección?',
    respuesta: 'Puedes programar una recolección desde tu cuenta en la sección "Nuevo Envío" o contactando a nuestro servicio al cliente.',
    abierto: false
  },
  {
    pregunta: '¿Qué documentos necesito para enviar un paquete?',
    respuesta: 'Necesitarás un documento de identidad válido y la dirección completa del destinatario. Para envíos internacionales, podrían requerirse documentos adicionales.',
    abierto: false
  }
])

const toggleFAQ = (index) => {
  faqs.value[index].abierto = !faqs.value[index].abierto
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <Navbar />
    
    <main class="container mx-auto px-4 py-6 max-w-4xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Preguntas Frecuentes</h1>
        <p class="text-gray-600 dark:text-gray-300">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios</p>
      </div>
      
      <div class="space-y-3">
  <div v-for="(faq, index) in faqs" 
       :key="index"
       class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"
       :class="{ 'ring-2 ring-blue-500 dark:ring-blue-400': faq.abierto }">
       
    <button 
      @click="toggleFAQ(index)"
      class="group w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      
      <span class="font-medium text-gray-900 dark:text-gray-900 group-hover:dark:text-white">
        {{ faq.pregunta }}
      </span>
      
      <i class="fas" 
         :class="faq.abierto ? 'fa-chevron-up text-blue-500 dark:text-blue-400' : 'fa-chevron-down text-gray-400 dark:text-gray-400'"></i>
    </button>
    
    <div v-show="faq.abierto"
         class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
      <p class="text-gray-600 dark:text-gray-200 leading-relaxed">{{ faq.respuesta }}</p>
    </div>
  </div>
</div>


      <!-- Sección de contacto -->
      <div class="mt-8 text-center">
        <p class="text-gray-600 dark:text-gray-300 mb-4">¿No encuentras la respuesta que buscas?</p>
        <router-link 
          to="/cliente/soporte"
          class="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg transition-colors">
          <i class="fas fa-headset mr-2"></i>
          Contactar Soporte
        </router-link>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Animaciones para el acordeón */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 
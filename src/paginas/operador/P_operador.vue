/**
 * Componente: P_operador.vue
 * 
 * Este es el componente principal del módulo operador.
 * Sirve como layout para todas las páginas del módulo operador.
 * 
 * NOTA: Este es un componente temporal para desarrollo.
 */

<script setup>
import { ref } from 'vue'

// Estado del módulo
const mensaje = ref('Módulo Operador en desarrollo')
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <i class="fas fa-headset text-3xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ mensaje }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Este módulo permitirá gestionar remesas, usuarios y soporte en tiempo real.
        </p>
      </div>
    </div>
  </div>
</template>

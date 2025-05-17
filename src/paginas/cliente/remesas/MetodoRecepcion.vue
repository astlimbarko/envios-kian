<script setup>
import { ref } from 'vue'

const emit = defineEmits(['seleccionado'])

const metodoSeleccionado = ref(null)

const seleccionarMetodo = (metodo) => {
  metodoSeleccionado.value = metodo
  emit('seleccionado', metodo)

  // Asegurar que el siguiente paso se muestre en la parte superior
  setTimeout(() => {
    const siguientePaso = document.getElementById('paso-3')
    if (siguientePaso) {
      const headerOffset = 20
      const elementPosition = siguientePaso.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Agregar efecto de resaltado
      siguientePaso.classList.add('paso-activo')
      setTimeout(() => {
        siguientePaso.classList.remove('paso-activo')
      }, 2000)
    }
  }, 100)
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-200 dark:border-gray-700">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Método de recepción</h2>
      <p class="text-gray-600 dark:text-gray-300">Selecciona cómo deseas recibir el dinero</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Opción QR -->
      <button 
        @click="seleccionarMetodo('qr')"
        class="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
        :class="[
          metodoSeleccionado === 'qr' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        ]"
      >
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v4m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Código QR</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
            Recibe el dinero escaneando un código QR en cualquier agencia
          </p>
        </div>
      </button>

      <!-- Opción Cuenta Bancaria -->
      <button 
        @click="seleccionarMetodo('cuenta')"
        class="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
        :class="[
          metodoSeleccionado === 'cuenta' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        ]"
      >
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cuenta Bancaria</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
            Recibe el dinero directamente en tu cuenta bancaria
          </p>
        </div>
      </button>
    </div>
  </div>
</template> 
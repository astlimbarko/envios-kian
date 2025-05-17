<script setup>
import { ref } from 'vue'

const props = defineProps({
  metodos: {
    type: Array,
    default: () => [
      { nombre: 'Swish', valor: 'swish', icono: 'fas fa-mobile-alt' },
      { nombre: 'Transferencia Bancaria', valor: 'banco', icono: 'fas fa-university' }
    ]
  }
})

const emit = defineEmits(['seleccionado'])
const seleccionado = ref('')

const seleccionarMetodo = (metodo) => {
  seleccionado.value = metodo
  emit('seleccionado', metodo)

  // Asegurar que el siguiente paso se muestre en la parte superior
  setTimeout(() => {
    const siguientePaso = document.getElementById('paso-4')
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
  <div class="w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Método de pago</h2>
      <p class="text-gray-600 dark:text-gray-300">Selecciona cómo deseas realizar el pago</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <button 
        v-for="m in props.metodos" 
        :key="m.valor"
        @click="seleccionarMetodo(m.valor)"
        :class="[
          'flex flex-col items-center justify-center border-2 rounded-xl p-6 transition-all',
          seleccionado === m.valor 
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
          'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
        ]"
      >
        <div 
          class="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4"
          :class="{ 'bg-blue-100 dark:bg-blue-900/30': seleccionado === m.valor }"
        >
          <i :class="[m.icono, 'text-3xl text-blue-600 dark:text-blue-400']"></i>
        </div>
        <span class="font-semibold text-gray-900 dark:text-white text-lg mb-2">{{ m.nombre }}</span>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
          {{ m.valor === 'swish' ? 'Paga instantáneamente usando tu teléfono móvil' : 'Realiza una transferencia bancaria desde tu cuenta' }}
        </p>
      </button>
    </div>

    <!-- Información adicional -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-info-circle text-blue-500 dark:text-blue-400"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
            Información importante
          </h3>
          <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <p>
              {{ seleccionado === 'swish' 
                ? 'Asegúrate de tener la aplicación Swish instalada y configurada en tu teléfono.' 
                : 'Ten a mano los datos de tu cuenta bancaria para realizar la transferencia.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script setup>
import BotonGradiente from '../../components/BotonGradiente.vue'

const emit = defineEmits(['acceptTerms', 'closeTerms'])

const props = defineProps({
  showTermsModal: Boolean
})
</script>

<template>
  <!-- Modal de Términos y Condiciones -->
  <div v-if="showTermsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Condiciones de Envío</h3>
        <button @click="emit('closeTerms')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border-l-4 border-amber-500 dark:border-amber-600">
          <p class="font-medium mb-2 text-amber-800 dark:text-amber-300">Tiempos de procesamiento:</p>
          <ul class="pl-5 space-y-1 text-amber-700 dark:text-amber-200">
            <li>Envíos a QR: 10-20 minutos</li>
            <li>Depósitos bancarios: Hasta 6 Horas</li>
          </ul>
        </div>
        
        <p class="text-sm text-gray-600 dark:text-gray-400">Todos los envíos están sujetos a verificación del banco del beneficiario y pueden requerir documentación adicional en algunos casos.</p>
      </div>
      
      <div class="flex justify-end space-x-3 mt-5">
        <button 
          @click="emit('closeTerms')" 
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          Cancelar
        </button>
        <BotonGradiente 
          @click="emit('acceptTerms')" 
          texto="Aceptar y Continuar"
          tipo="primario"
          tamanio="md"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo elegante para Windows 11 */
.rounded-xl {
  border-radius: 12px;
}

button.rounded-md {
  border-radius: 6px;
}

/* Efecto suave en botones */
button {
  transition: all 0.15s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Backdrop blur estilo Windows 11 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Animación para mejorar la transición de los modales */
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.fixed.inset-0 > div {
  animation: modalFadeIn 0.2s ease-out forwards;
}

/* Mejora de accesibilidad para focus */
button:focus {
  outline: 2px solid rgba(37, 99, 235, 0.5);
  outline-offset: 2px;
}

/* Responsividad para dispositivos pequeños */
@media (max-width: 640px) {
  .fixed.inset-0 > div {
    margin: 0.5rem;
    width: calc(100% - 1rem);
    max-height: calc(100vh - 1rem);
    border-radius: 8px;
  }
  
  .space-x-3 > * {
    margin-left: 0.5rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
  
  /* Ajustar tamaño de texto en móvil */
  .text-xl {
    font-size: 1.1rem;
  }
}
</style> 
<script setup>
import { ref, watch } from 'vue'

// El componente ModalPasosEnvios es un contenedor base para modales de múltiples pasos
// que permite mostrar indicadores de progreso y mantiene la navegación entre pasos
const emit = defineEmits(['close', 'goBack', 'goForward', 'confirm'])

const props = defineProps({
  showModal: Boolean,
  title: String,
  currentStep: {
    type: Number,
    default: 1
  },
  showStepIndicator: {
    type: Boolean,
    default: false
  },
  maxStep: {
    type: Number,
    default: 3
  }
})

// Cerrar el modal
const closeModal = () => {
  emit('close')
}

// Ir al paso anterior
const goBack = () => {
  emit('goBack')
}

// Ir al paso siguiente
const goForward = () => {
  emit('goForward')
}

// Confirmar acción
const confirm = () => {
  emit('confirm')
}

// Calcular el progreso actual
const progress = ref(0)

watch(() => props.currentStep, (newStep) => {
  progress.value = (newStep / props.maxStep) * 100
}, { immediate: true })
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen text-center sm:block">
      <!-- Overlay de fondo -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full relative">
        <!-- Cabecera -->
        <div class="px-4 pt-4 pb-3 flex justify-between items-center border-b dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
            {{ title }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Indicador de Pasos -->
        <div v-if="showStepIndicator" class="px-4 pt-3">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div :class="[
                'w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm',
                currentStep >= 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              ]">
                1
              </div>
              <div :class="[
                'h-1 w-12 sm:w-24 mx-1',
                currentStep > 1 ? 'bg-blue-500 dark:bg-blue-700' : 'bg-gray-300 dark:bg-gray-600'
              ]"></div>
              <div :class="[
                'w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm',
                currentStep >= 2 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              ]">
                2
              </div>
              <div :class="[
                'h-1 w-12 sm:w-24 mx-1',
                currentStep > 2 ? 'bg-blue-500 dark:bg-blue-700' : 'bg-gray-300 dark:bg-gray-600'
              ]"></div>
              <div :class="[
                'w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm',
                currentStep >= 3 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              ]">
                3
              </div>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Paso {{ currentStep }} de {{ maxStep }}
            </div>
          </div>
        </div>
        
        <!-- Cuerpo del Modal -->
        <div class="px-4 py-3">
          <slot></slot>
        </div>
        
        <!-- Pie del Modal -->
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <slot name="footer">
            <div class="flex justify-between">
              <button 
                v-if="currentStep > 1"
                @click="goBack" 
                class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Atrás
              </button>
              <div v-else></div>
              
              <div class="flex space-x-2">
                <button 
                  @click="closeModal" 
                  class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                
                <button 
                  v-if="currentStep < maxStep"
                  @click="goForward" 
                  class="px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-md text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Siguiente
                </button>
                
                <button 
                  v-else
                  @click="confirm" 
                  class="px-4 py-2 bg-blue-600 dark:bg-blue-700 border border-transparent rounded-md text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </slot>
        </div>
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
  
  .p-5 {
    padding: 1rem;
  }
  
  /* Ajustar tamaño de texto en móvil */
  .text-xl {
    font-size: 1.1rem;
  }
  
  /* Añadir un efecto de zoom para el botón de cerrar */
  button i.fa-times {
    font-size: 1.2rem;
  }
}

/* Añadir algunas animaciones para mejorar la experiencia */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 
<script setup>
import BotonGradiente from '../../components/BotonGradiente.vue'

const emit = defineEmits(['close'])

const props = defineProps({
  showDetailModal: Boolean,
  remittance: {
    type: Object,
    default: () => ({
      id: '12345',
      date: '21/04/2023',
      recipient: 'María González',
      location: 'Bogotá, Colombia',
      amount: 850.00,
      currency: 'USD', 
      receivedAmount: 5865.00,
      receivedCurrency: 'BOB',
      status: 'Completada',
      statusClass: 'green',
      paymentMethod: 'Swish',
      receiveMethod: 'QR',
      trackingCode: 'REF-1234-5678-90'
    })
  }
})

// Función para copiar el código de seguimiento
const copyTrackingCode = () => {
  navigator.clipboard.writeText(props.remittance.trackingCode)
    .then(() => {
      alert('Código copiado al portapapeles')
    })
    .catch(err => {
      console.error('Error al copiar', err)
    })
}
</script>

<template>
  <!-- Modal de Detalles de Remesa -->
  <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-xl w-full mx-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Detalles de la Remesa</h3>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-6">
        <!-- Estado de la remesa -->
        <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div class="flex items-center">
            <div class="text-gray-700 dark:text-gray-300 mr-2">Estado:</div>
            <span :class="`px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-${remittance.statusClass}-100 dark:bg-${remittance.statusClass}-900 text-${remittance.statusClass}-800 dark:text-${remittance.statusClass}-100`">
              {{ remittance.status }}
            </span>
          </div>
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            {{ remittance.date }}
          </div>
        </div>
        
        <!-- Detalles del beneficiario -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Beneficiario</h4>
          <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <div class="font-medium text-gray-800 dark:text-gray-100">{{ remittance.recipient }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ remittance.location }}</div>
          </div>
        </div>
        
        <!-- Información de la transacción -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Información de la Transacción</h4>
          <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <div class="grid grid-cols-2 gap-x-2 gap-y-2">
              <div class="text-sm text-gray-600 dark:text-gray-400">Enviado:</div>
              <div class="text-sm text-right text-gray-800 dark:text-gray-100 font-medium">
                {{ remittance.amount.toFixed(2) }} {{ remittance.currency }}
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400">Recibido:</div>
              <div class="text-sm text-right text-gray-800 dark:text-gray-100 font-medium">
                {{ remittance.receivedAmount.toFixed(2) }} {{ remittance.receivedCurrency }}
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400">Método de pago:</div>
              <div class="text-sm text-right text-gray-800 dark:text-gray-100">
                {{ remittance.paymentMethod }}
              </div>
              
              <div class="text-sm text-gray-600 dark:text-gray-400">Método de recepción:</div>
              <div class="text-sm text-right text-gray-800 dark:text-gray-100">
                {{ remittance.receiveMethod }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Código de seguimiento -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Código de Seguimiento</h4>
          <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 flex justify-between items-center">
            <div class="font-mono text-sm text-gray-800 dark:text-gray-100">{{ remittance.trackingCode }}</div>
            <button 
              @click="copyTrackingCode" 
              class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              title="Copiar código"
            >
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Acciones del modal -->
      <div class="flex justify-end space-x-3 mt-6">
        <button 
          @click="emit('close')" 
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        >
          Cerrar
        </button>
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
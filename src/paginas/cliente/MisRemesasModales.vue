<script setup>
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['acceptTerms', 'closeTerms', 'goToSummary', 'goBack', 'close-remittance-modal', 'confirmSend'])

// Props para los estados de los modales
defineProps({
  showTermsModal: Boolean,
  showRemittanceModal: Boolean,
  showSummaryModal: Boolean,
  currentStep: Number,
  remittanceData: Object
})
</script>

<template>
  <!-- Modal de Términos y Condiciones (Simplificado) -->
  <div v-if="showTermsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Condiciones de Envío</h3>
        <button @click="emit('closeTerms')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p class="font-medium mb-2">Tiempos de procesamiento:</p>
          <ul class="pl-5 space-y-1">
            <li>Envíos a QR: 10-20 minutos</li>
            <li>Depósitos bancarios: Hasta 6 Horas</li>
          </ul>
        </div>
        
        <p class="text-sm text-gray-600 dark:text-gray-400">Todos los envíos están sujetos a verificación del banco del beneficiario y pueden requerir documentación adicional en algunos casos.</p>
        
        <p class="text-sm text-gray-600 dark:text-gray-400">Se aplicarán comisiones según el método de envío y el monto. El tipo de cambio se calcula al momento de confirmar la transacción.</p>
      </div>
      
      <div class="flex justify-end space-x-3 mt-5">
        <button 
          @click="emit('closeTerms')" 
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-md"
        >
          Cancelar
        </button>
        <button 
          @click="emit('acceptTerms')" 
          class="px-4 py-2 bg-[#146EBE] text-white rounded-md hover:bg-blue-700 shadow-md"
        >
          Aceptar y Continuar
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal de Nueva Remesa (2 Pasos) -->
  <div v-if="showRemittanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-0 max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <!-- Encabezado -->
      <div class="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <span class="mr-3 bg-[#146EBE] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
            {{ currentStep }}
          </span>
          {{ currentStep === 1 ? 'Nueva Remesa' : 'Resumen de la Transacción' }}
        </h3>
        <button @click="emit('close-remittance-modal')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Contenido -->
      <div class="overflow-y-auto p-5 flex-1 dark:text-gray-200">
        <!-- Paso 1: Datos de la remesa -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <!-- Selección de destinatario -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Datos del Destinatario</h4>
              
              <div class="flex items-center space-x-4 mb-4">
                <div>
                  <input 
                    id="saved_recipient" 
                    v-model="remittanceData.recipientType" 
                    value="saved" 
                    type="radio" 
                    class="text-[#146EBE]"
                  >
                  <label for="saved_recipient" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Beneficiario guardado</label>
                </div>
                <div>
                  <input 
                    id="new_recipient" 
                    v-model="remittanceData.recipientType" 
                    value="new" 
                    type="radio" 
                    class="text-[#146EBE]"
                  >
                  <label for="new_recipient" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Nuevo beneficiario</label>
                </div>
              </div>
              
              <!-- Seleccionar beneficiario existente -->
              <div v-if="remittanceData.recipientType === 'saved'" class="space-y-3">
                <select 
                  v-model="remittanceData.recipientId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
                >
                  <option value="">Seleccione un beneficiario</option>
                  <option value="1">María González - Bogotá, Colombia</option>
                  <option value="2">Juan Martínez - La Paz, Bolivia</option>
                  <option value="3">Carlos Ramírez - Santa Cruz, Bolivia</option>
                </select>
              </div>
              
              <!-- Nuevo beneficiario -->
              <div v-if="remittanceData.recipientType === 'new'" class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre completo</label>
                  <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">País</label>
                  <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent">
                    <option value="bolivia">Bolivia</option>
                    <option value="colombia">Colombia</option>
                    <option value="peru">Perú</option>
                  </select>
                </div>
              </div>
              
              <!-- Guardar nuevo beneficiario -->
              <div v-if="remittanceData.recipientType === 'new'" class="mt-2">
                <div class="flex items-center">
                  <input 
                    id="save_new" 
                    v-model="remittanceData.saveRecipient" 
                    type="checkbox" 
                    class="text-[#146EBE]"
                  >
                  <label for="save_new" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Guardar para futuros envíos</label>
                </div>
              </div>
            </div>
            
            <!-- Detalles de la remesa -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Detalles de la Remesa</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Moneda de envío</label>
                  <select 
                    v-model="remittanceData.sendCurrency"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
                  >
                    <option value="SEK">Corona Sueca (SEK)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">Dólar (USD)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Moneda de recepción</label>
                  <select 
                    v-model="remittanceData.receiveCurrency"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
                  >
                    <option value="BOB">Boliviano (BOB)</option>
                    <option value="COP">Peso Colombiano (COP)</option>
                    <option value="USD">Dólar (USD)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Monto a enviar</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">{{ remittanceData.sendCurrency }}</span>
                  <input 
                    v-model="remittanceData.amount"
                    type="number" 
                    class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" 
                    placeholder="0.00"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Método de recepción</label>
                <select 
                  v-model="remittanceData.receiveMethod"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
                >
                  <option value="qr">QR (Recomendado)</option>
                  <option value="bank">Cuenta Bancaria</option>
                </select>
                <p v-if="remittanceData.receiveMethod === 'bank'" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  <i class="fas fa-info-circle mr-1"></i>
                  Los depósitos a cuenta bancaria pueden demorar hasta 24 horas.
                </p>
              </div>
              
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Monto a recibir (estimado)</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">{{ remittanceData.receiveCurrency }}</span>
                  <input 
                    type="text" 
                    disabled 
                    class="w-full pl-12 pr-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300" 
                    :value="remittanceData.amount * remittanceData.rate"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Paso 2: Resumen de la transacción -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
            <h4 class="font-semibold text-[#146EBE] dark:text-blue-300 mb-3">Resumen de la Transacción</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Datos del destinatario -->
              <div class="space-y-3">
                <h5 class="font-medium text-gray-700 dark:text-gray-200 text-sm">Datos del Beneficiario</h5>
                <div class="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                  <div class="font-medium">María González</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Bogotá, Colombia</div>
                  <div class="mt-2 text-xs inline-flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    <i class="fas fa-qrcode mr-1"></i> Pago por QR
                  </div>
                </div>
              </div>
              
              <!-- Detalles del pago -->
              <div class="space-y-3">
                <h5 class="font-medium text-gray-700 dark:text-gray-200 text-sm">Detalles del Pago</h5>
                <div class="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm">
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                    <div class="text-gray-600 dark:text-gray-400">Envía:</div>
                    <div class="text-right font-medium">{{ remittanceData.amount.toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                    
                    <div class="text-gray-600 dark:text-gray-400">Comisión:</div>
                    <div class="text-right font-medium">{{ remittanceData.fee.toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                    
                    <div class="text-gray-600 dark:text-gray-400">Tipo de cambio:</div>
                    <div class="text-right font-medium">1 {{ remittanceData.sendCurrency }} = {{ remittanceData.rate }} {{ remittanceData.receiveCurrency }}</div>
                    
                    <div class="text-gray-600 dark:text-gray-400 font-medium pt-2 border-t dark:border-gray-600 mt-1">Total a pagar:</div>
                    <div class="text-right font-medium pt-2 border-t dark:border-gray-600 mt-1">{{ (remittanceData.amount + remittanceData.fee).toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                    
                    <div class="text-gray-600 dark:text-gray-400 font-medium">Beneficiario recibe:</div>
                    <div class="text-right font-medium text-green-700 dark:text-green-400">{{ (remittanceData.amount * remittanceData.rate).toFixed(2) }} {{ remittanceData.receiveCurrency }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Método de pago -->
          <div>
            <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-3">Método de pago</h4>
            <div class="space-y-3">
              <div class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-700/50">
                <input id="card_payment" type="radio" name="payment_method" class="text-[#146EBE]" checked>
                <label for="card_payment" class="ml-2 flex items-center">
                  <span class="text-sm text-gray-700 dark:text-gray-300 mr-3">Tarjeta de crédito/débito</span>
                  <div class="flex space-x-1">
                    <i class="fab fa-cc-visa text-blue-700"></i>
                    <i class="fab fa-cc-mastercard text-red-500"></i>
                    <i class="fab fa-cc-amex text-blue-500"></i>
                  </div>
                </label>
              </div>
              
              <div class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-700/50">
                <input id="bank_transfer" type="radio" name="payment_method" class="text-[#146EBE]">
                <label for="bank_transfer" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Transferencia bancaria
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pie del modal -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
        <button 
          v-if="currentStep === 2"
          @click="emit('goBack')" 
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </button>
        <div v-else></div>
        
        <div class="flex space-x-3">
          <button 
            @click="emit('close-remittance-modal')" 
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-md"
          >
            Cancelar
          </button>
          
          <button 
            v-if="currentStep === 1"
            @click="emit('goToSummary')" 
            class="px-4 py-2 bg-[#146EBE] text-white rounded-md hover:bg-blue-700 shadow-md flex items-center"
          >
            Continuar <i class="fas fa-arrow-right ml-2"></i>
          </button>
          
          <button 
            v-else
            @click="emit('confirmSend')" 
            class="px-4 py-2 bg-[#146EBE] text-white rounded-md hover:bg-blue-700 shadow-md"
          >
            Confirmar Envío
          </button>
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

input, select, textarea, button.rounded-md {
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

/* Estilos para oscurecer modales en modo oscuro */
.dark .shadow-md {
  box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.4);
}

/* Animación para mejorar la transición de los modales */
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.fixed.inset-0 > div {
  animation: modalFadeIn 0.2s ease-out forwards;
}

/* Estilos para modo oscuro */
.dark input[type="radio"],
.dark input[type="checkbox"] {
  background-color: #374151;
  border-color: #4B5563;
}

.dark option {
  background-color: #374151;
  color: #E5E7EB;
}

/* Mejora de accesibilidad para focus */
button:focus, 
input:focus, 
select:focus {
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
  
  .grid-cols-1 {
    row-gap: 1.5rem;
  }
  
  .space-x-3 > * {
    margin-left: 0.5rem;
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

/* Mejorar accesibilidad en hover de elementos interactivos */
button:hover {
  filter: brightness(1.1);
}

.rounded-md:active {
  transform: scale(0.97);
}
</style> 
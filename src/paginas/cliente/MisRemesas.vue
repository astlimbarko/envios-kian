<script setup>
import { ref } from 'vue'
import BotonGradiente from '../../components/BotonGradiente.vue'
import ModalRemesas from './ModalRemesas.vue'

// Estados para los modales
const showTermsModal = ref(false)
const showRemittanceModal = ref(false)
const showDetailModal = ref(false)
const currentStep = ref(1)
const showSuccessNotification = ref(false)

// Datos para los tipos de cambio
const cambioEstandar = ref(1.08)
const cambioEspecial = ref(1.09)
const fechaActualizacion = ref(new Date().toLocaleDateString('es-ES', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric' 
}))

// Datos para la visualización de detalles
const selectedRemittance = ref({
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

// Datos de la remesa
const remittanceData = ref({
  recipientType: 'saved',
  recipientId: '',
  saveRecipient: false,
  sendCurrency: 'SEK',
  receiveCurrency: 'BOB',
  amount: 1000,
  receiveMethod: 'qr',
  estimatedReceive: 690,
  fee: 50,
  rate: 1.09, // Actualizado al nuevo tipo de cambio
  paymentMethod: 'swish' // Nuevo campo para el método de pago
})

// Abrir modal de términos
const openNewRemittance = () => {
  showTermsModal.value = true
}

// Abrir modal de detalles
const openDetailModal = (remittance) => {
  // En una aplicación real, aquí cargaríamos los datos de la remesa seleccionada
  selectedRemittance.value = remittance || selectedRemittance.value
  showDetailModal.value = true
}

// Aceptar términos y abrir modal de remesa
const acceptTerms = () => {
  showTermsModal.value = false
  showRemittanceModal.value = true
  currentStep.value = 1
}

// Cerrar modal de términos
const closeTerms = () => {
  showTermsModal.value = false
}

// Cerrar modal de detalles
const closeDetailModal = () => {
  showDetailModal.value = false
}

// Ir al paso de método de pago
const goToPayment = () => {
  currentStep.value = 2
}

// Ir al resumen de la transacción
const goToSummary = () => {
  currentStep.value = 3
}

// Volver al paso anterior
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Cerrar modal de remesa
const closeRemittanceModal = () => {
  showRemittanceModal.value = false
  currentStep.value = 1
}

// Confirmar envío
const confirmSend = () => {
  showRemittanceModal.value = false
  currentStep.value = 1
  
  // Aquí iría el código para procesar la remesa
  
  // Mostrar mensaje de éxito
  showSuccessNotification.value = true
  
  // Ocultar notificación después de 5 segundos
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 5000)
}

// Copiar datos de remesa
const copyRemittance = (remittance) => {
  // En una aplicación real, copiaríamos los datos al formulario
  alert('Datos copiados para crear nueva remesa')
}
</script>

<template>
  <div class="app-content w-full mx-auto -mt-1 transition-colors duration-300">
    <!-- Fecha de actualización -->
    <div class="flex justify-end mb-1">
      <div class="text-xs bg-gradient-to-r from-transparent to-blue-50/50 dark:to-blue-900/20 px-3 py-0.5 rounded-lg shadow-sm border-r border-t border-blue-100/50 dark:border-blue-800/20 inline-flex items-center space-x-1 backdrop-blur-sm">
        <i class="fas fa-clock text-blue-400/70 dark:text-blue-400/60 mr-1.5"></i>
        <span class="text-gray-600 dark:text-gray-300 font-medium">Actualizado:</span>
        <span class="text-gray-500 dark:text-gray-400">{{ fechaActualizacion }} - {{ new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</span>
      </div>
    </div>
    
    <!-- Notificación de éxito -->
    <div 
      v-if="showSuccessNotification" 
      class="fixed top-20 right-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded shadow-md z-50 animate-slide-in-right max-w-sm"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle text-green-500 dark:text-green-300 text-xl mr-3"></i>
        <div>
          <p class="font-medium">¡Remesa enviada con éxito!</p>
          <p class="text-sm mt-1">Tu beneficiario recibirá el dinero pronto.</p>
        </div>
        <button 
          @click="showSuccessNotification = false" 
          class="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <!-- Encabezado de la página -->
    <div class="flex flex-wrap justify-between items-center mb-3">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0">Mis Remesas</h1>
      <BotonGradiente 
        @click="openNewRemittance"
        texto="Nueva Remesa"
        icono="plus"
        :anchoCompleto="false"
        tamanio="md"
        tipo="primario"
      />
    </div>
    
    <!-- Tarjetas de tipos de cambio -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
      <!-- Tarjeta de tipo de cambio estándar -->
      <div class="relative group overflow-hidden rounded-xl shadow-md border border-blue-100/70 dark:border-blue-700/50 transition-all duration-300 hover:shadow-lg tarjeta-cambio">
        <!-- Fondo con efecto de vidrio -->
        <div class="absolute inset-0 bg-gradient-to-r from-violet-50/60 to-blue-50/60 dark:from-violet-900/30 dark:to-blue-900/30 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-80"></div>
        
        <!-- Decoración -->
        <div class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-100/30 to-transparent dark:from-blue-700/20 dark:to-transparent"></div>
        <div class="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-purple-200/20 dark:bg-purple-700/20"></div>
        
        <!-- Contenido -->
        <div class="p-4 relative backdrop-blur-sm dark:bg-gray-800/30">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-100/80 to-blue-100/80 dark:from-violet-800/80 dark:to-blue-800/80 text-blue-600 dark:text-blue-300 shadow-sm">
                <i class="fas fa-exchange-alt text-xl"></i>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">Tipo de cambio estándar</h3>
              <div class="flex items-baseline">
                <span class="text-2xl font-bold text-[#146EBE] dark:text-blue-300 mr-1">{{ cambioEstandar }}</span>
                <span class="text-gray-500 dark:text-gray-400 text-sm">SEK → BOB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tarjeta de tipo de cambio especial -->
      <div class="relative group overflow-hidden rounded-xl shadow-md border border-indigo-200/70 dark:border-indigo-600/50 transition-all duration-300 hover:shadow-lg tarjeta-cambio border-shine">
        <!-- Fondo con efecto de vidrio -->
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-50/60 to-fuchsia-50/30 dark:from-cyan-900/40 dark:to-fuchsia-900/40 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-80"></div>
        
        <!-- Decoración -->
        <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-400/10 dark:from-cyan-500/30 dark:to-indigo-500/30"></div>
        <div class="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-300/20 to-indigo-300/10 dark:from-cyan-600/30 dark:to-indigo-600/20"></div>
        <div class="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-indigo-100/30 to-transparent dark:from-indigo-700/20 dark:to-transparent"></div>
        
        <!-- Contenido -->
        <div class="p-4 relative backdrop-blur-sm dark:bg-gray-800/30">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-100/80 to-fuchsia-100/60 dark:from-cyan-800/80 dark:to-fuchsia-800/50 text-[#146EBE] dark:text-indigo-300 pulse-icon shadow-sm">
                <i class="fas fa-star text-xl"></i>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300">Tipo de cambio especial</h3>
              <div class="flex items-baseline">
                <span class="text-2xl font-bold text-[#146EBE] dark:text-indigo-300 mr-1">{{ cambioEspecial }}</span>
                <span class="text-gray-500 dark:text-gray-400 text-sm">SEK → BOB</span>
              </div>
              <div class="flex items-center mt-1">
                <span class="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100/90 to-indigo-100/90 dark:from-blue-700/90 dark:to-indigo-700/90 text-blue-800 dark:text-blue-200">
                  <i class="fas fa-arrow-up text-xs mr-1"></i> +0.01
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tabla de remesas recientes -->
    <div class="bg-[var(--color-table-bg)] dark:bg-gray-900 rounded-lg shadow-md border border-white dark:border-gray-700 transition-all duration-300">
      <div class="p-4 border-b border-white dark:border-gray-700 bg-[var(--color-table-header)] dark:bg-gray-800 flex flex-wrap justify-between items-center rounded-t-lg">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Remesas Recientes</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-white dark:divide-gray-700">
          <thead class="bg-[var(--color-table-header)] dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                Fecha
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                Destinatario
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700 hidden sm:table-cell">
                Monto
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700 hidden sm:table-cell">
                Estado
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-[var(--color-table-bg)] dark:bg-gray-900 divide-y divide-white dark:divide-gray-700">
            <!-- Ejemplo 1 -->
            <tr class="transition-colors hover:bg-[var(--color-table-hover)] dark:hover:bg-gray-800">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                21/04/2023
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-0">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                      María González
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      Bogotá, Colombia
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium hidden sm:table-cell">
                $850.00
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  Completada
                </span>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-x-1 sm:space-x-2">
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors" @click="openDetailModal()">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-[#146EBE] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" @click="copyRemittance()">
                  <i class="fas fa-copy"></i>
                </button>
              </td>
            </tr>
            
            <!-- Ejemplo 2 -->
            <tr class="transition-colors bg-[var(--color-table-alt-row)] dark:bg-gray-800/40 hover:bg-[var(--color-table-hover)] dark:hover:bg-gray-800">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                18/04/2023
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-0">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                      Juan Martínez
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      Lima, Perú
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium hidden sm:table-cell">
                $1,200.00
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
                  En progreso
                </span>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-x-1 sm:space-x-2">
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors" @click="openDetailModal()">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-[#146EBE] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" @click="copyRemittance()">
                  <i class="fas fa-copy"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-white dark:border-gray-700 bg-[var(--color-table-header)] dark:bg-gray-800 rounded-b-lg flex justify-end">
        <button class="text-[#293841] dark:text-blue-400 hover:text-[#146EBE] dark:hover:text-blue-300 transition-colors text-sm font-medium">
          Ver Todas las Remesas <i class="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
    </div>
    
    <!-- Componente que contiene todos los modales -->
    <ModalRemesas 
      :showTermsModal="showTermsModal"
      :showRemittanceModal="showRemittanceModal" 
      :showDetailModal="showDetailModal"
      :currentStep="currentStep"
      :remittanceData="remittanceData"
      :selectedRemittance="selectedRemittance"
      @acceptTerms="acceptTerms"
      @closeTerms="closeTerms"
      @closeRemittanceModal="closeRemittanceModal"
      @closeDetailModal="closeDetailModal"
      @goToPayment="goToPayment"
      @goToSummary="goToSummary"
      @goBack="goBack"
      @confirmSend="confirmSend"
    />
  </div>
</template>

<style scoped>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}

/* Estilos para las tarjetas de tipo de cambio */
.tarjeta-cambio {
  transition: all 0.3s ease;
}

.tarjeta-cambio:hover {
  transform: translateY(-2px);
}

/* Animación de brillo para la tarjeta especial */
@keyframes shine {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  20% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  80% {
    opacity: 0.1;
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

.border-shine {
  position: relative;
  overflow: hidden;
}

.border-shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transform: translateX(-100%);
  animation: shine 5s infinite ease-out;
  pointer-events: none;
}

/* Animación de pulso para el ícono */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-icon {
  animation: pulse 2s infinite ease-in-out;
}
</style>

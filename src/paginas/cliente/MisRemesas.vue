<script setup>
import { ref } from 'vue'
import MisRemesasModales from './MisRemesasModales.vue'

// Estados para los modales
const showTermsModal = ref(false)
const showRemittanceModal = ref(false)
const showSummaryModal = ref(false)
const currentStep = ref(1)
const showSuccessNotification = ref(false)

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
  rate: 0.69
})

// Abrir modal de términos
const openNewRemittance = () => {
  showTermsModal.value = true
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

// Pasar al resumen
const goToSummary = () => {
  currentStep.value = 2
}

// Volver al paso 1
const goBack = () => {
  currentStep.value = 1
}

// Cerrar modal de remesa
const closeRemittanceModal = () => {
  showRemittanceModal.value = false
  currentStep.value = 1
}

// Confirmar envío
const confirmSend = () => {
  showRemittanceModal.value = false
  
  // Aquí iría el código para procesar la remesa
  
  // Mostrar mensaje de éxito
  showSuccessNotification.value = true
  
  // Ocultar notificación después de 5 segundos
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 5000)
}
</script>

<template>
  <div class="app-content w-full mx-auto transition-colors duration-300">
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
    <div class="flex flex-wrap justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0">Mis Remesas</h1>
      <button 
        @click="openNewRemittance"
        class="bg-[#146EBE] hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center text-sm transition-colors w-full sm:w-auto"
      >
        <i class="fas fa-plus mr-2"></i> Nueva Remesa
      </button>
    </div>
    
    <!-- Tabla de remesas recientes -->
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Remesas Recientes</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Fecha
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Destinatario
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 hidden sm:table-cell">
                Monto
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 hidden sm:table-cell">
                Estado
              </th>
              <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Ejemplo 1 -->
            <tr class="transition-colors hover:bg-blue-50 dark:hover:bg-gray-800">
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
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-[#146EBE] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  <i class="fas fa-copy"></i>
                </button>
              </td>
            </tr>
            
            <!-- Ejemplo 2 -->
            <tr class="transition-colors bg-gray-50 dark:bg-gray-800/40 hover:bg-blue-50 dark:hover:bg-gray-800">
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
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-gray-400 dark:text-gray-500 cursor-not-allowed">
                  <i class="fas fa-copy"></i>
                </button>
              </td>
            </tr>
            
            <!-- Ejemplo 3 -->
            <tr class="transition-colors hover:bg-blue-50 dark:hover:bg-gray-800">
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                15/04/2023
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-0">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                      Carlos Ramírez
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      Quito, Ecuador
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium hidden sm:table-cell">
                $530.00
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                  Completada
                </span>
              </td>
              <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-x-1 sm:space-x-2">
                <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-[#146EBE] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  <i class="fas fa-copy"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pie de tabla con botón para ver todas las remesas -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-right">
        <button class="text-[#293841] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm">
          Ver Todas las Remesas <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
    
    <!-- Modales para nueva remesa -->
    <MisRemesasModales
      :show-terms-modal="showTermsModal"
      :show-remittance-modal="showRemittanceModal"
      :show-summary-modal="showSummaryModal"
      :current-step="currentStep"
      :remittance-data="remittanceData"
      @accept-terms="acceptTerms"
      @close-terms="closeTerms"
      @go-to-summary="goToSummary"
      @go-back="goBack"
      @close-remittance-modal="closeRemittanceModal"
      @confirm-send="confirmSend"
    />
  </div>
</template>

<style scoped>
/* Establece un contexto de renderizado para asegurar que el componente se dibuje correctamente */
:root {
  contain: paint;
}

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

/* Mejorar sombras para mayor profundidad */
.shadow-md {
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Modo oscuro para sombras */
.dark .shadow-md {
  box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.3);
}

/* Backdrop blur estilo Windows 11 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Estilos específicos para el botón "Ver Todas las Remesas" */
.ver-todas-btn {
  color: #293841 !important;
}

.dark .ver-todas-btn {
  color: #111B21 !important;
}

.ver-todas-btn:hover {
  color: #0e4a80 !important;
}

.dark .ver-todas-btn:hover {
  color: #60a5fa !important;
}

/* Estilo zebra mejorado */
tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.02);
}

.dark tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.03);
}

/* Asegura que la tabla sea responsiva */
.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Asegura que el contenido de la tabla no se desborde */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Media queries para diferentes tamaños de pantalla */
@media (max-width: 640px) {
  td, th {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .space-x-1 > * + * {
    margin-left: 0.25rem;
  }
}

@media (max-width: 480px) {
  .table-container {
    border-radius: 0.375rem;
    overflow: hidden;
  }
}

/* Aseguramos que la tabla sea responsiva y funcione con las clases de layout */
.app-content {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}

/* Otras clases de estilo específicas */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 640px) {
  .app-content {
    padding: 0.5rem;
  }
  
  .table-container {
    margin: 0 -1rem;
  }
}

/* Animación para la notificación */
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
  animation: slide-in-right 0.3s forwards;
}
</style>

<script setup>
import { ref } from 'vue'
import BotonGradiente from '../../components/BotonGradiente.vue'
import ModalRemesas from './ModalRemesas.vue'
import MisRemesasPago from './MisRemesasPago.vue'
import MisRemesasPagoDestino from './MisRemesasPagoDestino.vue'
import MisRemesasNueva from './MisRemesasNueva.vue'

// Estados para los modales
const showTermsModal = ref(false)
const showRemittanceModal = ref(false)
const showDetailModal = ref(false)
const showPagoModal = ref(false)
const showPagoDestinoModal = ref(false)
const currentStep = ref(1)
const showSuccessNotification = ref(false)

// Estado para el archivo subido
const uploadedFileName = ref('')

// Estado para los pagos completados
const pagoRemitenteCompletado = ref(false)
const pagoDestinatarioCompletado = ref(false)

// Estado para las remesas
const remesas = ref([
  {
    id: '12345',
    date: '21/04/2023',
    recipient: 'María González',
    location: 'Santa Cruz, Bolivia',
    amount: 850.00,
    currency: 'SEK',
    receivedAmount: 5865.00,
    receivedCurrency: 'BOB',
    status: 'En Progreso',
    statusClass: 'yellow',
    paymentMethod: 'Pendiente',
    receiveMethod: 'Pendiente',
    trackingCode: 'REF-1234-5678-90'
  }
])

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

// Función para manejar la subida de archivo
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadedFileName.value = file.name
  }
}

// Abrir modal de términos
const openNewRemittance = () => {
  showRemittanceModal.value = true
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

// Función para abrir modal de pago
const openPagoModal = () => {
  showPagoModal.value = true
}

// Función para cerrar modal de pago
const closePagoModal = () => {
  showPagoModal.value = false
}

// Función para abrir modal de pago a destinatario
const openPagoDestinoModal = () => {
  showPagoDestinoModal.value = true
}

// Función para cerrar modal de pago a destinatario
const closePagoDestinoModal = () => {
  showPagoDestinoModal.value = false
}

// Función para manejar la finalización del pago del remitente
const handlePagoRemitenteCompleted = () => {
  pagoRemitenteCompletado.value = true
  showPagoModal.value = false
}

// Función para manejar la finalización del pago al destinatario
const handlePagoDestinatarioCompleted = () => {
  pagoDestinatarioCompletado.value = true
  showPagoDestinoModal.value = false
}

// Función para agregar nueva remesa
const handleNewRemittance = (newRemittance) => {
  remesas.value.unshift(newRemittance)
  showSuccessNotification.value = true
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 5000)
}
</script>

<template>
  <div class="app-content w-full mx-auto -mt-1 transition-colors duration-300 max-w-none">
    <!-- Fecha de actualización -->
    <div class="flex justify-end mb-1 px-2 sm:px-4">
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
    

    
    <!-- Tarjetas de tipos de cambio -->
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 px-2 sm:px-4">
      <!-- Tarjeta de tipo de cambio estándar -->
      <div class="relative group overflow-hidden rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg tarjeta-cambio w-full max-w-full">
        <!-- Fondo con efecto de vidrio -->
        <div class="absolute inset-0 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800/30 dark:to-gray-700/30 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-80"></div>
        
        <!-- Decoración -->
        <div class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-100/30 to-transparent dark:from-gray-700/20 dark:to-transparent"></div>
        <div class="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-gray-200/20 dark:bg-gray-600/20"></div>
        
        <!-- Contenido -->
        <div class="p-2 sm:p-4 relative backdrop-blur-sm dark:bg-gray-800/30">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-2 sm:mr-4">
              <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-600/80 text-gray-600 dark:text-gray-300 shadow-sm">
                <i class="fas fa-exchange-alt text-base sm:text-xl"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Tipo de cambio estándar</h3>
              <div class="flex items-baseline">
                <span class="text-lg sm:text-2xl font-bold text-[#146EBE] dark:text-gray-200 mr-1">{{ cambioEstandar }}</span>
                <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">SEK → BOB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tarjeta de tipo de cambio especial -->
      <div class="relative group overflow-hidden rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg tarjeta-cambio border-shine w-full max-w-full">
        <!-- Fondo con efecto de vidrio -->
        <div class="absolute inset-0 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800/40 dark:to-gray-700/40 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-80"></div>
        
        <!-- Decoración -->
        <div class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-gray-300/20 to-gray-400/10 dark:from-gray-500/30 dark:to-gray-600/30"></div>
        <div class="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-gradient-to-tr from-gray-300/20 to-gray-400/10 dark:from-gray-500/30 dark:to-gray-600/20"></div>
        <div class="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-gray-100/30 to-transparent dark:from-gray-700/20 dark:to-transparent"></div>
        
        <!-- Contenido -->
        <div class="p-2 sm:p-4 relative backdrop-blur-sm dark:bg-gray-800/30">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-2 sm:mr-4">
              <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-gray-700/80 dark:to-gray-600/50 text-[#146EBE] dark:text-gray-200 pulse-icon shadow-sm">
                <i class="fas fa-star text-base sm:text-xl"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Tipo de cambio especial</h3>
              <div class="flex items-baseline">
                <span class="text-lg sm:text-2xl font-bold text-[#146EBE] dark:text-gray-200 mr-1">{{ cambioEspecial }}</span>
                <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">SEK → BOB</span>
              </div>
              <div class="flex items-center mt-1">
                <span class="inline-flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-gray-100/90 to-gray-200/90 dark:from-gray-700/90 dark:to-gray-600/90 text-gray-800 dark:text-gray-200">
                  <i class="fas fa-arrow-up text-xs mr-1"></i> +0.01
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Encabezado de la página -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-3 px-2 sm:px-4">
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

    <!-- AREA A MODIFICAR -->
    <!-- Tabla de remesas recientes -->
    <div class="bg-[var(--color-table-bg)] dark:bg-gray-900 rounded-lg shadow-md border border-white dark:border-gray-700 transition-all duration-300 mx-2 sm:mx-4">
      
      <!-- Tabla responsive -->
      <div class="overflow-x-auto">
        <div class="min-w-full">
          <table class="w-full divide-y divide-white dark:divide-gray-700">
            <thead class="bg-[var(--color-table-header)] dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Fecha
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Destinatario
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Enviado
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Recibido
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Pago del Remitente
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Pago a Destinatario
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Estado
                </th>
                <th scope="col" class="px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-white dark:border-gray-700">
                  Voucher
                </th>
              </tr>
            </thead>
            <tbody class="bg-[var(--color-table-bg)] dark:bg-gray-900 divide-y divide-white dark:divide-gray-700">
              <tr v-for="remesa in remesas" :key="remesa.id" class="transition-colors hover:bg-[var(--color-table-hover)] dark:hover:bg-gray-800">
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {{ remesa.date }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <div class="ml-0">
                      <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ remesa.recipient }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ remesa.location }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ remesa.amount }} {{ remesa.currency }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="showPagoModal = true"
                    :class="[
                      'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white transition-all duration-200 shadow-sm hover:shadow-md',
                      pagoRemitenteCompletado
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    ]"
                  >
                    <i class="fas fa-credit-card mr-1.5"></i>
                    {{ pagoRemitenteCompletado ? 'Pago Completado' : 'Método de Pago' }}
                  </button>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="openPagoDestinoModal"
                    :class="[
                      'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white transition-all duration-200 shadow-sm hover:shadow-md',
                      pagoDestinatarioCompletado
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    ]"
                  >
                    <i class="fas fa-money-bill-wave mr-1.5"></i>
                    {{ pagoDestinatarioCompletado ? 'Pago Completado' : 'Pago a Destinatario' }}
                  </button>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    remesa.statusClass === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' :
                    remesa.statusClass === 'green' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                  ]">
                    {{ remesa.status }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors" @click="openDetailModal(remesa)">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      

    </div>
    <div class="flex justify-end my-4">
      <button class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
        Historial de Remesas <i class="fas fa-arrow-right ml-1.5"></i>
      </button>
    </div>


    <!-- Componente que contiene todos los modales -->
    <!-- Eliminar ModalRemesas ya que usaremos MisRemesasNueva -->

    <!-- Modal de método de pago -->
    <MisRemesasPago
      v-if="showPagoModal"
      @close="showPagoModal = false"
      @paymentCompleted="handlePagoRemitenteCompleted"
    />

    <!-- Modal de pago a destinatario -->
    <MisRemesasPagoDestino
      v-if="showPagoDestinoModal"
      @close="closePagoDestinoModal"
      @paymentCompleted="handlePagoDestinatarioCompleted"
    />

    <!-- Modal de nueva remesa -->
    <MisRemesasNueva
      v-if="showRemittanceModal"
      @close="closeRemittanceModal"
      @newRemittance="handleNewRemittance"
    />
  </div>
</template>

<style scoped>
/* Asegurar que el contenido ocupe todo el ancho disponible */
.app-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* Ajustar el contenedor de la tabla para que sea responsive */
.overflow-x-auto {
  width: 100%;
  max-width: 100%;
}

/* Asegurar que la tabla ocupe todo el ancho disponible */
table {
  width: 100%;
  min-width: 100%;
}

/* Ajustar el contenedor de las tarjetas */
.grid {
  width: 100%;
  max-width: 100%;
}
</style>
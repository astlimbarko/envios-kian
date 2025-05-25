<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] py-8">
      <!-- Encabezado más compacto -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Remesas</h1>
        <p class="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gestiona tus envíos de dinero de manera rápida y segura
        </p>
      </div>

      <!-- Remesas en Proceso -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <i class="fas fa-clock text-blue-500 mr-2"></i>
          Remesas en Proceso
        </h2>

        <!-- Estado Vacío más compacto -->
        <div v-if="remesasEnProceso.length === 0" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <i class="fas fa-inbox text-3xl text-gray-400 dark:text-gray-600"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No tienes remesas en proceso</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Cuando envíes dinero, tus remesas aparecerán aquí
          </p>
        </div>

        <!-- Grid de Remesas -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <div v-for="remesa in remesasEnProceso" 
               :key="remesa.id"
               class="w-full h-full">
            <!-- Tarjeta más compacta -->
            <div class="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-lg overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
              <!-- Cabecera más compacta -->
              <div class="p-4 border-b border-blue-500/20">
                <div class="flex justify-between items-start gap-3">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-white mb-1 truncate">{{ remesa.recipient }}</h3>
                    <p class="text-blue-200/80 flex items-center text-xs">
                      <i class="far fa-calendar-alt mr-1"></i>
                      {{ remesa.date }}
                    </p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-medium flex items-center whitespace-nowrap flex-shrink-0"
                        :class="{
                          'bg-yellow-500/20 text-yellow-200': remesa.status === 'En Progreso',
                          'bg-green-500/20 text-green-200': remesa.status === 'Completada',
                          'bg-red-500/20 text-red-200': remesa.status === 'Cancelada'
                        }">
                    <i class="fas mr-1" :class="{
                      'fa-spinner fa-spin': remesa.status === 'En Progreso',
                      'fa-check-circle': remesa.status === 'Completada',
                      'fa-times-circle': remesa.status === 'Cancelada'
                    }"></i>
                    {{ remesa.status }}
                  </span>
                </div>
              </div>

              <!-- Contenido más compacto -->
              <div class="p-4 space-y-2 flex-grow">
                <div class="flex justify-between items-center">
                  <span class="text-blue-200/80 flex items-center text-sm">
                    <i class="fas fa-money-bill-wave mr-2"></i>
                    Monto enviado
                  </span>
                  <span class="text-white font-medium text-sm ml-4">{{ remesa.amount }} {{ remesa.currency }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-blue-200/80 flex items-center text-sm">
                    <i class="fas fa-hand-holding-usd mr-2"></i>
                    Monto recibido
                  </span>
                  <span class="text-white font-medium text-sm ml-4">{{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-blue-200/80 flex items-center text-sm">
                    <i class="fas fa-credit-card mr-2"></i>
                    Método de pago
                  </span>
                  <span class="text-white font-medium text-sm ml-4">{{ remesa.paymentMethod }}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-blue-200/80 flex items-center text-sm">
                    <i class="fas fa-exchange-alt mr-2"></i>
                    Método de recepción
                  </span>
                  <span class="text-white font-medium text-sm ml-4">{{ remesa.receiveMethod }}</span>
                </div>
              </div>

              <!-- Pie de la Tarjeta más compacto -->
              <div class="px-4 py-3 bg-blue-900/50 border-t border-blue-500/20 mt-auto">
                <div class="flex justify-between items-center flex-wrap gap-3">
                  <p class="text-blue-200/80 text-xs flex items-center">
                    <i class="fas fa-barcode mr-1"></i>
                    Código: <span class="text-white font-medium ml-1">{{ remesa.trackingCode }}</span>
                  </p>
                  <div class="flex space-x-2">
                    <button v-if="remesa.status === 'En Progreso'"
                            @click="confirmarCancelacion(remesa)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors flex items-center">
                      <i class="fas fa-times mr-1"></i>
                      Cancelar
                    </button>
                    <button @click="verDetalles(remesa)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition-colors flex items-center">
                      <i class="fas fa-eye mr-1"></i>
                      Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Remesas Anteriores -->
      <div v-show="mostrarRemesasAnteriores" class="animate-fade-in">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <i class="fas fa-history text-blue-500 mr-3"></i>
          Remesas Anteriores
        </h2>

        <!-- Estado Vacío -->
        <div v-if="remesasAnteriores.length === 0" 
             class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <i class="fas fa-history text-4xl text-gray-400 dark:text-gray-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes remesas anteriores</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Tu historial de remesas aparecerá aquí
          </p>
        </div>

        <!-- Grid de Remesas Anteriores -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          <!-- Mismo diseño que las remesas en proceso -->
        </div>
      </div>

      <!-- Botón Ver Historial -->
      <div class="mt-12 flex justify-center">
        <button @click="mostrarRemesasAnteriores = !mostrarRemesasAnteriores"
                class="px-6 py-3 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
          <i class="fas mr-2" :class="mostrarRemesasAnteriores ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          {{ mostrarRemesasAnteriores ? 'Ocultar Historial' : 'Ver Historial' }}
        </button>
      </div>

      <!-- Modal de Detalles Mejorado -->
      <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalles de la Remesa</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Información completa de la transacción</p>
              </div>
              <button @click="showDetailsModal = false" 
                      class="text-gray-400 hover:text-gray-500 transition-colors">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div v-if="selectedRemesa" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">N° Remesa</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">#{{ selectedRemesa.id }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.date }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Remitente</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.recipient }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Destinatario</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.location }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Monto Enviado</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.amount }} {{ selectedRemesa.currency }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Monto Recibido</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.receivedAmount }} {{ selectedRemesa.receivedCurrency }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.status }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Método de Pago</p>
                  <p class="text-base text-gray-900 dark:text-white font-medium">{{ selectedRemesa.paymentMethod }}</p>
                </div>
              </div>
              
              <!-- Acciones adicionales -->
              <div class="flex justify-end space-x-3 mt-6">
                <button v-if="selectedRemesa.status === 'En Progreso'"
                        @click="confirmarCancelacion(selectedRemesa)"
                        class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center">
                  <i class="fas fa-times mr-2"></i>
                  Cancelar Remesa
                </button>
                <button @click="showDetailsModal = false"
                        class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmación de Cancelación Mejorado -->
      <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Cancelar Remesa?</h3>
              <p class="text-gray-600 dark:text-gray-400">
                Esta acción no se puede deshacer. ¿Estás seguro de que deseas cancelar esta remesa?
              </p>
            </div>
            
            <div class="flex justify-center space-x-4">
              <button @click="showCancelModal = false"
                      class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                No, mantener
              </button>
              <button @click="cancelarRemesa"
                      class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification Mejorado -->
      <div v-if="showToast"
           class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
        <i class="fas fa-check-circle"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRemesaStore } from '../../store/remesa'

const store = useRemesaStore()
const mostrarRemesasAnteriores = ref(false)
const showDetailsModal = ref(false)
const showCancelModal = ref(false)
const selectedRemesa = ref(null)
const remesaToCancel = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 10

// Usar los getters del store para las remesas
const remesasEnProceso = computed(() => store.remesasEnProceso)
const remesasAnteriores = computed(() => store.remesasAnteriores)

// Paginación
const totalPaginas = computed(() => Math.ceil(remesasAnteriores.value.length / itemsPorPagina))
const inicioPaginacion = computed(() => ((paginaActual.value - 1) * itemsPorPagina) + 1)
const finPaginacion = computed(() => Math.min(paginaActual.value * itemsPorPagina, remesasAnteriores.value.length))
const remesasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return remesasAnteriores.value.slice(inicio, fin)
})

function verDetalles(remesa) {
  selectedRemesa.value = remesa
  showDetailsModal.value = true
}

function confirmarCancelacion(remesa) {
  remesaToCancel.value = remesa
  showCancelModal.value = true
}

function cancelarRemesa() {
  if (remesaToCancel.value) {
    // Aquí iría la lógica para cancelar la remesa en la base de datos
    const index = remesasEnProceso.value.findIndex(r => r.id === remesaToCancel.value.id)
    if (index !== -1) {
      remesasEnProceso.value[index].status = 'Cancelada'
    }
    
    // Mostrar toast
    showToast.value = true
    toastMessage.value = 'Remesa cancelada exitosamente'
    
    // Ocultar toast después de 3 segundos
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
  
  showCancelModal.value = false
  remesaToCancel.value = null
}
</script>

<style>
/* Solo mantener las animaciones necesarias */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ajustes responsivos adicionales */
@media (min-width: 1280px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1536px) {
  .container {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>

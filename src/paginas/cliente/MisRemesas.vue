<template>
  <div class="min-h-screen bg-white-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mis Remesas</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Gestiona tus envíos de dinero de manera rápida y segura
        </p>
      </div>

      <!-- Remesas en Proceso -->
      <div class="mb-10">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-5">Remesas en Proceso</h2>

        <div class="bg-white dark:bg-[#1f2a30] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div v-if="remesasEnProceso.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <i class="fas fa-inbox text-4xl mb-4 text-gray-400 dark:text-gray-600"></i>
            <p class="text-lg">No tienes remesas en proceso</p>
          </div>
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="remesa in remesasEnProceso" :key="remesa.id" 
                 class="p-6 hover:bg-gray-50 dark:hover:bg-[#263238] transition-colors duration-200">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <i class="fas fa-money-bill-wave text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ remesa.recipient }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ remesa.date }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">#{{ remesa.id }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ remesa.amount }} {{ remesa.currency }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 text-sm font-medium rounded-full shadow-sm"
                        :class="{
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200': remesa.status === 'En Progreso',
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200': remesa.status === 'Completada',
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200': remesa.status === 'Cancelada'
                        }">
                    {{ remesa.status }}
                  </span>
                  <button @click="verDetalles(remesa)" 
                          class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Remesas Anteriores -->
      <div v-show="mostrarRemesasAnteriores" class="animate-fade-in">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Remesas Anteriores</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div v-if="remesasAnteriores.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <i class="fas fa-history text-4xl mb-4 text-gray-400 dark:text-gray-600"></i>
            <p class="text-lg">No tienes remesas anteriores</p>
          </div>
          <div v-else>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="remesa in remesasPaginadas" :key="remesa.id" 
                   class="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <i class="fas fa-history text-gray-500 dark:text-gray-400"></i>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ remesa.recipient }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ remesa.date }}</p>
                      <p class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">#{{ remesa.id }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ remesa.amount }} {{ remesa.currency }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button @click="descargarComprobante(remesa)" 
                            class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Descargar Comprobante">
                      <i class="fas fa-download"></i>
                    </button>
                    <button @click="verDetalles(remesa)" 
                            class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paginación -->
            <div v-if="totalPaginas > 1" class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div class="flex-1 flex justify-between sm:hidden">
                <button @click="paginaActual--" 
                        :disabled="paginaActual === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Anterior
                </button>
                <button @click="paginaActual++"
                        :disabled="paginaActual === totalPaginas"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Siguiente
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span class="font-medium">{{ inicioPaginacion }}</span> a 
                    <span class="font-medium">{{ finPaginacion }}</span> de 
                    <span class="font-medium">{{ remesasAnteriores.length }}</span> resultados
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button @click="paginaActual--"
                            :disabled="paginaActual === 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span class="sr-only">Anterior</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button v-for="pagina in totalPaginas" 
                            :key="pagina"
                            @click="paginaActual = pagina"
                            :class="[
                              paginaActual === pagina 
                                ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                              'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                            ]">
                      {{ pagina }}
                    </button>
                    <button @click="paginaActual++"
                            :disabled="paginaActual === totalPaginas"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span class="sr-only">Siguiente</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="mt-8 flex justify-between items-center">
        <button 
          @click="mostrarRemesasAnteriores = !mostrarRemesasAnteriores"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <i class="fas mr-2" :class="mostrarRemesasAnteriores ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          {{ mostrarRemesasAnteriores ? 'Ocultar Historial' : 'Ver Historial' }}
        </button>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Detalles de la Remesa</h2>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-if="selectedRemesa" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">N° Remesa</p>
                <p class="text-base text-gray-900 dark:text-white">#{{ selectedRemesa.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.date }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Remitente</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.recipient }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Destinatario</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Monto Enviado</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.amount }} {{ selectedRemesa.currency }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Monto Recibido</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.receivedAmount }} {{ selectedRemesa.receivedCurrency }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.status }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Método de Pago</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>
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
const selectedRemesa = ref(null)
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

function descargarComprobante(remesa) {
  alert(`Simulando descarga del comprobante de ${remesa.recipient}`)
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

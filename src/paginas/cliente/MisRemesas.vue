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
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Remesas en Proceso</h2>
          <button 
            @click="mostrarRemesasAnteriores = !mostrarRemesasAnteriores"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>{{ mostrarRemesasAnteriores ? 'Ocultar Historial' : 'Ver Historial' }}</span>
            <i class="fas" :class="mostrarRemesasAnteriores ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
        </div>

        <div class="bg-gray-50 dark:bg-[#1f2a30] rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div v-if="remesasEnProceso.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No tienes remesas en proceso
          </div>
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="remesa in remesasEnProceso" :key="remesa.id" class="p-5 hover:bg-white dark:hover:bg-[#263238] transition-colors">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-sm">
                    <i class="fas fa-money-bill-wave text-blue-600 dark:text-blue-300 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ remesa.recipient }}</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ remesa.date }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ remesa.amount }} {{ remesa.currency }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                        :class="{
                          'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-200': remesa.status === 'En Progreso',
                          'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200': remesa.status === 'Completada',
                          'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-200': remesa.status === 'Cancelada'
                        }">
                    {{ remesa.status }}
                  </span>
                  <button @click="verDetalles(remesa)" 
                          class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div v-if="remesasAnteriores.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No tienes remesas anteriores
          </div>
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="remesa in remesasAnteriores" :key="remesa.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <i class="fas fa-history text-gray-500 dark:text-gray-400"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ remesa.recipient }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ remesa.date }}</p>
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
                  <button @click="descargarComprobante(remesa)" title="Descargar Comprobante"
                          class="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <i class="fas fa-download"></i>
                  </button>
                  <button @click="verDetalles(remesa)" class="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón Nueva Remesa -->
      <div class="mt-8 flex justify-end">
        <router-link
          to="/cliente/nueva-remesa"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <i class="fas fa-plus mr-2"></i>
          Nueva Remesa
        </router-link>
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
                <p class="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedRemesa.date }}</p>
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
    paymentMethod: 'Pendiente',
    receiveMethod: 'Pendiente',
    trackingCode: 'REF-1234-5678-90'
  },
  {
    id: '12346',
    date: '20/04/2023',
    recipient: 'Juan Pérez',
    location: 'La Paz, Bolivia',
    amount: 1200.00,
    currency: 'SEK',
    receivedAmount: 8280.00,
    receivedCurrency: 'BOB',
    status: 'Completada',
    paymentMethod: 'Swish',
    receiveMethod: 'Cuenta bancaria',
    trackingCode: 'REF-1234-5678-91'
  }
])

const mostrarRemesasAnteriores = ref(false)
const showDetailsModal = ref(false)
const selectedRemesa = ref(null)

const remesasEnProceso = computed(() => remesas.value.filter(r => r.status === 'En Progreso'))
const remesasAnteriores = computed(() => remesas.value.filter(r => r.status !== 'En Progreso'))

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
